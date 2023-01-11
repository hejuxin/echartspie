import React from 'react';
import { defaultData } from '../components/defaultOption';
import Pie from '../components';

const TooltipDemo2 = () => {
  return (
    <div style={{ width: 300, height: 300 }}>
      <Pie
        data={defaultData}
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
          tooltip: {},
        }}
        tooltipOption={{
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
        }}
      />
    </div>
  );
};

export default TooltipDemo2;
