import React from 'react';
import { defaultData } from '../components/defaultOption';
import Pie from '../components';

const DoubleDemo1 = () => {
  return (
    <div style={{ width: 300, height: 300, position: 'relative' }}>
      <Pie
        data={[
          defaultData,
          [
            { name: 'test1', value: 5 },
            { name: 'test2', value: 8 },
          ],
        ]}
        radius={{
          0: ['40%', '70%'],
          1: ['35%', '40%'],
        }}
        legendOption={{
          bottom: 0,
          icon: 'circle',
        }}
        seriesOption={[
          {
            itemStyle: {
              borderWidth: 2,
              borderColor: '#fff',
              borderRadius: 10,
            },
            label: {
              show: true,
              content: (params) => {
                return (
                  <div>
                    <div>{params.name}</div>
                    <div
                      style={{
                        width: '100%',
                        height: 1,
                        background: params.color,
                      }}
                    ></div>
                    <div>
                      {params.value}个 {params.percent?.toFixed(2)}
                    </div>
                  </div>
                );
              },
            },
            emphasis: {},
            tooltip: {
              show: false,
            },
          },
          {
            label: {
              show: true,
            },
            emphasis: {},
            tooltip: {
              show: false,
            },
          },
        ]}
        // autoPlay
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
  );
};

export default DoubleDemo1;
