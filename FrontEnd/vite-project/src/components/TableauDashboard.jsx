import React, { useEffect } from 'react';

const TableauDashboard = () => {
  useEffect(() => {
    const divElement = document.getElementById('viz1721116189429');
    const vizElement = divElement.getElementsByTagName('object')[0];

    // Tableau JavaScript API를 로드합니다.
    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
    scriptElement.onload = () => {
      // Tableau 대시보드를 초기화합니다.
      if (window.tableau && divElement) {
        new window.tableau.Viz(divElement, 'https://public.tableau.com/views/RoadGuardians/RoadGuardians', {
          width: '100%',
          height: '100%',
          hideTabs: true,
          hideToolbar: false
        });
      }
    };
    document.body.appendChild(scriptElement);
  }, []);

  return (
    <div
      id='viz1721116189429'
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw', // 전체 화면 너비
        height: 'calc(100vh - 60px)', // 네비게이션 바 높이를 제외한 전체 높이
        overflow: 'hidden', // 스크롤 없애기
        position: 'relative',
        marginTop: '50px' // 네비게이션 바 높이만큼 위로 여백 추가
      }}
    >
      <object
        className='tableauViz'
        style={{
          width: '100%',
          height: '100%',
          border: 'none'
        }}
      >
        <param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' />
        <param name='embed_code_version' value='3' />
        <param name='site_root' value='' />
        <param name='name' value='RoadGuardians/RoadGuardians' />
        <param name='tabs' value='no' />
        <param name='toolbar' value='yes' />
        <param name='static_image' value='https://public.tableau.com/static/images/Ro/RoadGuardians/RoadGuardians/1.png' />
        <param name='animate_transition' value='yes' />
        <param name='display_static_image' value='yes' />
        <param name='display_spinner' value='yes' />
        <param name='display_overlay' value='yes' />
        <param name='display_count' value='yes' />
        <param name='language' value='ko-KR' />
      </object>
    </div>
  );
};

export default TableauDashboard;
