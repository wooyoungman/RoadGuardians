<table align="center">
<tr>
<td align="center">
<img alt='logo' src='https://lab.ssafy.com/s11-webmobile3-sub2/S11P12C104/uploads/11a30530f59bae7c804c111ebdb363a4/%EB%A1%9C%EA%B3%A0.PNG' width=100% align='center'>

</a>
</td>
</tr>
</table>


### [로드 가디언즈 🖱](https://i11c104.p.ssafy.io/)


## Index
#### &emsp; [➤ 프로젝트 소개](#-프로젝트-소개)<br>
#### &emsp; [➤ 프로젝트 설계](#-프로젝트-설계)<br>
#### &emsp; [➤ 기능 소개](#-기능-소개)<br>
#### &emsp; [➤ 산출물](#-산출물)<br>
<br>


# 🚔 프로젝트 소개

## 서비스 소개
**On-Device AI를 활용한 도로 관리 시스템**
1. ???Lane Detection을 통한 차량 주행
2. On-Device AI를 통한 포트홀, 과적 차량 탐지
3. 실시간 포트홀 모니터링 및 관리
4. 과적 차량 적발
5. ????통계
<br>

## 프로젝트 기간

| 프로젝트 기간 | 2024.07.08 ~ 2024.08.16 (6주) |
|---|---|
<br>

## 팀 소개
<table>
  <thead>
    <tr>
      <th style="text-align: center;">박건국</th>
      <th style="text-align: center;">정우영</th>
      <th style="text-align: center;">정하림</th>
      <th style="text-align: center;">강효린</th>
      <th style="text-align: center;">박민철</th>
      <th style="text-align: center;">지민경</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align: center;">Leader / EM</td>
      <td style="text-align: center;">EM / BE</td>
      <td style="text-align: center;">BE / Infra</td>
      <td style="text-align: center;">FE / Design</td>
      <td style="text-align: center;">AI / FE</td>
      <td style="text-align: center;">FE / Data Viz </td>
    </tr>
  </tbody>
</table>
<br>

## 기획 배경
포트홀 현상이 급증하면서 사회적 문제로 부각되고 있다.<br>
최근 2년간 접수된 ‘포트홀’ 관련 민원은 총 52,262건이며, 2024년 1월부터 포트홀 민원은 전년 같은 기간에 비해 약 5.8배 증가했다.
<br><br>
<img alt='chart' src="https://lab.ssafy.com/s11-webmobile3-sub2/S11P12C104/uploads/551745ceb567dd341ad33177c33fcc9c/chart.PNG" width=70%><br>

<p>
"신고에 의존하는 포트홀 관리" 
<span style="font-weight:bold;">&rarr;&nbsp;늦은 대응</span>
</p>
<p>
"도로 관리 현재 지자체별 상이한 체계, 한정된 인력" 
<span style="font-weight:bold;">&rarr;&nbsp;비효율적 체계</span>
</p>

<p>
"과적차량 운행으로 인한 포트홀 심화" 
<span style="font-weight:bold;">&rarr;&nbsp;근본적인 저감 방안의 부재</span>
</p>

<br>
<p><span style="font-size:17px; font-weight:bold;">"포트홀을 빠르게 탐지 및 보수"</span> 하고, <span style="font-size:17px; font-weight:bold;">"과적 차량 단속 강화"</span>로 근본적인 포트홀 저감 할 수 있는 시스템이 필요하다.</p>
<br>

  
<br>

# 🚔 프로젝트 설계
## 개발 환경
<h3>Embedded</h3>
<img alt="python" src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=Python&logoColor=white"/> 
<img alt="openvc" src="https://img.shields.io/badge/OpenCV-black?style=for-the-badge&logo=OpenCV&logoColor=white">
<img alt="Raspberry-Pi5" src="https://img.shields.io/badge/-RaspberryPi 5-C51A4A?style=for-the-badge&logo=Raspberry-Pi">
<img alt="Jetson Orin Nano" src="https://img.shields.io/badge/Jetson Orin Nano-%236DB33F?style=for-the-badge&logo=Jetson Orin Nano&logoColor=black">
</p>

<h3>AI</h3>
<p>
<img alt="python" src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=Python&logoColor=white"/> 
<img alt ="pytorch" src="https://img.shields.io/badge/PyTorch-E34F26?logo=PyTorch&style=for-the-badge&logoColor=white">
<img alt="YOLO v8" src="https://img.shields.io/badge/YOLO v8-0000C9?style=for-the-badge&logo=YOLO-v8">
</p>

<h3>Frontend</h3>
<p>
<img alt="HTML5" src="https://img.shields.io/badge/HTML5-E34F26.svg?&style=for-the-badge&logo=HTML5&logoColor=white"/>

<img alt="js" src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E">
<img alt="React" src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black">
<img alt="vite" src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white">
<img alt="CSS" src="https://img.shields.io/badge/CSS-1572B6.svg?&style=for-the-badge&logo=CSS3&logoColor=white"/>
<img alt="Tailwind" src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logoColor=white&logo=tailwindcss">
<img alt="tableau" src='https://img.shields.io/badge/Tableau-E97627?style=for-the-badge&logo=Tableau&logoColor=white'>
</p>

