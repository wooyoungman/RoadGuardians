/* eslint-disable react/display-name */
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import normalMarker from '../assets/normal_marker.png';
import overMarker from '../assets/click_marker.png';
import clickMarker from '../assets/click_marker.png';
import NoPicture from '../assets/no_picture.PNG';
import LinkModal from '../components/LinkModal';
import '../styles/Map.css';

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

const Marker = React.memo(({ map, position, title, onClick, isActive, isSelected }) => {
  useEffect(() => {
    if (!isActive) {
      return;
    }

    const MARKER_WIDTH = 230,
      MARKER_HEIGHT = 140,
      OFFSET_X = 12,
      OFFSET_Y = MARKER_HEIGHT,
      OVER_MARKER_WIDTH = 273,
      OVER_MARKER_HEIGHT = 165,
      OVER_OFFSET_X = 13,
      OVER_OFFSET_Y = MARKER_HEIGHT+1;

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
});

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
  const [locationName, setLocationName] = useState('DB 받아서 넣기');
  const [isModalOpen, setModalOpen] = useState(false);
  const [deptName, setDeptName] = useState('');
  const [newDB, setNewDB] = useState(false); // websocket

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  
  const reverseGeocode = useCallback(async (lat, lon) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}&language=ko`);
      const { results } = response.data;
      if (results && results.length > 0) {
        const { formatted_address, address_components } = results[0];
        setLocationName(formatted_address);

        const district = address_components.find(component => component.types.includes('sublocality_level_1') || component.types.includes('locality'));
        if (district) {
          setDeptName(district.long_name);
        } else {
          setDeptName('정보 없음');
        }
      } else {
        setLocationName('위치 정보를 찾을 수 없습니다.');
        setDeptName('정보 없음');
      }
    } catch (error) {
      console.error('역지오코딩 오류:', error);
      setLocationName('역지오코딩 오류');
      setDeptName('역지오코딩 오류');
    }
  }, [apiKey]);

  useEffect(() => {
    if (selectedMarker && selectedMarker.location) {
      const coordinates = selectedMarker.location.match(/POINT \(([^ ]+) ([^ ]+)\)/);
      if (coordinates) {
        const lon = coordinates[1];
        const lat = coordinates[2];
        reverseGeocode(lat, lon);
      }
    }
  }, [selectedMarker, reverseGeocode]);

  useEffect(() => {
    const fetchPotholeData = async () => {
      try {
        const mapResponse = await axios.get('https://i11c104.p.ssafy.io/api/v1/pothole/map');
        const ids = mapResponse.data.map(pothole => pothole.potholeId);

        const requests = ids.map(id =>
          axios.get(`https://i11c104.p.ssafy.io/api/v1/pothole/detail/${id}`)
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
  }, [newDB]);

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
  
    // 실시간 반영 wwebSocket
    useEffect(() => {
      const socket = new WebSocket('wss://i11c104.p.ssafy.io/ws'); // 보안 WebSocket wws
      
      console.log("WebSocket 연결 시도");

      socket.onopen = () => {
        console.log("WebSocket 연결 성공");
      };

      socket.onclose = (event) => {
        console.log("WebSocket 연결이 닫혔습니다:", event);
      };

      socket.onerror = (event) => {
        console.error("WebSocket 오류 발생:", event);
      };

      socket.onmessage = (event) => {
        console.log(event);
        if (event.data === 'newDB') {
          setNewDB(sync => !sync);
          // setNewDB(true); 비동기 때문에 처리 안될 수 있음
          // setNewDB(false);
        }
      };

      return () => {
        socket.close();
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
    setModalOpen(true);
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

  const modalCloseClick = () => {
    setModalOpen(false);
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      <div className="pothole-map-container">
        <div className="map-title">Pothole Map</div>
        {selectedMarker && (
        <div className='path_information_box'>
          <button onClick={handleClose} className='close_button'>x</button>
          <img src={selectedMarker.imageUrl || NoPicture} alt={selectedMarker.title} className='no_picture'/>
          <h2 className='information_box1'><div className='title'>포트홀 정보</div> <div className='ID'>ID: {selectedMarker.potholeId}</div></h2>
          <div className='information_box2'>
            <p>위치: {locationName}</p>
            <p>좌표: {`위도 ${getCoordinates(selectedMarker.location).lat}, 경도 ${getCoordinates(selectedMarker.location).lng}`}</p>
            <p>시각: {selectedMarker.detectAt}</p>
            <p>상태: {selectedMarker.confirm ? '연계 후' : '연계 전'}</p>
          </div>
          <button
            className='connect_button' 
            onClick={handleButtonClick}
            disabled={buttonClicked}
          >
            작업 지시하기
          </button>
        </div>
      )}

          <div id="KakaoMap" style={{ width: innerWidth - 20, height: innerHeight - 120 }}>
            {potholeList.filter(pothole => !disabledMarkers.includes(pothole.potholeId)).map((pothole) => (
              <Marker
                key={pothole.potholeId}
                map={map}
                position={parsePoint(pothole.location)}
                title={pothole.title}
                onClick={() => handleMarkerClick(pothole)}
                isActive={true}
                isSelected={selectedMarker && selectedMarker.potholeId === pothole.potholeId}
              />
          ))}
        </div>
      </div>
      

      {selectedMarker && (
        <LinkModal
          isOpen={isModalOpen}
          isClose={modalCloseClick}
          selectedItem={selectedMarker}
          deptName={deptName}
        />
      )}
    </div>
  );
}

export default Kakao;
