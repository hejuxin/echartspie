import React from 'react';
import { defaultData } from '../components/defaultOption';
import Pie from '../components';

const SunburstDemo1 = () => {
  const data = [
    {
      name: 'Grandpa',
      value: 15,
      children: [
        {
          value: 5,
          name: 'Grandpa11',
          emphasis: {
            focus: 'ancestor',
          },
        },
      ],
    },
    {
      name: 'Nancy',
      value: 19,
      children: [
        {
          value: 2,
          name: 'Nancy11',
          emphasis: {
            focus: 'ancestor',
          },
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
              show: false,
            },
            emphasis: {
              // focus: 'descendant',
            },
            nodeClick: false,
          }}
          centerBlockOption={{
            margin: 5,
            padding: 5,
            border: '1px solid #DBDFF1',
            radius: '30%',
            content: (params, v) => {
              console.log(params, v, 'params');
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
          highLightCallback={(params, v) => {
            console.log(params, v, 'highLightCallback');
          }}
        />
      </div>
    </>
  );
};

export default SunburstDemo1;
