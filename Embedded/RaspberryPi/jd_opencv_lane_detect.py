#-*-coding:utf-8-*-
import cv2
import numpy as np
import logging
import math
from gpiozero import AngularServo
from time import sleep
from adafruit_servokit import ServoKit
from adafruit_motor import motor
from adafruit_pca9685 import PCA9685
import time
import smbus2
import busio
import board

# 로깅 설정: 디버그 정보를 표시
logging.basicConfig(level=logging.DEBUG)

# 이미지 디버깅을 활성화하거나 비활성화하는 플래그
show_image = False  # 기본적으로 모든 디버깅 이미지를 비활성화

# JdOpencvLaneDetect 클래스 정의: 차선 감지 및 조향 제어
class JdOpencvLaneDetect(object):
    def __init__(self):
        self.curr_steering_angle = 90  # 현재 조향 각도를 중앙 위치로 초기화
        self.curr_throttle=0.1
        # I2C 버스 초기화 (SCL 및 SDA 핀 사용)
        self.i2c = busio.I2C(board.SCL, board.SDA)
        self.pca = PCA9685(self.i2c)  # PCA9685 인스턴스 생성 (PWM 제어용)
        self.pca.frequency = 60  # PCA9685 주파수 설정 (60Hz)

        # PWMThrottleHat 인스턴스 생성 (모터 스로틀 제어용)
        self.motor_hat = PWMThrottleHat(self.pca, channel=0)
        self.motor_hat.set_throttle(self.curr_throttle)  # 초기 스로틀 값 설정

    def get_lane(self, frame):
        # 차선을 감지하고 감지된 차선 및 이미지 반환
        lane_lines, lane_lines_image = detect_lane(frame)
        return lane_lines, lane_lines_image

    def get_steering_angle(self, img_lane, lane_lines):
        if len(lane_lines) == 0:
            return 0, None  # 차선이 감지되지 않으면 기본값 반환
        # 조향 각도를 계산하고 안정화
        new_steering_angle = compute_steering_angle(img_lane, lane_lines)
        self.curr_throttle, self.curr_steering_angle = stabilize_steering_angle(self.curr_steering_angle, new_steering_angle, len(lane_lines))
        
        logging.debug('new throttle angle: %s' % self.curr_throttle)

        # 서보를 새 조향 각도로 설정하고 헤딩 라인 표시
        set_servo_angle(kit, self.curr_steering_angle)
        self.motor_hat.set_throttle(self.curr_throttle)
        curr_heading_image = display_heading_line(img_lane, self.curr_steering_angle)
        return self.curr_steering_angle, curr_heading_image

def detect_lane(frame):
    # 차선 감지 및 차선 이미지 반환
    logging.debug('Lane Detecting...')
    edges = detect_edges(frame)  # 엣지 검출
    #show_image('edges',edges)

    cropped_edges = region_of_interest(edges)  # 관심 영역으로 자르기
    #show_image('edged cropeed', cropped_edges,True)

    line_segments = detect_line_segments(cropped_edges)  # 선분 감지
    line_segment_image = display_lines(frame, line_segments)  # 선분 표시
    #show_image("line segments",line_segment_image)

    lane_lines = average_slope_intercept(frame, line_segments)  # 차선 평균 기울기 계산
    lane_lines_image = display_lines(frame, lane_lines)  # 차선 표시


    return lane_lines, lane_lines_image

def detect_edges(frame):
    # 엣지 감지를 위한 이미지 전처리
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)  # 이미지 색상 변환
    lower_red1 = np.array([0, 70, 50])
    upper_red1 = np.array([10, 255, 255])
    mask1 = cv2.inRange(hsv, lower_red1, upper_red1)
    lower_red2 = np.array([170, 70, 50])
    upper_red2 = np.array([180, 255, 255])
    mask2 = cv2.inRange(hsv, lower_red2, upper_red2)
    mask = mask1+mask2

    edges = cv2.Canny(mask, 200, 400)  # Canny 엣지 감지
    return edges

def region_of_interest(canny):
    # 관심 영역으로 이미지를 자르기
    height, width = canny.shape
    mask = np.zeros_like(canny)

    polygon = np.array([[
        (0, height*(1/2)),
        (width, height*(1/2)),
        (width, height),
        (0, height),
        
    ]], np.int32)
    cv2.fillPoly(mask, polygon, 255)
    #cv2.imshow("mask",mask)
    masked_image = cv2.bitwise_and(canny, mask)
    return masked_image

def detect_line_segments(cropped_edges):
    # 선분 감지
    rho = 1
    angle = np.pi / 180
    min_threshold = 10
    line_segments = cv2.HoughLinesP(cropped_edges, rho, angle, min_threshold, np.array([]), minLineLength=15, maxLineGap=4)

    if line_segments is not None:
        for line_segment in line_segments:
            logging.debug('Lane Detected')
            logging.debug('%s, Length: %s' % (line_segment, length_of_line_segment(line_segment[0])))

    return line_segments

