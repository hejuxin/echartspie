import React from 'react';
import { defaultData } from '../components/defaultOption';
import Pie from '../components';

const LegendDemo1 = () => {
  return (
    <div style={{ width: 300, height: 300 }}>
      <Pie
        data={defaultData}
        radius={'80%'}
        legendOption={{
          bottom: 0,
          icon: 'circle',
          content: (params) => {
            return `${params.name} ${params.value} ${params.percent?.toFixed(
              2
            )}%`;
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
      />
    </div>
  );
};

export default LegendDemo1;
