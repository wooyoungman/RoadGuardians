import cv2
import logging
from concurrent.futures import ThreadPoolExecutor
from jd_opencv_lane_detect import JdOpencvLaneDetect, detect_lane, compute_steering_angle, stabilize_steering_angle, display_heading_line

# Configure logging
logging.basicConfig(level=logging.DEBUG)

def start_video_processing():
    # Initialize the lane detection object
    lane_detector = JdOpencvLaneDetect()

    # Open the video file
    cap = cv2.VideoCapture(0)
    # Check if video file is opened successfully
    if not cap.isOpened():
        logging.error('Error opening video file')
        raise SystemExit

    def process_frame(frame):
        try:
            lane_lines, lane_lines_image = lane_detector.get_lane(frame)
            steering_angle, heading_image = lane_detector.get_steering_angle(frame, lane_lines)
            
            # Overlay lane lines and heading line on the original frame
            final_frame = display_heading_line(lane_lines_image, steering_angle)
            
            return final_frame
        except Exception as e:
            logging.error(f"Error processing frame: {e}")
            return frame

    # Initialize thread pool
    executor = ThreadPoolExecutor(max_workers=4)

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            logging.info('End of video stream or error occurred.')
            break
        
        # Submit the frame to be processed by a thread
        future = executor.submit(process_frame, frame)
        final_frame = future.result()

        # Display the final frame with lane lines and heading line
        cv2.imshow("Lane Detection", final_frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            lane_detector.motor_hat.set_throttle(0)
            break

    # Release the video capture object and close all windows
    cap.release()
    cv2.destroyAllWindows()
    executor.shutdown()

def main():
    while True:
        user_input = input("Enter 's' to start video processing or any other key to exit: ")
        if user_input.lower() == 's':
            start_video_processing()
        else:
            print("Exiting.")
            break

if __name__ == "__main__":
    main()