def average_slope_intercept(frame, line_segments):
    # 차선의 평균 기울기 및 절편 계산
    lane_lines = []
    if line_segments is None:
        logging.info('No Lanes')
        return lane_lines

    height, width, _ = frame.shape
    left_fit = []
    right_fit = []

    boundary = 1/3
    left_region_boundary = width * (1 - boundary)
    right_region_boundary = width * boundary

    for line_segment in line_segments:
        for x1, y1, x2, y2 in line_segment:
            if x1 == x2:  # 수직 선분은 무시
                logging.info('Ignore Vertical %s' % line_segment)
                continue
            fit = np.polyfit((x1, x2), (y1, y2), 1)
            slope = fit[0]
            intercept = fit[1]
            if slope < 0:
                if x1 < left_region_boundary and x2 < left_region_boundary:
                    if slope < -0.75:
                        left_fit.append((slope, intercept))
            else:
                if x1 > right_region_boundary and x2 > right_region_boundary:
                    if slope > 0.75:
                        right_fit.append((slope, intercept))

    left_fit_average = np.average(left_fit, axis=0)
    if len(left_fit) > 0:
        lane_lines.append(make_points(frame, left_fit_average))

    right_fit_average = np.average(right_fit, axis=0)
    if len(right_fit) > 0:
        lane_lines.append(make_points(frame, right_fit_average))

    logging.debug('Lane: %s' % lane_lines)
    
    return lane_lines

def compute_steering_angle(frame, lane_lines):
    # 조향 각도 계산
    if len(lane_lines) == 0:
        logging.info('No Lane, No Angle')
        return -90

    height, width, _ = frame.shape
    if len(lane_lines) == 1:
        logging.debug('One Lane: %s' % lane_lines[0])
        x1, _, x2, _ = lane_lines[0][0]
        x_offset = x2 - x1
    else:
        _, _, left_x2, _ = lane_lines[0][0]
        _, _, right_x2, _ = lane_lines[1][0]
        camera_mid_offset_percent = 0.00
        mid = int(width / 2 * (1 + camera_mid_offset_percent))
        x_offset = (left_x2 + right_x2) / 2 - mid

    y_offset = int(height * 0.5)
    angle_to_mid_radian = math.atan(x_offset / y_offset)
    angle_to_mid_deg = int(angle_to_mid_radian * 180.0 / math.pi)
    steering_angle = angle_to_mid_deg + 90

    logging.debug('New Angle: %s' % steering_angle)
    return steering_angle

# I2C 버스 설정(SCL 및 SDA 핀을 사용하여 I2C 버스 초기화)
i2c_bus = busio.I2C(board.SCL, board.SDA)

def i2c_scan(i2c):
    # I2C 버스 스캔하여 장치 목록 반환
    while not i2c.try_lock():
        pass
    try:
        devices = i2c.scan()
        return devices
    finally:
        i2c.unlock()

def initialize_pca9685():
    # PCA9685 초기화
    try:
        print("I2C Scan...")
        devices = i2c_scan(i2c_bus)
        print(f"I2C find: {[hex(device) for device in devices]}")

        if not devices:
            raise ValueError("I2C Error.")

        kit = ServoKit(channels=16, i2c=i2c_bus, address=0x60)  # PCA9685 초기화
        print("PCA9685 Init.")

        kit.servo[0].angle = 90  # 서보 모터 초기 위치 설정

        print("Servo Init.")
        return kit
    except Exception as e:
        print(f"PCA9685 Init Error: {e}")
        raise


def set_servo_angle(kit, angle):
    # 서보 모터 각도 설정
    try:
        kit.servo[0].angle = angle
        print(f"Servo Angle is : {angle}")
    except Exception as e:
        print(f"Servo Angle Error: {e}")
        raise

# 초기화 함수 호출 (한 번만 실행)
kit = initialize_pca9685()

