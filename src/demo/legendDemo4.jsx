import React from 'react';
import { defaultData } from '../mock';
import Pie from '../components';

const LegendDemo4 = () => {
  return (
    <div style={{ width: 300, height: 300, position: 'relative' }}>
      <Pie
        data={defaultData}
        radius={['40%', '70%']}
        legendOption={{
          bottom: 0,
          icon: 'circle',
          content: (params) => {
            return (
              <div
                style={{ fontSize: 12, display: 'flex', alignItems: 'center' }}
              >
                <div>
                  <div
                    className="legend-icon"
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: params.color,
                      marginRight: 5,
                    }}
                  ></div>
                </div>
                <div>
                  <div style={{ fontSize: 14 }}>{params.name}</div>
                  <div>
                    {params.value} {`${params.percent?.toFixed(2)}%`}
                  </div>
                </div>
              </div>
            );
          },
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

export default LegendDemo4;
