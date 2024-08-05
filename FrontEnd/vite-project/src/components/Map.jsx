import React, { useEffect, useState } from 'react';
import axios from 'axios';
import normalMarker from '../assets/normal_marker.png';
import overMarker from '../assets/click_marker.png';
import clickMarker from '../assets/click_marker.png';
import NoPicture from '../assets/no_picture.PNG';
import './Map.css';

const { kakao } = window;

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

const Marker = ({ map, position, title, onClick, isActive, isSelected }) => {
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
    const clickImage = new kakao.maps.MarkerImage(clickMarker, overMarkerSize, {
      offset: overMarkerOffset
    });

    const marker = new kakao.maps.Marker({
      map: map,
      position: position,
      title: title,
      image: isSelected ? clickImage : normalImage
    });

    marker.normalImage = normalImage;

    kakao.maps.event.addListener(marker, 'mouseover', function () {
      if (!isSelected) {
        marker.setImage(overImage);
      }
    });

    kakao.maps.event.addListener(marker, 'mouseout', function () {
      if (!isSelected) {
        marker.setImage(normalImage);
      }
    });

    kakao.maps.event.addListener(marker, 'click', function () {
      onClick();
    });

    return () => {
      marker.setMap(null);
    };
  }, [map, position, title, onClick, isActive, isSelected]);

  if (!isActive) {
    return null;
  }

  return null;
};

function Kakao() {
  const [map, setMap] = useState(null);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [selectedMarker, setSelectedMarker] = useState(null);
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

  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
      setInnerHeight(window.innerHeight);
    };
    window.addEventListener("resize", resizeListener);

    const container = document.getElementById('KakaoMap');
    if (container) {
      const options = {
        center: new kakao.maps.LatLng(35.205580, 126.811458),
        level: 2
      };

      const newMap = new kakao.maps.Map(container, options);
      setMap(newMap);
    }

    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, []);

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    setButtonClicked(false);
  };

  const handleClose = () => {
    setSelectedMarker(null);
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
<<<<<<< HEAD
            isSelected={selectedMarker && selectedMarker.potholeId === pothole.potholeId}
=======
>>>>>>> FrontEnd_mingyeong
          />
        ))}
      </div>
      {selectedMarker && (
        <div className='path_information_box'>
          <button onClick={handleClose} className='close_button'>x</button>
          <img src={selectedMarker.imageUrl || NoPicture} alt={selectedMarker.title} className='no_picture'/>
          <h2 className='information_box1'><div className='title'>포트홀 정보</div> <div className='ID'>ID: {selectedMarker.potholeId}</div></h2>
          <div className='information_box2'>
            <p>위치: {selectedMarker.location}</p>
            <p>좌표: {`위도 ${getCoordinates(selectedMarker.location).lat}, 경도 ${getCoordinates(selectedMarker.location).lng}`}</p>
            <p>시각: {selectedMarker.detectAt}</p>
            <p>상태: {selectedMarker.confirm ? '연계 후' : '연계 전'}</p>
          </div>
          <button
            className={`connect_button ${buttonClicked ? 'clicked' : ''}`}
            onClick={handleButtonClick}
            disabled={buttonClicked}
          >
            {buttonClicked ? '연계완료' : '유지 보수과 연계하기'}
          </button>
        </div>
      )}
      <button onClick={handleRestoreMarkers} className='restore_button'>
        마커 복원하기
      </button>
    </div>
  );
}

export default Kakao;
