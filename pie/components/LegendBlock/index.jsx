import React from 'react';
import { getParams, isUndefined } from '../../../utils';
import './index.css';
const LegendBlock = (props) => {
  const {
    option,
    data,
    handleLegendHover,
    handleLegendLeave,
    handleLegendClick,
  } = props;
  return (
    <div
      style={{
        position: 'absolute',
        left: isUndefined(option?.left) ? 'auto' : option?.left,
        right: isUndefined(option?.right) ? 'auto' : option?.right,
        top: isUndefined(option?.top) ? 'auto' : option?.top,
        bottom: isUndefined(option?.bottom) ? 'auto' : option?.bottom,
        display: 'flex',
        flexDirection: option?.orient === 'vertical' ? 'column' : 'row',
      }}
    >
      {data.map((item, index) => {
        const params = getParams(data, index);
        return (
          <div
            onMouseOver={() => handleLegendHover(index)}
            onMouseOut={() => handleLegendLeave()}
            onClick={() => handleLegendClick(index)}
            className={`legend-item 
            ${item.show ? '' : ' no-select-item'}`}
            key={`legend_${item.name}`}
          >
            {option.content && option.content(params)}
          </div>
        );
      })}
    </div>
  );
};

export default LegendBlock;
