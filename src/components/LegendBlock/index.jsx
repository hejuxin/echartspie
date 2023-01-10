import React from 'react';
import { getParams, isNum } from '../../utils';
import './index.css';
// import styles from './index.module.scss'
const LegendBlock = (props) => {
  const {
    option,
    data,
    handleLegendHover,
    handleLegendLeave,
    handleLegendClick,
  } = props;
  const { wrapStyle = {} } = option
  return (
    <div
      style={{
        position: 'absolute',
        left: isNum(option?.left) ? option?.left : 'auto',
        right: isNum(option?.right) ? option?.right : 'auto',
        top: isNum(option?.top) ? option?.top : 'auto',
        bottom: isNum(option?.bottom) ? option?.bottom : 'auto',
        display: 'flex',
        flexDirection: option?.orient === 'vertical' ? 'column' : 'row',
        ...wrapStyle
      }}
    >
      {data.map((item, index) => {
        const params = getParams({ data, index });
        const { seriesIndex = 0, dataIndex = 0, name, show } = item;
        return (
          <div
            onMouseOver={() => handleLegendHover(dataIndex, seriesIndex)}
            onMouseOut={() => handleLegendLeave()}
            onClick={() => handleLegendClick(dataIndex, seriesIndex)}
            // className={`${styles['legend-item']} 
            // ${show ? '' : ` ${styles['noselect-item']}`}`}
            className={`legend-item ${show ? '' : ' noselect-item'}`}
            key={`legend_${name}`}
          >
            {option.content && option.content(params)}
          </div>
        );
      })}
    </div>
  );
};

export default LegendBlock;