<h3>Backend</h3>
<p>
<img alt="JAVA" src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white">
<img alt="SpringBoot" src="https://img.shields.io/badge/springboot-%236DB33F.svg?style=for-the-badge&logo=springboot&logoColor=white">
<img alt="SpringSecurity" src="https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge&logo=Spring%20Security&logoColor=white">
<img alt="JWT" src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens">

<br>
<img alt="MySQL" src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white">
<img alt="firebase" src="https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black">
</p>

<h3>Infra</h3>
<p>
<img alt="Nginx" src="https://img.shields.io/badge/nginx-009539?style=for-the-badge&logo=nginx&logoColor=white"> 
<img src="https://img.shields.io/badge/Amazon%20EC2-FF9900?style=for-the-badge&logo=Amazon%20EC2&logoColor=white">
<img alt="docker"src="https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"> 
<img alt="ubuntu" src="https://img.shields.io/badge/ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white"> 
</p>
<br>


<p style='font-size:9px; line-height:0.5;' >
<버전 정보> <br>
Python : 3.9.19 &nbsp;
Opencv-Python 4.10.0 &nbsp;
pytorch : 2.3.1<br>
React : 18.3.1 &nbsp;
Tableau : 8.2.62 <br>
Java : 17.0.11 &nbsp;
Spring boot : 3.3.2 &nbsp;
MySQL : 8.0.39 <br>
Ubuntu : 20.04.6 LTS &nbsp;
Docker : 27.1.1 &nbsp;
NGINX : 1.18.0 
</p>

<h3>협업 툴</h3>
<p>
<a href="#">
<img alt='jira' src="https://img.shields.io/badge/Jira-0052CC?style=for-the-badge&logo=Jira&logoColor=white">
</a>
<a href="https://www.notion.so/1-C104-c02fce6e587f4bb5acf3c834544dd04f">
<img alt='jira' src="https://img.shields.io/badge/Notion-black?style=for-the-badge&logo=Notion&logoColor=white">
</a>
</p>

<br>
  
<br>

# 🚔 기능 소개

### 1.???Lane Detection을 통한 차량 주행

<p style='font-size:16px;'>1.1 차선 탐지...</p>
<img alt='func1.1' src='#'>

### 2. On-Device AI를 통한 포트홀, 과적 차량 탐지
<p style='font-size:16px;'>2.1 포트홀 탐지...</p>
<img alt='func2.1' src='#'>
<p style='font-size:16px;'>2.2 과적 차량 탐지...</p>
<img alt='func2.2' src='#'>


### 3. 실시간 포트홀 모니터링 및 관리
<p style='font-size:16px;'>3.1 포트홀 지도</p>
<img alt='func3.1' src='#'>
<p style='font-size:16px;'>3.2 포트홀 보수 작업 지시</p>
<img alt='func3.2' src='#'>
<p style='font-size:16px;'>3.3 포트홀 보수 작업 경로 생성</p>
<img alt='func3.3' src='#'>
<p style='font-size:16px;'>3.4 포트홀 보수 작업 모니터링</p>
<img alt='func3.4' src='#'>

### 4. 과적 차량 적발
<p style='font-size:16px;'>4.1 과적 차량 적발 리스트</p>
<img alt='func4.1' src='#'>
<p style='font-size:16px;'>4.2 과적 차량 신고 </p>
<img alt='func4.2' src='#'>

### 5. ????통계
<p style='font-size:16px;'>5.1 통계 설명1</p>
<img alt='func5.1' src='#'>









# 🚔 산출물

##### [⚙ Architecture](https://lab.ssafy.com/s11-webmobile3-sub2/S11P12C104/uploads/c98e7b45383f15041a297bb1a1b30956/%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98.png)

##### [⚙ ERD](https://lab.ssafy.com/s11-webmobile3-sub2/S11P12C104/uploads/57503f0ad6bc4c16fa530a4947aec5fd/Entity_Relationship_Diagram__1_.jpg)

##### [📋 요구사항 명세서](https://olive-bedbug-5a3.notion.site/40f35404a065441985d2ec0eb3b14caf)

##### [📋 API 명세서](https://olive-bedbug-5a3.notion.site/API-2e721ae0c1474faa8d40a807dec25bb9)


<br><br>



##### [🎞 시연 영상](#)


<br><br>


### 커밋 컨벤션
- feat : 새로운 기능 추가
- fix : 버그 수정
- hotfix : 급하게 치명적인 버그 수정
- docs : 문서 수정
- style : 코드 포맷팅, 세미콜론 등의 스타일 수정(코드 자체 수정 X)
- refactor : 프로덕션 코드 리팩토링
- test : 테스트 코드, 테스트 코드 리팩토링
- chore : 빌드 과정 또는 보조 기능(문서 생성 기능 등) 수정
- rename : 파일 혹은 폴더명을 수정하거나 옮기는 작업만인 경우
- remove : 파일을 삭제하는 작업만 수행한 경우
- comment : 필요한 주석 추가 및 변경

