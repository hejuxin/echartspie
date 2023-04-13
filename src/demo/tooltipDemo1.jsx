import React, { useEffect, useState } from 'react';
import { defaultData } from '../components/defaultOption';
import Pie from '../components';

const TooltipDemo1 = () => {
  const [data, setData] = useState([...defaultData]);
  const [radius, setRadius] = useState();

  // 测试数据异步情况
  useEffect(() => {
    setTimeout(() => {
      setData(defaultData.concat(defaultData))
      // setRadius('70%')
    }, 3000)
  }, [])
  return (
    <div style={{ width: 300, height: 300 }}>
      <Pie
        data={data}
        radius={radius}
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
        }}
      />
    </div>
  );
};

export default TooltipDemo1;
