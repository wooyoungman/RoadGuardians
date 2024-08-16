# -*- coding: utf-8 -*-
import os
import time
import cv2
import requests
import torch
from ultralytics import YOLO

os.environ['KMP_DUPLICATE_LIB_OK'] = 'True'

def capture_image(frame, base_name):
    timestamp = time.strftime('%Y%m%d_%H%M%S')
    file_name = f'{base_name}_{timestamp}.jpg'
    file_path = os.path.join('/home/super/gg_ser/img/', file_name)
    cv2.imwrite(file_path, frame)
    return file_path, file_name

def upload_image(file_path):
    url = 'https://i11c104.p.ssafy.io/api/v1/upload/pothole'
    try:
        with open(file_path, 'rb') as file:
            files = {'image': (os.path.basename(file_path), file, 'image/jpeg')}
            data = {'data': '{"x": 104.1111, "y": 12.2222}'}  # JSON 형식의 문자열로 데이터 전송
            response = requests.post(url, files=files, data=data)
            3
        
        if response.status_code == 200:
            print(f"Upload successful to {url}")
            os.remove(file_path)
            return True
        else:
            print(f"Upload failed with status code: {response.status_code} - {response.text}")
            os.remove(file_path)
            return False
    except requests.exceptions.RequestException as e:
        print(f"Error sending request: {e}")
        return False

def upload_overload_image(file_path):
    url = 'https://i11c104.p.ssafy.io/api/v1/upload/overload'
    try:
        with open(file_path, 'rb') as file:
            files = {'image': (os.path.basename(file_path), file, 'image/jpeg')}
            data = {'data': '{"x": 104.1111, "y": 12.2222, "carNumber": "223나2222"}'}  # JSON 형식의 문자열로 데이터 전송
            response = requests.post(url, files=files, data=data)
            
        
        if response.status_code == 200:
            print(f"Upload successful to {url}")
            os.remove(file_path)
            return True
        else:
            print(f"Upload failed with status code: {response.status_code} - {response.text}")
            os.remove(file_path)
            return False
    except requests.exceptions.RequestException as e:
        print(f"Error sending request: {e}")
        return False



# 장치 설정
device = 'cuda' if torch.cuda.is_available() else 'cpu'

# YOLO 모델 로드
model = YOLO('240812-detection.pt')
model.to(device)

cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("Error: Could not open camera.")
    exit()

frame_skip = 2
frame_count = 0
object_id_counter = 0

potholes_dict = {}
overload_dict = {}

while True:
    ret, frame = cap.read()
    if not ret:
        print("Error: Could not read frame.")
        break

    frame_count += 1
    if frame_count % frame_skip != 0:
        continue

    resized_frame = cv2.resize(frame, (640, 640))

    rgb_frame = cv2.cvtColor(resized_frame, cv2.COLOR_BGR2RGB)
    frame_tensor = torch.from_numpy(rgb_frame).permute(2, 0, 1).unsqueeze(0).float().to(device) / 255.0

    #results = model.track(source=frame_tensor, show=True, tracker="bytetrack.yaml", conf=0.2)
    results = model.track(frame, persist=True,show=True, tracker="bytetrack.yaml", conf=0.6,iou=0.6)

    for result in results:
        boxes = result.boxes  # Object containing detection bounding boxes.
        for box in boxes:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            confidence = box.conf[0].item()
            track_id = box.id
            class_id = box.cls[0].item()
            label = f'{model.names[int(class_id)]}: {confidence:.2f}'

            cv2.rectangle(resized_frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
            cv2.putText(resized_frame, label, (int(x1), int(y1) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

            print(f"Detected {label} with confidence {confidence}")

            if confidence >= 0.7:
                
                if model.names[int(class_id)] == 'Pothole' and track_id not in list(potholes_dict.keys()):
                    print(track_id)
                    potholes_dict[track_id] = confidence
                    file_path, file_name = capture_image(frame, 'pothole')
                    if file_path:
                        upload_image(file_path)

                elif model.names[int(class_id)] == 'Overload' and track_id not in list(overload_dict.keys()):
                    overload_dict[track_id] = confidence
                    file_path, file_name = capture_image(frame, 'overload')
                    if file_path:
                        upload_overload_image(file_path)


    if cv2.waitKey(1) & 0xFF == ord('q'):
        print("Potholes:", potholes_dict)
        print("Overload:", overload_dict)
        break

cap.release()
cv2.destroyAllWindows()
