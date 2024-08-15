# Dummy Dump Data
---

해당 파일들은 **DB 덤프 파일 최신본**입니다.
우리 프로젝트('로드 가디언즈')는 Jetson Orin Nano 보드에서 HTTP 통신을 이용해
Multipart/form-data를 이미지와 데이터를 함께 EC2 Springboot 서버와 통신합니다. 

### images
- 해당 이미지는 AI 모델 학습에 활용되지 않은 데이터들입니다.
'AI-Hub'의 "도로장애물/표면 인지 영상(수도권)", "도로장애물/표면 인지 영상(수도권 외)", "과적차량 도로 위험 데이터"를 활용했습니다.

### Pothole.json
- 해당 DumpData는 가상 위도, 경도를 담고 있습니다.

### Overload.json
- 해당 DumpData는 가상 위도, 경도, 차량번호를 담고 있습니다.