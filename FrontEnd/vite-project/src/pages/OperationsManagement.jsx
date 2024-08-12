import React, { useEffect, useState, useCallback, useRef } from 'react';
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

const getCoordinates = (location) => {
  const coords = location.match(/POINT \(([^ ]+) ([^ ]+)\)/);
  if (coords) {
    const lat = parseFloat(coords[2]);
    const lng = parseFloat(coords[1]);
    return { lat, lng };
  }
  return { lat: null, lng: null };
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

const PotholeList = ({ potholeList, selectedPotholes, onPotholeClick, onStartWork }) => {
  const sortedPotholeList = [...potholeList].sort((a, b) => {
    const indexA = selectedPotholes.indexOf(a.repairId);
    const indexB = selectedPotholes.indexOf(b.repairId);

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
    <div className="operations-management-container">
      <div className="pothole-list">
        <h1 className='pothole-name'>포트홀 목록</h1>
        <div className='pothole-start'>
          <div className='work_information'>현재 활성화 된 작업개수: {selectedPotholes.length}</div>
          <button className='start-button' onClick={onStartWork}>작업 시작</button>
        </div>
        <ul>
          {sortedPotholeList.map(pothole => (
            <li
              key={pothole.repairId}
              onClick={() => onPotholeClick(pothole)}
              style={{
                backgroundColor: selectedPotholes.includes(pothole.repairId) ? 'lavender' : 'transparent'
              }}
            >
              보수작업 {pothole.title}
              {pothole.repairId} <br />{getCoordinates(pothole.location).lat}, {getCoordinates(pothole.location).lng}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

function Kakao() {
  const [map, setMap] = useState(null);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [selectedMarkers, setSelectedMarkers] = useState([]);
  const [potholeList, setPotholeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [disabledMarkers, setDisabledMarkers] = useState(getDisabledMarkers);
  const polylineRef = useRef(null);

  useEffect(() => {
    const fetchRepairData = async () => {
      try {
        // 새로운 API에 GET 요청을 보내고 응답을 기다림
        const response = await axios.get('https://i11c104.p.ssafy.io/api/v1/repair/map');
        
        // 응답 데이터에서 repairId와 위치를 추출하여 새 배열 생성
        const data = response.data.map(repair => ({
          repairId: repair.repairId,
          location: repair.pothole.location
        }));
        
        // 변환된 데이터를 상태에 저장
        setPotholeList(data);
      } catch (error) {
        console.error('Error fetching repair data:', error);
        setError('Failed to load repair data.');
      } finally {
        setLoading(false);
      }
    };

    fetchRepairData();

    // 5초마다 데이터를 갱신
    const intervalId = setInterval(fetchRepairData, 5000);

    // 컴포넌트 언마운트 시 인터벌 정리
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
      const newSelectedMarkers = prevSelectedMarkers.includes(marker.repairId)
        ? prevSelectedMarkers.filter(id => id !== marker.repairId)
        : [...prevSelectedMarkers, marker.repairId];

      return newSelectedMarkers;
    });
  };

  const handleRestoreMarkers = () => {
    setDisabledMarkers([]);
    saveDisabledMarkers([]);
  };

  const handleStartWork = async () => {
    try {
      await axios.post('https://i11c104.p.ssafy.io/api/v1/repair/start', {
        repairId: selectedMarkers,
      });
      
      setPotholeList((prevList) =>
        prevList.map((item) =>
          selectedMarkers.includes(item.repairId)
            ? { ...item, status: 'ongoing' }
            : item
        )
      );

      setDisabledMarkers((prevDisabledMarkers) => {
        const newDisabledMarkers = [...prevDisabledMarkers, ...selectedMarkers];
        saveDisabledMarkers(newDisabledMarkers);
        return newDisabledMarkers;
      });

      setSelectedMarkers([]);
    } catch (error) {
      console.error('Failed to start repair:', error);
    }
  };

  const updatePolyline = useCallback(async (selectedMarkers) => {
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    if (selectedMarkers.length > 0) {
      const selectedPotholeLocations = selectedMarkers.map(id => {
        const pothole = potholeList.find(p => p.repairId === id);
        return getCoordinates(pothole.location);
      });

      const origin = selectedPotholeLocations[0];
      const destination = selectedPotholeLocations[selectedPotholeLocations.length - 1];
      const waypoints = selectedPotholeLocations.slice(1, -1).map((location, index) => ({
        name: `waypoint${index}`,
        x: location.lng,
        y: location.lat
      }));

      try {
        const response = await axios.post('https://apis-navi.kakaomobility.com/v1/waypoints/directions', {
          origin: { x: origin.lng, y: origin.lat },
          destination: { x: destination.lng, y: destination.lat },
          waypoints: waypoints,
          priority: 'RECOMMEND',
          car_fuel: 'GASOLINE',
          car_hipass: false,
          alternatives: false,
          road_details: false
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`
          }
        });

        console.log('API Response:', response.data);

        const routePoints = response.data.routes[0].sections.flatMap(section =>
          section.roads.flatMap(road =>
            road.vertexes.reduce((acc, val, index, array) => {
              if (index % 2 === 0) {
                acc.push(new kakao.maps.LatLng(array[index + 1], val));
              }
              return acc;
            }, [])
          )
        );

        const newPolyline = new kakao.maps.Polyline({
          path: routePoints,
          strokeWeight: 5,
          strokeColor: '#3C00BA',
          strokeOpacity: 0.5,
          strokeStyle: 'solid'
        });

        newPolyline.setMap(map);
        polylineRef.current = newPolyline;

        const bounds = new kakao.maps.LatLngBounds();
        routePoints.forEach(point => bounds.extend(point));
        map.setBounds(bounds);

      } catch (error) {
        console.error('Error fetching route:', error);
      }
    }
  }, [map, potholeList]);

  useEffect(() => {
    updatePolyline(selectedMarkers);
  }, [selectedMarkers, updatePolyline]);

  return (
    <div className="operations-management-container">
      <div id="KakaoMap" style={{ width: '100vw', height: '100vh' }}>
        {potholeList.filter(pothole => !disabledMarkers.includes(pothole.repairId)).map((pothole) => (
          <Marker
            key={pothole.repairId}
            map={map}
            position={parsePoint(pothole.location)}
            onClick={() => handleMarkerClick(pothole)}
            isActive={true}
            isSelected={selectedMarkers.includes(pothole.repairId)}
          />
        ))}
      </div>
      <PotholeList
        potholeList={potholeList.filter(pothole => !disabledMarkers.includes(pothole.repairId))}
        selectedPotholes={selectedMarkers}
        onPotholeClick={handleMarkerClick}
        onStartWork={handleStartWork}
      />
      <button onClick={handleRestoreMarkers} className='restore_button'>
        마커 복원하기
      </button>
    </div>
  );
}

export default Kakao;
