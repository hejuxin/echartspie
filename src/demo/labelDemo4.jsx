import React from 'react';
import { defaultData } from '../components/defaultOption';
import Pie from '../components';

const LabelDemo4 = () => {
  return (
    <>
      <h3>label内容省略</h3>
      <div style={{ width: 300, height: 300 }}>
        <Pie
          data={defaultData}
          legendOption={{
            bottom: 0,
            right: 0,
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
              content: (params) => {
                return (
                  <div
                    style={{
                      display: 'flex',
                      maxWidth: '100%',
                      overflow: 'hidden',
                      fontSize: 12,
                      paddingBottom: 15,
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '50%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {params.name}
                    </div>
                    <div>{params.value}个</div>
                    <div>{params.percent?.toFixed(2)}</div>
                  </div>
                );
              },
              overflow: 'none',
              isLineExtend: true,
              lineExtendLength: 100,
              mode: 'insideLine',
            },
            labelLine: {
              // show: false,
              lineStyle: {
                cap: 'round',
              },
            },
            emphasis: {},
          }}
        />
      </div>
    </>
  );
};

export default LabelDemo4;
