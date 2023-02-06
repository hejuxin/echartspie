import React from 'react';
import { defaultData } from '../components/defaultOption';
import Pie from '../components';

const LabelDemo3 = () => {
  return (
    <div style={{ width: 300, height: 300 }}>
      <Pie
        data={defaultData}
        legendOption={{
          bottom: 0,
          right: 0,
          icon: 'circle',
        }}
        tooltipOption={{
          show: false,
        }}
        seriesOption={{
          itemStyle: {
            borderWidth: 2,
            borderColor: '#fff',
            borderRadius: 10,
          },
          label: {
            show: true,
            content: (params) => {
              return (
                <div
                  style={{
                    display: 'flex',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    fontSize: 12,
                  }}
                >
                  <div>{params.name}</div>
                  <div>{params.value}个</div>
                  <div>{params.percent?.toFixed(2)}</div>
                </div>
              );
            },
            overflow: 'none',
          },
          labelLine: {
            // show: false,
            lineStyle: {
              cap: 'round',
            },
          },
          emphasis: {},
        }}
      />
    </div>
  );
};

export default LabelDemo3;