def stabilize_steering_angle(curr_steering_angle, new_steering_angle, num_of_lane_lines, max_angle_deviation_two_lines=5, max_angle_deviation_one_lane=1):
    # 조향 각도 안정화
    # 2라인 감지 시 최대 5도, 1라인 감지 시 최대 1도
    if num_of_lane_lines == 2:
        max_angle_deviation = max_angle_deviation_two_lines
    else:
        max_angle_deviation = max_angle_deviation_one_lane

    # 현재 조향각과 새로운 조향각의 차이 계산
    angle_deviation = new_steering_angle - curr_steering_angle
    
    # 허용된 조향각 범위 초과 시, 현재 조향각 기준 최대 허용 각도 변화만큼 조정된 값을 새로운 안정화된 조향각으로 설정
    if abs(angle_deviation) > max_angle_deviation:
        stabilized_steering_angle = int(curr_steering_angle + max_angle_deviation * angle_deviation / abs(angle_deviation))
    # 범위 내에 있을 경우 1.2 배율에 맞는 특정 수식에 따라 설정
    else:
        stabilized_steering_angle = new_steering_angle
        stabilized_steering_angle = math.ceil(stabilized_steering_angle)
        
        logging.info('Suggest Angle: %s, Stabilized Angle: %s' % (new_steering_angle, stabilized_steering_angle))
    
    if stabilized_steering_angle > 140:
        stabilized_steering_angle = 140
    elif stabilized_steering_angle < 40:
        stabilized_steering_angle = 40

    if 40 <= stabilized_steering_angle < 90:
        # 40도~ 90도 범위
        slope = -0.008
        base_angle = 40
        base_throttle = 0.6
    elif 90 < stabilized_steering_angle <= 140:
        # 90도~ 140도 범위
        slope = 0.008
        base_angle = 90
        base_throttle = 0.2

    # 선형 보간 계산
    throttle = slope * (stabilized_steering_angle - base_angle) + base_throttle

    # 스로틀 값을 0~1 범위로 제한 후 조향각, 스로틀 값 반환

    logging.debug('new throttle angle: %s' % round(min(max(throttle, 0.0), 0.6), 4))
    logging.debug('new steering angle: %s' % stabilized_steering_angle)
    return round(min(max(throttle, 0.0), 0.6), 4), stabilized_steering_angle  # 최대 소수 4째자리까지 허용

    # # 예시 사용
    # current_steering_angle = 105  # 현재 조향각 예시
    # adjusted_throttle = adjust_throttle_based_on_angle(current_steering_angle)
    # print(f"조정된 스로틀 값: {adjusted_throttle:.4f}")


    # return stabilized_steering_angle

def display_lines(frame, lines, line_color=(0, 255, 0), line_width=10):
    # 이미지에 선을 표시
    line_image = np.zeros_like(frame)
    if lines is not None:
        for line in lines:
            for x1, y1, x2, y2 in line:
                cv2.line(line_image, (x1, y1), (x2, y2), line_color, line_width)
    line_image = cv2.addWeighted(frame, 0.8, line_image, 1, 1)
    return line_image

def display_heading_line(frame, steering_angle, line_color=(0, 0, 255), line_width=5):
    heading_image = np.zeros_like(frame)
    height, width, _ = frame.shape

    steering_angle_radian = steering_angle / 180.0 * math.pi
    x1 = int(width / 2)
    y1 = height
    x2 = int(x1 - height / 2 / math.tan(steering_angle_radian))
    y2 = int(height / 2)

    cv2.line(heading_image, (x1, y1), (x2, y2), line_color, line_width)
    heading_image = cv2.addWeighted(frame, 0.8, heading_image, 1, 1)

    return heading_image

def length_of_line_segment(line):
    # 선분의 길이 계산
    x1, y1, x2, y2 = line
    return math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

def make_points(frame, line):
    # 기울기 및 절편을 사용하여 선분의 끝점 계산
    height, width, _ = frame.shape
    slope, intercept = line
    y1 = height
    y2 = int(y1 * 0.5)

    if slope == 0:
        slope = 0.1

    x1 = max(-width, min(2 * width, int((y1 - intercept) / slope)))
    x2 = max(-width, min(2 * width, int((y2 - intercept) / slope)))

    return [[x1, y1, x2, y2]]

def show_image(title, frame, show=False):
    # 이미지를 화면에 표시
    if show_image or show:
        cv2.imshow(title, frame)

class PWMThrottleHat:
    def __init__(self, pwm, channel):
        self.pwm = pwm
        self.channel = channel
        self.pwm.frequency = 60  # 주파수 설정

    def set_throttle(self, throttle):
        # 스로틀 값을 설정
        pulse = int(0xFFFF * abs(throttle))  # 16비트 듀티 사이클 계산
       
        if throttle > 0:
            # 전진
            self.pwm.channels[self.channel + 5].duty_cycle = pulse
            self.pwm.channels[self.channel + 4].duty_cycle = 0
            self.pwm.channels[self.channel + 3].duty_cycle = 0xFFFF
        elif throttle < 0:
            # 후진
            self.pwm.channels[self.channel + 5].duty_cycle = pulse
            self.pwm.channels[self.channel + 4].duty_cycle = 0xFFFF
            self.pwm.channels[self.channel + 3].duty_cycle = 0
        else:
            # 정지
            self.pwm.channels[self.channel + 5].duty_cycle = 0
            self.pwm.channels[self.channel + 4].duty_cycle = 0
            self.pwm.channels[self.channel + 3].duty_cycle = 0

# 주석처리된 부분: 모터 정지 및 PCA9685 정리
# finally
#    motor_hat.set_throttle(0)  # 모터 정지
#    pca.deinit()  # PCA9685 정리
#    print("프로그램 종료 및 모터 정지.")
