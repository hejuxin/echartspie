import React from 'react';
import { getParams } from '../../utils';

const TooltipBlock = (props) => {
  const { autoCurrent = {}, dataSource } = props;

  return (
    <>
      {Object.keys(autoCurrent).map((key) => {
        const value = autoCurrent[key];
        const data = dataSource[key];
        let index = -1;

        if (value >= 0) {
          index = data.findIndex((item) => item.dataIndex === value);
        }
        const params = getParams({ data, index });
        console.log(params, 'params');
        return (
          <div>
            <div
              style={{
                width: 10,
                height: 10,
                background: params.color,
                borderRadius: '50%',
              }}
            ></div>
            <span style={{ marginRight: 8 }}>{params.name}</span>
            <span>{params.value}</span>
          </div>
        );
      })}
    </>
  );
};

export default TooltipBlock;
