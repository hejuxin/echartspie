import React from 'react';
import { defaultData } from '../mock';
import Pie from '../components';

const LegendDemo2 = () => {
  return (
    <>
      <h3>支持自定义传入react元素</h3>
      <div style={{ width: 300, height: 300 }}>
        <Pie
          data={defaultData}
          legendOption={{
            bottom: 0,
            right: 0,
            icon: 'circle',
            orient: 'vertical',
            content: (params) => {
              // 兼容双饼图模式，params为array
              return (
                <div style={{ fontSize: 12 }}>
                  <div style={{ fontSize: 14 }}>{params.name}</div>
                  <div style={{ color: params.color }}>
                    {params.value} {`${params.percent?.toFixed(2)}%`}
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
            tooltip: {
              show: false,
            },
            emphasis: {},
          }}
        />
      </div>
    </>
  );
};

export default LegendDemo2;
