import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import axios from 'axios';
import normalMarker from '../assets/normal_marker.png';
import overMarker from '../assets/click_marker.png';
import clickMarker from '../assets/click_marker.png';
import NoPicture from '../assets/no_picture.PNG';
=======
import normalMarker from '../assets/normal_marker.png';
import overMarker from '../assets/click_marker.png';
import clickMarker from '../assets/click_marker.png';
import NoPicture from '../assets/no_picture.PNG'; 
>>>>>>> FrontEnd_mingyeong
import './Map.css';

const { kakao } = window;

<<<<<<< HEAD
const parsePoint = (pointStr) => {
  const coords = pointStr.match(/POINT \(([^ ]+) ([^ ]+)\)/);
  if (coords) {
    const lat = parseFloat(coords[2]);
    const lng = parseFloat(coords[1]);
    return new kakao.maps.LatLng(lat, lng);
  }
  return null;
};

const getDisabledMarkers = () => {
  const disabledMarkers = localStorage.getItem('disabledMarkers');
  return disabledMarkers ? JSON.parse(disabledMarkers) : [];
};

const saveDisabledMarkers = (disabledMarkers) => {
  localStorage.setItem('disabledMarkers', JSON.stringify(disabledMarkers));
};

const Marker = ({ map, position, title, onClick, isActive }) => {
  useEffect(() => {
    if (!isActive) {
      return;
    }

    const MARKER_WIDTH = 180,
      MARKER_HEIGHT = 100,
      OFFSET_X = 12,
      OFFSET_Y = MARKER_HEIGHT,
      OVER_MARKER_WIDTH = 243,
      OVER_MARKER_HEIGHT = 135,
      OVER_OFFSET_X = 13,
      OVER_OFFSET_Y = 120;
=======
const Marker = ({ map, position, title, onClick }) => {
  useEffect(() => {
    const MARKER_WIDTH = 180, // 기본, 클릭 마커의 너비
      MARKER_HEIGHT = 100, // 기본, 클릭 마커의 높이
      OFFSET_X = 12, // 기본, 클릭 마커의 기준 X좌표
      OFFSET_Y = MARKER_HEIGHT, // 기본, 클릭 마커의 기준 Y좌표
      OVER_MARKER_WIDTH = 243, // 오버 마커의 너비
      OVER_MARKER_HEIGHT = 135, // 오버 마커의 높이
      OVER_OFFSET_X = 13, // 오버 마커의 기준 X좌표
      OVER_OFFSET_Y = 120; // 오버 마커의 기준 Y좌표
>>>>>>> FrontEnd_mingyeong

    const markerSize = new kakao.maps.Size(MARKER_WIDTH, MARKER_HEIGHT),
      markerOffset = new kakao.maps.Point(OFFSET_X, OFFSET_Y),
      overMarkerSize = new kakao.maps.Size(OVER_MARKER_WIDTH, OVER_MARKER_HEIGHT),
      overMarkerOffset = new kakao.maps.Point(OVER_OFFSET_X, OVER_OFFSET_Y);

    const normalImage = new kakao.maps.MarkerImage(normalMarker, markerSize, {
      offset: markerOffset
    });
    const overImage = new kakao.maps.MarkerImage(overMarker, overMarkerSize, {
      offset: overMarkerOffset
    });
    const clickImage = new kakao.maps.MarkerImage(clickMarker, markerSize, {
      offset: markerOffset
    });

    const marker = new kakao.maps.Marker({
      map: map,
      position: position,
      title: title,
      image: normalImage
    });

    marker.normalImage = normalImage;

    kakao.maps.event.addListener(marker, 'mouseover', function () {
      marker.setImage(overImage);
    });

    kakao.maps.event.addListener(marker, 'mouseout', function () {
      marker.setImage(normalImage);
    });

    kakao.maps.event.addListener(marker, 'click', function () {
      marker.setImage(clickImage);
<<<<<<< HEAD
      onClick();
=======
      onClick(); // 마커 클릭 시 onClick 함수 호출
>>>>>>> FrontEnd_mingyeong
    });

    return () => {
      marker.setMap(null);
    };
<<<<<<< HEAD
  }, [map, position, title, onClick, isActive]);

  if (!isActive) {
    return null;
  }
=======
  }, [map, position, title, onClick]);
>>>>>>> FrontEnd_mingyeong

  return null;
};

function Kakao() {
  const [map, setMap] = useState(null);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [selectedMarker, setSelectedMarker] = useState(null);
<<<<<<< HEAD
  const [buttonClicked, setButtonClicked] = useState(false);
  const [potholeList, setPotholeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [disabledMarkers, setDisabledMarkers] = useState(getDisabledMarkers);

  useEffect(() => {
    const fetchPotholeData = async () => {
      try {
        const mapResponse = await axios.get('http://i11c104.p.ssafy.io/api/v1/pothole/map');
        const ids = mapResponse.data.map(pothole => pothole.potholeId);

        const requests = ids.map(id =>
          axios.get(`http://i11c104.p.ssafy.io:8080/api/v1/pothole/detail/${id}`)
        );

        const responses = await Promise.all(requests);
        const data = responses.map(response => response.data);
        setPotholeList(data);
      } catch (error) {
        console.error('Error fetching pothole data:', error);
        setError('Failed to load pothole data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPotholeData();
  }, []);
=======
  const [buttonClicked, setButtonClicked] = useState(false); // 상태 정의
>>>>>>> FrontEnd_mingyeong

  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
      setInnerHeight(window.innerHeight);
    };
    window.addEventListener("resize", resizeListener);

    const container = document.getElementById('KakaoMap');
<<<<<<< HEAD
    if (container) {
      const options = {
        center: new kakao.maps.LatLng(35.205580, 126.811458),
        level: 2
      };

      const newMap = new kakao.maps.Map(container, options);
      setMap(newMap);
    }
=======
    const options = {
      center: new kakao.maps.LatLng(35.205580, 126.811458),
      level: 2
    };

    const newMap = new kakao.maps.Map(container, options);
    setMap(newMap);
>>>>>>> FrontEnd_mingyeong

    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, []);

<<<<<<< HEAD
  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    setButtonClicked(false);
=======
  const positions = [
    {
      title: "삼성 사업장",
      latlng: new kakao.maps.LatLng(35.205580, 126.81131),
      id: 17123,
      image: NoPicture, // 포트홀 이미지 경로
      location: '광주광역시 광산구 장덕동 산2-38',
      coordinates: '35.202492, 126.810523',
      date: '2024.07.14 13:21:33'
    },
    {
      title: "새로운 마커 1",
      latlng: new kakao.maps.LatLng(35.207580, 126.81232),
      id: 17124,
      image: NoPicture,
      location: '광주광역시 광산구 장덕동 산2-39',
      coordinates: '35.202493, 126.810524',
      date: '2024.07.14 13:22:33'
    },
    {
      title: "새로운 마커 2",
      latlng: new kakao.maps.LatLng(35.209880, 126.81333),
      id: 17125,
      image: NoPicture,
      location: '광주광역시 광산구 장덕동 산2-40',
      coordinates: '35.202494, 126.810525',
      date: '2024.07.14 13:23:33'
    }
  ];

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    setButtonClicked(false); // 마커를 클릭할 때 버튼 상태를 초기화
>>>>>>> FrontEnd_mingyeong
  };

  const handleClose = () => {
    setSelectedMarker(null);
<<<<<<< HEAD
    setButtonClicked(false);
  };

  const handleButtonClick = () => {
    setButtonClicked(true);
    const updatedDisabledMarkers = [...disabledMarkers, selectedMarker.potholeId];
    setDisabledMarkers(updatedDisabledMarkers);
    saveDisabledMarkers(updatedDisabledMarkers);
    setPotholeList(potholeList.filter(pothole => pothole.potholeId !== selectedMarker.potholeId));
  };

  const handleRestoreMarkers = () => {
    setDisabledMarkers([]);
    saveDisabledMarkers([]);
  };

  const getCoordinates = (location) => {
    const coords = location.match(/POINT \(([^ ]+) ([^ ]+)\)/);
    if (coords) {
      const lat = parseFloat(coords[2]);
      const lng = parseFloat(coords[1]);
      return { lat, lng };
    }
    return { lat: null, lng: null };
  };

  return (
    <div>
      <div id="KakaoMap" style={{ width: innerWidth - 20, height: innerHeight - 120 }}>
        {potholeList.filter(pothole => !disabledMarkers.includes(pothole.potholeId)).map((pothole) => (
          <Marker
            key={pothole.potholeId}
            map={map}
            position={parsePoint(pothole.location)}
            title={pothole.title}
            onClick={() => handleMarkerClick(pothole)}
            isActive={true}
=======
    setButtonClicked(false); // 닫기 버튼을 클릭할 때 버튼 상태를 초기화
  };

  const handleButtonClick = () => {
    setButtonClicked(true); // 버튼 클릭 상태 설정
  };
  
  return (
    <div>
      <div id="KakaoMap" style={{ width: innerWidth - 20, height: innerHeight - 120 }}>
        {positions.map((position, index) => (
          <Marker
            key={index}
            map={map}
            position={position.latlng}
            title={position.title}
            onClick={() => handleMarkerClick(position)}
>>>>>>> FrontEnd_mingyeong
          />
        ))}
      </div>
      {selectedMarker && (
        <div className='path_information_box'>
          <button onClick={handleClose} className='close_button'>x</button>
<<<<<<< HEAD
          <img src={selectedMarker.imageUrl || NoPicture} alt={selectedMarker.title} className='no_picture'/>
          <h2 className='information_box1'><div className='title'>포트홀 정보</div> <div className='ID'>ID: {selectedMarker.potholeId}</div></h2>
          <div className='information_box2'>
            <p>위치: {selectedMarker.location}</p>
            <p>좌표: {`위도 ${getCoordinates(selectedMarker.location).lat}, 경도 ${getCoordinates(selectedMarker.location).lng}`}</p>
            <p>시각: {selectedMarker.detectAt}</p>
            <p>상태: {selectedMarker.confirm ? '연계 후' : '연계 전'}</p>
=======
          <img src={selectedMarker.image} alt={selectedMarker.title} className='no_picture'/>
          <h2 className='information_box1'><div className='title'>{selectedMarker.title}</div> <div className='ID'>ID: {selectedMarker.id}</div></h2>
          <div className='information_box2'>
            <p>위치: {selectedMarker.location}</p>
            <p>좌표: {selectedMarker.coordinates}</p>
            <p>시각: {selectedMarker.date}</p>
>>>>>>> FrontEnd_mingyeong
          </div>
          <button
            className={`connect_button ${buttonClicked ? 'clicked' : ''}`}
            onClick={handleButtonClick}
<<<<<<< HEAD
            disabled={buttonClicked}
=======
            disabled={buttonClicked} // 버튼이 회색으로 변하도록 함
>>>>>>> FrontEnd_mingyeong
          >
            {buttonClicked ? '연계완료' : '유지 보수과 연계하기'}
          </button>
        </div>
      )}
<<<<<<< HEAD
      <button onClick={handleRestoreMarkers} className='restore_button'>
        마커 복원하기
      </button>
=======
>>>>>>> FrontEnd_mingyeong
    </div>
  );
}

export default Kakao;
