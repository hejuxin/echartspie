import React from 'react';
import { defaultData, defaultColor } from '../components/defaultOption';
import Pie from '../components';

const LabelDemo1 = () => {
  const dataSource = defaultData.map((item, index) => {
    const colorIndex = index % defaultData.length;
    return {
      ...item,
      label: {
        color: defaultColor[colorIndex],
      },
    };
  });
  return (
    <div style={{ width: 300, height: 300 }}>
      <Pie
        data={dataSource}
        legendOption={{
          bottom: 0,
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
            formatter: ['{txt|{b}}', '{c}个'].join(' '),
            rich: {
              txt: {
                color: '#000',
              },
            },
            overflow: 'none',
          },
          emphasis: {},
        }}
      />
    </div>
  );
};

export default LabelDemo1;
