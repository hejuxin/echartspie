import React from 'react';
import { defaultData } from '../components/defaultOption';
import Pie from '../components';

const DoubleDemo3 = () => {
  return (
    <div style={{ width: 300, height: 300, position: 'relative' }}>
      <Pie
        data={[
          defaultData,
          [
            { name: 'test1', value: 5 },
            { name: 'test2', value: 8 },
            {
              name: '区域点位',
              value: 13,
            },
          ],
        ]}
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
            // 兼容双饼图模式，params为array
            const common = {
              name: params?.[0]?.name,
              color: params?.[0]?.color
            }
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
                      background: common.color,
                      marginRight: 5,
                    }}
                  ></div>
                </div>
                <div>
                  <div style={{ fontSize: 14 }}>{common.name}</div>
                  {
                    Object.values(params)?.map(item => {
                      return (
                        <div>
                          {`${item.seriesIndex}：`}{item.value} {`${item.percent?.toFixed(2)}%`}
                        </div>
                      )
                    })
                  }

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
                    <div>
                      {params.value}个 {params.percent?.toFixed(2)}
                    </div>
                  </div>
                );
              },
              isLineExtend: true,
              lineExtendLength: 100,
              mode: 'insideLine',
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
            emphasis: {},
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
