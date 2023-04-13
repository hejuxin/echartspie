import React from 'react';
import { defaultData } from '../components/defaultOption';
import Pie from '../components';

const AutoDemo3 = () => {
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
          1: ['0', '30%'],
        }}
        legendOption={{
          bottom: 0,
          right: -100,
          icon: 'circle',
          orient: 'vertical',
          content: (params) => {
            const commonParams = params[0] || {};
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
                      background: commonParams.color,
                      marginRight: 5,
                    }}
                  ></div>
                </div>
                <div>
                  <div style={{ fontSize: 14 }}>{commonParams.name}</div>
                  {
                    params.map((item, index) => {
                      return (
                        <div key={index}>
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
            emphasis: {},
            tooltip: {
              // content: (params, ticket, callback) => {
              //   return `
              //       <div style="font-size: 14px; color: #595959">
              //         <div>${params.name}</div>
              //         <div>
              //         <span style="color: ${params.color};font-size: 24px; font-weight: 600;">${params.value}</span>  个
              //         </div>

              //       </div>
              //     `;
              // },
              content: (params, ticket, callback) => {
                return (
                  <div style={{ fontSize: 14, color: '#595959' }}>
                    <div>{params.name}</div>
                    <div>
                      <span
                        style={{
                          color: params.color,
                          fontSize: 24,
                          fontWeight: 600,
                        }}
                      >
                        {params.value}
                      </span>{' '}
                      个
                    </div>
                  </div>
                );
              },
            },
          },
          {
            label: {
              show: false,
            },
            emphasis: {},
            tooltip: {
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
            },
          },
        ]}
        autoPlay
        autoPlayOption={{
          // 主要用于设置双饼图模式下，自动轮播的层级
          seriesIndex: [0, 1],
          // seriesIndex: 0,
        }}
      />
    </div>
  );
};

export default AutoDemo3;
