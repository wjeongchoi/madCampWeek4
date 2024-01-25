import math
import cv2
import mediapipe as mp
import numpy as np
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

cap = cv2.VideoCapture(0)
## Setup mediapipe inst0
with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
    while cap.isOpened():
        print()
        ret, frame = cap.read()
        
        # Recolor image to RGB
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False
      
        # Make detection
        results = pose.process(image)
    
        # Recolor back to BGR
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        
        # Extract landmarks
        try:
            landmarks = results.pose_landmarks.landmark
            
            # Get coordinates
            #어깨 랜드마크
            shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
            right_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
            elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x,landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
            wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x,landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]
            # 눈의 랜드마크
            left_eye = [landmarks[mp_pose.PoseLandmark.LEFT_EYE_INNER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_EYE_INNER.value].y]
            right_eye = [landmarks[mp_pose.PoseLandmark.RIGHT_EYE_INNER.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_EYE_INNER.value].y]

            # 귀의 랜드마크 (예시로 왼쪽 귀 사용)
            left_ear = [landmarks[mp_pose.PoseLandmark.LEFT_EAR.value].x, landmarks[mp_pose.PoseLandmark.LEFT_EAR.value].y]

            # 코의 랜드마크
            nose = [landmarks[mp_pose.PoseLandmark.NOSE.value].x, landmarks[mp_pose.PoseLandmark.NOSE.value].y]
            
            # 몸통 랜드마크
            mid_hip = [landmarks[mp_pose.PoseLandmark.MID_HIP.value].x, landmarks[mp_pose.PoseLandmark.MID_HIP.value].y]

            left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]

            right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]

            
            # Calculate angle
            #angle = calculate_angle(shoulder, elbow, wrist)
            # left shoulder와 right shoulder의 중간점 구하기
            middle_shoulder = [(shoulder[0] + right_shoulder[0]) / 2, (shoulder[1] + right_shoulder[1]) / 2]

            # middle_shoulder와 nose를 이은 선분의 벡터 구하기
            vector1 = [nose[0] - middle_shoulder[0], nose[1] - middle_shoulder[1]]

            # left shoulder와 right shoulder를 이은 선분의 벡터 구하기
            vector2 = [right_shoulder[0] - shoulder[0], right_shoulder[1] - shoulder[1]]

            # 두 벡터 사이의 각도 계산
            dot_product = vector1[0] * vector2[0] + vector1[1] * vector2[1]
            magnitude_vector1 = math.sqrt(vector1[0] ** 2 + vector1[1] ** 2)
            magnitude_vector2 = math.sqrt(vector2[0] ** 2 + vector2[1] ** 2)
            cosine_similarity = dot_product / (magnitude_vector1 * magnitude_vector2)

            # 각도 계산 (라디안을 도로 변환)
            angle = math.degrees(math.acos(cosine_similarity))
            
            # Visualize angle
            #cv2.putText(image, str(angle), tuple(np.multiply(elbow, [640, 480]).astype(int)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)
            cv2.putText(image, f"Angle: {angle:.2f} degrees", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            print("Angle between middle_shoulder-nose and shoulder-right_shoulder vectors:", angle)


            # 화면에 표시
            #cv2.imshow("Angle Detection", image)
            #cv2.waitKey(0)
            #cv2.destroyAllWindows()

                       
        except:
            pass
        
        
        # Render detections
        mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
                                mp_drawing.DrawingSpec(color=(245,117,66), thickness=2, circle_radius=2), 
                                mp_drawing.DrawingSpec(color=(245,66,230), thickness=2, circle_radius=2) 
                                 )               
        
        cv2.imshow('Mediapipe Feed', image)

        if cv2.waitKey(10) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()