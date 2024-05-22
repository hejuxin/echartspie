import React from 'react';
import { defaultData } from '../mock';
import Pie from '../components';

const AutoDemo1 = () => {
  return (
    <>
      <h3>普通轮播 不传任何配置</h3>
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
        />
      </div>
    </>
  );
};

export default AutoDemo1;
