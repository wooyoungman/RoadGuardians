import React, { useEffect } from 'react';

const TableauDashboard = () => {
  useEffect(() => {
    const divElement = document.getElementById('viz1721116189429');

    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
    scriptElement.onload = () => {
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
        width: '100vw',
        height: 'calc(100vh - 60px)',
        overflow: 'hidden',
        marginTop: '30px',
        position: 'relative'
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
