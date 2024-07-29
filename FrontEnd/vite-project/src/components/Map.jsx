import React, { useEffect, useState } from 'react'
// import { FaExclamationTriangle } from "react-icons/fa";
// import Potholeicon from '.././assets/icons/fa-solid-exclamation.svg';

const {kakao} = window;

function Kakao() {
  const [map, setMap] = useState(null);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);

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

      // var imageSize = new kakao.maps.Size(23,69),
      //     imageOption = {offset: new kakao.maps.Point(27, 69)};

      // var markerImage = new kakao.maps.MarkerImage(Potholeicon, imageSize, imageOption);

      const positions = [
        {
          title: "삼성 사업장",
          latlng: new kakao.maps.LatLng(35.205580, 126.81131)
        },
        {
          title: "새로운 마커 1",
          latlng: new kakao.maps.LatLng(35.207580, 126.81232)
        },
        {
          title: "새로운 마커 2",
          latlng: new kakao.maps.LatLng(35.209880, 126.81333)
        }
      ];

      for (var i=0; i < positions.length; i++) {
        var marker = new kakao.maps.Marker({
          map: newMap,
          position: positions[i].latlng,
          title: positions[i].title,
          // image: markerImage
        });
      }
      
      return () => {
        window.removeEventListener('resize', resizeListener);
      };
  }, []);

  return (

    <div>

      <div id="KakaoMap"
      style={{width: innerWidth-20, height: innerHeight-120}}
      >
      {/* Marker add */}
      {/* <Marker map={map} position={{lat: 35.205580, lng:126.811458}} title="Marker 1" /> */}

      </div>
    </div>

  )
}

export default Kakao