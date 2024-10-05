import cv2
import numpy as np
import mediapipe as mp
#from fer import FER

mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=True, min_detection_confidence=0.5)

def distance(p1, p2):
    return np.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2)

def calculate_angle(p1, p2):
    delta_y = p2[1] - p1[1]
    delta_x = p2[0] - p1[0]
    return np.degrees(np.arctan2(delta_y, delta_x))

def analyze_posture(landmarks):
    # Get posture landmarks
    left_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER].y]
    right_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER].x, landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER].y]
    nose = [landmarks[mp_pose.PoseLandmark.NOSE].x, landmarks[mp_pose.PoseLandmark.NOSE].y]
    left_ear = [landmarks[mp_pose.PoseLandmark.LEFT_EAR].x, landmarks[mp_pose.PoseLandmark.LEFT_EAR].y]
    right_ear = [landmarks[mp_pose.PoseLandmark.RIGHT_EAR].x, landmarks[mp_pose.PoseLandmark.RIGHT_EAR].y]


    # Calculate shoulder angle
    shoulder_angle = calculate_angle(left_shoulder, right_shoulder)
    
    # Calculate head angle
    head_angle = calculate_angle(left_ear, right_ear)
    
    # Calculate distances
    shoulder_width = distance(left_shoulder, right_shoulder)
    head_width = distance(left_ear, right_ear)

    if abs(180 - abs(shoulder_angle)) > 10:
        #print(shoulder_angle)
        pass

    if abs(180 - abs(head_angle)) > 5:
        #print(head_angle)
        pass


def check_posture(frame):
    """
    Check the posture of the interviewee
    """
    # Convert the frame to RGB
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    # Process the frame
    results = pose.process(frame_rgb)

    if results.pose_landmarks:
        mp.solutions.drawing_utils.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
        analyze_posture(results.pose_landmarks.landmark)

# detector = FER()

# def check_facial_expressions(frame):
#     """
#     Check the facial expressions of the interviewee
#     """
#     print(detector.top_emotion(frame))




def read_frame(frame):
    """
    Process the frame and return the results
    """
    frame = np.frombuffer(frame, dtype=np.uint8)
    frame = cv2.imdecode(frame, cv2.IMREAD_COLOR)



if __name__ == "__main__":
    cap = cv2.VideoCapture(0)

    while True:
        ret, frame = cap.read()
        check_posture(frame)
        #check_facial_expressions(frame) # facial expression analysis is very slow and laggy

        cv2.imshow("Posture", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()