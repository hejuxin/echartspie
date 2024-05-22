import React from 'react';
import { defaultData } from '../mock';
import Pie from '../components';

const DoubleDemo2 = () => {
  return (
    <div style={{ width: 300, height: 300, position: 'relative' }}>
      <Pie
        data={[defaultData]}
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
                          {item.value} {`${item.percent?.toFixed(2)}%`}
                        </div>
                      )
                    })
                  }

                </div>
              </div>
            );
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

export default DoubleDemo2;
