import React, { useEffect, useState } from 'react';
import normalMarker from '../assets/normal_marker.png';
import overMarker from '../assets/click_marker.png';
import clickMarker from '../assets/click_marker.png';
import NoPicture from '../assets/no_picture.PNG'; 
import './Map.css';

const { kakao } = window;

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
      onClick(); // 마커 클릭 시 onClick 함수 호출
    });

    return () => {
      marker.setMap(null);
    };
  }, [map, position, title, onClick]);

  return null;
};

function Kakao() {
  const [map, setMap] = useState(null);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false); // 상태 정의

  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
      setInnerHeight(window.innerHeight);
    };
    window.addEventListener("resize", resizeListener);

    const container = document.getElementById('KakaoMap');
    const options = {
      center: new kakao.maps.LatLng(35.205580, 126.811458),
      level: 2
    };

    const newMap = new kakao.maps.Map(container, options);
    setMap(newMap);

    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, []);

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
  };

  const handleClose = () => {
    setSelectedMarker(null);
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
          />
        ))}
      </div>
      {selectedMarker && (
        <div className='path_information_box'>
          <button onClick={handleClose} className='close_button'>x</button>
          <img src={selectedMarker.image} alt={selectedMarker.title} className='no_picture'/>
          <h2 className='information_box1'><div className='title'>{selectedMarker.title}</div> <div className='ID'>ID: {selectedMarker.id}</div></h2>
          <div className='information_box2'>
            <p>위치: {selectedMarker.location}</p>
            <p>좌표: {selectedMarker.coordinates}</p>
            <p>시각: {selectedMarker.date}</p>
          </div>
          <button
            className={`connect_button ${buttonClicked ? 'clicked' : ''}`}
            onClick={handleButtonClick}
            disabled={buttonClicked} // 버튼이 회색으로 변하도록 함
          >
            {buttonClicked ? '연계완료' : '유지 보수과 연계하기'}
          </button>
        </div>
      )}
    </div>
  );
}

export default Kakao;
