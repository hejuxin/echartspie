import React from 'react';
import { defaultData } from '../mock';
import Pie from '../components';

const DoughnutDemo2 = () => {
  return (
    <div style={{ width: 300, height: 300, position: 'relative' }}>
      <Pie
        data={defaultData}
        radius={['40%', '70%']}
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
        }}
        centerBlockOption={{
          margin: 5,
          padding: 5,
          border: '1px solid #000',
          radius: '40%',
          backgroundColor: '#DBDFF1',
          backgroundImage:
            'https://t7.baidu.com/it/u=2582370511,530426427&fm=193&f=GIF',
          content: (params) => {
            return <div style={{ color: params.color }}>ffffffffff</div>;
          },
        }}
      />
    </div>
  );
};

export default DoughnutDemo2;
