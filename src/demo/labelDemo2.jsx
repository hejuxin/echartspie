import React from 'react';
import { defaultData } from '../components/defaultOption';
import Pie from '../components';

const LabelDemo2 = () => {
  return (
    <div style={{ width: 300, height: 300 }}>
      <h3>线末端</h3>
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
                <div>
                  <div>{params.name}</div>
                  {/* <div
                    style={{
                      width: '100%',
                      height: 1,
                      background: params.color,
                    }}
                  ></div> */}
                  <div>
                    {params.value}个 {params.percent?.toFixed(2)}
                  </div>
                </div>
              );
            },
            overflow: 'none',
            isLineExtend: true,
            lineExtendLength: 100,
            mode: 'insideLine',
          },
          labelLine: {
            // show: false,
            cap: 'round',
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

export default LabelDemo2;
