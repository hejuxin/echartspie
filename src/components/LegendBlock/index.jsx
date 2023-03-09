import React, { useMemo } from 'react';
import { getParams, isNum } from '../../utils';
import LegendItem from './item';
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
  const { wrapStyle = {} } = option;
  const dataSource = useMemo(() => {
    const obj = {};
    data.forEach(item => {
      const { name, seriesIndex, dataIndex } = item;
      // if (!obj[name]) {
      //   obj[name] = {};
      // }

      // obj[name][seriesIndex] = dataIndex;

      if (!obj[name]) {
        obj[name] = item;
      }
    })
    return Object.values(obj)
  }, [data])

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
      {dataSource.map((item, index) => {
        const params = getParams({ data: dataSource, index });
        const { name, show } = item;
        return (
          <LegendItem
            key={`legend_${name}`}
            handleLegendHover={handleLegendHover}
            handleLegendLeave={handleLegendLeave}
            handleLegendClick={handleLegendClick}
            name={name}
            show={show}
          >
            {option.content && option.content(params)}
          </LegendItem>
        );
      })}
    </div>
  );
};

export default LegendBlock;
