import React from 'react';
import { defaultData } from '../components/defaultOption';
import Pie from '../components';

const AutoDemo1 = () => {
  return (
    <>
      <h3>普通轮播 轮播时不出现tooltip</h3>
      <div style={{ width: 300, height: 300 }}>
        <Pie
          data={defaultData}
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
          }}
          autoPlay
          autoPlayOption={{
            showTip: false,
            startOps: {
              seriesIndex: [0],
              dataIndex: [0],
            },
          }}
          highLightCallback={(parmas) => {
            console.log('p', parmas);
          }}
        />
      </div>
    </>
  );
};

export default AutoDemo1;
