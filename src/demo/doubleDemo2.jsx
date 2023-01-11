import React from 'react';
import { defaultData } from '../components/defaultOption';
import Pie from '../components';

const DoubleDemo2 = () => {
  return (
    <div style={{ width: 300, height: 300, position: 'relative' }}>
      <Pie
        data={[defaultData, defaultData]}
        radius={{
          0: ['40%', '70%'],
          1: ['0', '30%'],
        }}
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
      />
    </div>
  );
};

export default DoubleDemo2;
