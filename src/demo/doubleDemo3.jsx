import React from 'react';
import { defaultData } from '../components/defaultOption';
import DoublePie from '../components';

const DoubleDemo3 = () => {
  return (
    <div style={{ width: 300, height: 300, position: 'relative' }}>
      <DoublePie
        data={[
          defaultData,
          [
            {
              name: '区域点位',
              value: 47,
            },
            { name: 'test1', value: 5 },
            { name: 'test2', value: 8 },
          ],
        ]}
        // radius={[
        //   ['40%', '70%'],
        //   ['0', '30%'],
        // ]}
        // data={{
        //   0: defaultData,
        //   1: [
        //     { name: 'test1', value: 5 },
        //     { name: 'test2', value: 8 },
        //   ],
        // }}
        radius={{
          0: ['40%', '70%'],
          1: ['0', '30%'],
        }}
        legendOption={{
          bottom: 0,
          right: -100,
          icon: 'circle',
          orient: 'vertical',
          content: (params) => {
            return (
              <div
                style={{ fontSize: 12, display: 'flex', alignItems: 'center' }}
              >
                <div>
                  <div
                    className="legend-icon"
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: params.color,
                      marginRight: 5,
                    }}
                  ></div>
                </div>
                <div>
                  <div style={{ fontSize: 14 }}>{params.name}</div>
                  <div>
                    {params.value} {`${params.percent?.toFixed(2)}%`}
                  </div>
                </div>
              </div>
            );
          },
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
            emphasis: {
              // label: {
              //   // show: true,
              //   formatter: (params) => {
              //     return `${params.percent}%`;
              //   },
              // },
            },
            tooltip: {
              show: false,
            },
          },
          {
            label: {
              show: true,
            },
            emphasis: {
              // label: {
              //   // show: true,
              //   formatter: (params) => {
              //     return `${params.percent}%`;
              //   },
              // },
            },
            tooltip: {
              show: false,
            },
          },
        ]}
        // autoPlay
      />
    </div>
  );
};

export default DoubleDemo3;
