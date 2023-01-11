import React from 'react';
import { defaultData } from '../components/defaultOption';
import Pie from '../components';

const AutoDemo1 = () => {
  return (
    <div style={{ width: 300, height: 300 }}>
      <Pie
        data={defaultData}
        autoPlay
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
      />
    </div>
  );
};

export default AutoDemo1;
