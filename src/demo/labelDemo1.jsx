import React from 'react';
import { defaultData } from '../mock';
import Pie from '../components';

const color = [
  '#FF0000',
  '#FF7F00',
  '#FFFF00',
  '#00FF00',
  '#00FFFF',
  '#0000FF',
  '#8B00FF'
]

const LabelDemo1 = () => {
  const dataSource = defaultData.map((item, index) => {
    const colorIndex = index % defaultData.length;
    return {
      ...item,
      label: {
        color: color[colorIndex],
      },
    };
  });

  console.log(dataSource, 'dataSource')
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
