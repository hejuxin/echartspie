import React from 'react';
import { defaultData } from '../mock';
import Pie from '../components';

const DoughnutDemo1 = () => {
  return (
    <div style={{ width: 300, height: 300, position: 'relative' }}>
      <Pie
        data={defaultData}
        radius={['40%', '70%']}
        legendOption={{
          bottom: 0,
          icon: 'circle',
        }}
        seriesOption={{
          itemStyle: {
            borderWidth: 2,
            borderColor: '#fff',
            borderRadius: 10,
          },
          label: {
            show: false,
          },
          emphasis: {},
          tooltip: {
            show: false,
          },
        }}
        centerBlockOption={{
          margin: 5,
          padding: 5,
          border: '1px solid #000',
          radius: '40%',
          backgroundColor: '#DBDFF1',
          content: (params) => {
            return (
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {params.name}
              </div>
            );
          },
        }}
      />
    </div>
  );
};

export default DoughnutDemo1;
