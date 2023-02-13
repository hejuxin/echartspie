import React from 'react';
import { defaultData } from '../components/defaultOption';
import Pie from '../components';

const SunburstDemo1 = () => {
  const data = [
    {
      name: 'Grandpa',
      children: [
        {
          name: 'Uncle Leo',
          value: 15,
          children: [
            {
              name: 'Cousin Jack',
              value: 2,
            },
            {
              name: 'Cousin Mary',
              value: 5,
              children: [
                {
                  name: 'Jackson',
                  value: 2,
                },
              ],
            },
            {
              name: 'Cousin Ben',
              value: 4,
            },
          ],
        },
        {
          name: 'Father',
          value: 10,
          children: [
            {
              name: 'Me',
              value: 5,
            },
            {
              name: 'Brother Peter',
              value: 1,
            },
          ],
        },
      ],
    },
    {
      name: 'Nancy',
      children: [
        {
          name: 'Uncle Nike',
          children: [
            {
              name: 'Cousin Betty',
              value: 1,
            },
            {
              name: 'Cousin Jenny',
              value: 2,
            },
          ],
        },
      ],
    },
  ];
  return (
    <>
      <h3>普通轮播 不传任何配置</h3>
      <div style={{ width: 300, height: 300 }}>
        <Pie
          type="sunburst"
          radius={[0, '90%']}
          data={data}
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

export default SunburstDemo1;
