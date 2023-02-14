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
      <div style={{ width: 300, height: 300 }}>
        <Pie
          type="sunburst"
          radius={['30%', '90%']}
          data={data}
          legendOption={{
            bottom: 0,
            icon: 'circle',
          }}
          tooltipOption={{
            content: (params, ticket, callback) => {
              return `
                  <div style="font-size: 14px; color: #595959">
                    <div>${params.name}</div>
                    <div>
                    <span style="color: ${params.color};font-size: 24px; font-weight: 600;">${params.value}</span>  个
                    </div>

                  </div>
                `;
            },
          }}
          seriesOption={{
            itemStyle: {
              borderWidth: 2,
              borderColor: '#fff',
              borderRadius: 10,
            },
            label: {
              rotate: 'radial',
            },
            emphasis: {},
          }}
          centerBlockOption={{
            margin: 5,
            padding: 5,
            border: '1px solid #000',
            radius: '30%',
            backgroundColor: '#DBDFF1',
            content: (params) => {
              return (
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {params.name}
                </div>
              );
            },
          }}
        />
      </div>
    </>
  );
};

export default SunburstDemo1;
