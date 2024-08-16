import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import normalMarker from '../assets/normal_marker.png';
import overMarker from '../assets/click_marker.png';
import clickMarker from '../assets/click_marker.png';
import Draggable from 'react-draggable';
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
};

const PotholeList = ({ potholeList, selectedPotholes, onPotholeClick, onStartWork, locationNames }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Draggable defaultPosition={{ x: window.innerWidth - 340, y: 20 }}>
      <div className={`pothole-list ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="pothole-header">
          <h1 className='pothole-name'>포트홀 목록 </h1>
          <button className='toggle-button' onClick={toggleCollapse}>
            {isCollapsed ? '▶' : '▼'}
          </button>
        </div>
        {!isCollapsed && (
          <>
            <div className='pothole-start'>
              <div className='work_information'>현재 활성화 된 작업개수: {selectedPotholes.length}</div>
              <button className='start-button' onClick={onStartWork}>시작</button>
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
                  {pothole.repairId} <br />{locationNames[pothole.repairId] || '주소를 가져오는 중...'}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </Draggable>
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
  const [locationNames, setLocationNames] = useState({});
  const polylineRef = useRef(null);
  const [newDB, setNewDB] = useState(false);

  const getCenterByDeptId = (deptId) => {
    switch (deptId) {
      case 2:
        return { lat: 35.1392, lng: 126.7939 };
      case 3:
        return { lat: 35.1469, lng: 126.9238 };
      case 4:
        return { lat: 35.1463, lng: 126.8519 };
      case 5:
        return { lat: 35.1275, lng: 126.9028 };
      case 6:
        return { lat: 35.1743, lng: 126.9125 };
      default:
        return { lat: 35.1463, lng: 126.8519 };
    }
  };

  const reverseGeocode = useCallback(async (lat, lon, id, deptId) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${import.meta.env.VITE_GOOGLE_API_KEY}&language=ko`
      );
      const { results } = response.data;
      if (results && results.length > 0) {
        const { formatted_address } = results[0];
        setLocationNames((prev) => ({ ...prev, [id]: formatted_address }));

        let targetGu = '';

        switch (deptId) {
          case 2:
            targetGu = '광산구';
            break;
          case 3:
            targetGu = '동구';
            break;
          case 4:
            targetGu = '서구';
            break;
          case 5:
            targetGu = '남구';
            break;
          case 6:
            targetGu = '북구';
            break;
          default:
            targetGu = '';
        }

        if (formatted_address.includes(targetGu)) {
          setPotholeList((prevList) =>
            prevList.map((pothole) =>
              pothole.repairId === id ? { ...pothole, isVisible: true } : pothole
            )
          );
        } else {
          setPotholeList((prevList) =>
            prevList.map((pothole) =>
              pothole.repairId === id ? { ...pothole, isVisible: false } : pothole
            )
          );
        }
      } else {
        setLocationNames((prev) => ({ ...prev, [id]: '위치 정보를 찾을 수 없습니다.' }));
      }
    } catch (error) {
      console.error('역지오코딩 오류:', error);
      setLocationNames((prev) => ({ ...prev, [id]: '역지오코딩 오류' }));
    }
  }, []);

  useEffect(() => {
    const fetchRepairData = async () => {
      try {
        const deptId = parseInt(localStorage.getItem('deptId'), 10);

        if (isNaN(deptId)) {
          console.error("Invalid deptId");
          return;
        }

        const beforeResponse = await axios.get('https://i11c104.p.ssafy.io/api/v1/repair?status=before');

        const beforeData = beforeResponse.data;

        if (Array.isArray(beforeData)) {
          const allData = beforeData
            .filter((repair) => repair.department.deptId === deptId)
            .map((repair) => ({
              repairId: repair.repairId,
              location: repair.pothole.location,
              deptId: repair.department.deptId,
              deptName: repair.department.deptName,
              isVisible: false,
            }));

          console.log(allData);

          setPotholeList(allData);

          allData.forEach((item) => {
            const { lat, lng } = getCoordinates(item.location);
            reverseGeocode(lat, lng, item.repairId, item.deptId);
          });
        } else {
          console.error('Error: Unexpected response structure', beforeData);
          setError('Unexpected response structure from API');
        }
      } catch (error) {
        console.error('Error fetching repair data:', error);
        setError('Failed to load repair data.');
      } finally {
        setLoading(false);
      }
    };

    fetchRepairData();
  }, [reverseGeocode, newDB]);

  useEffect(() => {
    const socket = new WebSocket('wss://i11c104.p.ssafy.io/ws');

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
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    const resizeListener = () => {
      setInnerWidth(window.innerWidth);
      setInnerHeight(window.innerHeight);
    };
    window.addEventListener("resize", resizeListener);

    const container = document.getElementById('KakaoMap');
    const deptId = parseInt(localStorage.getItem('deptId'), 10);
    const center = getCenterByDeptId(deptId);

    if (container) {
      const options = {
        center: new kakao.maps.LatLng(center.lat, center.lng),
        level: 3
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
      <div className="repair-map-container">
        <div id="KakaoMap" style={{ width: '60vw', height: '80vh' }}>
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
      </div>
      <PotholeList
        potholeList={potholeList.filter(pothole => !disabledMarkers.includes(pothole.repairId))}
        selectedPotholes={selectedMarkers}
        onPotholeClick={handleMarkerClick}
        onStartWork={handleStartWork}
        locationNames={locationNames}
      />
      <button onClick={handleRestoreMarkers} className='restore_button'>
        마커 복원하기
      </button>
    </div>
  );
}

export default Kakao;

