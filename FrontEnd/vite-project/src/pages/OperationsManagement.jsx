import React, { useEffect, useState } from 'react';
import axios from 'axios';
import normalMarker from '../assets/normal_marker.png';
import overMarker from '../assets/click_marker.png';
import clickMarker from '../assets/click_marker.png';
import './OperationsManagement.css';

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

const PotholeList = ({ potholeList, selectedPotholes, onPotholeClick }) => {
  // Sort potholeList based on the selectedPotholes order
  const sortedPotholeList = [...potholeList].sort((a, b) => {
    const indexA = selectedPotholes.indexOf(a.potholeId);
    const indexB = selectedPotholes.indexOf(b.potholeId);

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    if (indexA !== -1) {
      return -1;
    }
    if (indexB !== -1) {
      return 1;
    }
    return 0;
  });

  return (
    <div className="pothole-list">
      <h1 className='pothole-name'>포트홀 목록</h1>
      <div className='pothole-start'>
        <div className='work_information'>현재 활성화 된 작업개수: {selectedPotholes.length}</div>
        <button className='start-button'>작업 시작</button>
      </div>
      <ul>
        {sortedPotholeList.map(pothole => (
          <li
            key={pothole.potholeId}
            onClick={() => onPotholeClick(pothole)}
            style={{
              backgroundColor: selectedPotholes.includes(pothole.potholeId) ? 'lavender' : 'transparent'
            }}
          >
            보수작업 {pothole.title} 
            {pothole.potholeId} <br />{getCoordinates(pothole.location).lat}, {getCoordinates(pothole.location).lng}
          </li>
        ))}
      </ul>
    </div>
  );
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

function Kakao() {
  const [map, setMap] = useState(null);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [selectedMarkers, setSelectedMarkers] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [potholeList, setPotholeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [disabledMarkers, setDisabledMarkers] = useState(getDisabledMarkers);

  useEffect(() => {
    const fetchPotholeData = async () => {
      try {
        const response = await axios.get('https://i11c104.p.ssafy.io/api/v1/pothole/map');
        const data = response.data.map(pothole => ({
          potholeId: pothole.potholeId,
          location: pothole.location
        }));
        setPotholeList(data);
      } catch (error) {
        console.error('Error fetching pothole data:', error);
        setError('Failed to load pothole data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPotholeData();

    // 5초마다 fetchPotholeData 호출
    const intervalId = setInterval(fetchPotholeData, 5000);

    return () => {
      clearInterval(intervalId);
    };
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
    setSelectedMarkers((prevSelectedMarkers) => {
      if (prevSelectedMarkers.includes(marker.potholeId)) {
        return prevSelectedMarkers.filter(id => id !== marker.potholeId);
      }
      return [...prevSelectedMarkers, marker.potholeId];
    });
    setButtonClicked(false);
  };

  const handleRestoreMarkers = () => {
    setDisabledMarkers([]);
    saveDisabledMarkers([]);
  };


  return (
    <div>
      <div id="KakaoMap" style={{ width: '100vw', height: '100vh' }}>
        {potholeList.filter(pothole => !disabledMarkers.includes(pothole.potholeId)).map((pothole) => (
          <Marker
            key={pothole.potholeId}
            map={map}
            position={parsePoint(pothole.location)}
            onClick={() => handleMarkerClick(pothole)}
            isActive={true}
            isSelected={selectedMarkers.includes(pothole.potholeId)}
          />
        ))}
      </div>
      <PotholeList
        potholeList={potholeList.filter(pothole => !disabledMarkers.includes(pothole.potholeId))}
        selectedPotholes={selectedMarkers}
        onPotholeClick={handleMarkerClick}
      />
            <button onClick={handleRestoreMarkers} className='restore_button'>
        마커 복원하기
      </button>
    </div>
  );
}

export default Kakao;
