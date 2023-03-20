import React, { useMemo } from 'react';
import { INITNUM } from '../enum';
import { getParams2 } from '../utils';
import { isNum } from '../utils/common';

const CenterBlock = (props) => {
  const { option = {}, highData, dataSource } = props;

  if (!Object.keys(option).length) return;
  const { radius = 0, margin = 0, border = 'none', padding = 0 } = option;

  const centerBlockInfo = useMemo(() => {
    const unit = isNum(margin) ? 'px' : '';
    // todo radius 不传取最小值
    const width = radius ? `calc(${radius} - ${margin * 2}${unit})` : 0;
    const left = `calc(50% - ${width} / 2)`;

    return {
      width,
      left,
    };
  }, [radius, margin]);

  const getCenterContent = () => {
    const highingKeys = Object.keys(highData).map(key => {
      if (highData[key] !== INITNUM) return key;
    }).filter(Boolean);

    if (highingKeys.length === 0) return;

    let params;
    if (highingKeys.length === 1) {
      const highingKey = highingKeys[0];
      const highingVal = highData[highingKey];
      const dataArr = dataSource[highingKey];

      params = getParams2({
        data: dataArr,
        // 适配旭日图模式
        item: dataArr.find(item => item.dataIndex === highingVal) || {}
      })

    } else {
      // 双饼图内外都自动轮播的情况
      let paramsArr = [];
      Object.keys(highingKeys).map(highingKey => {
        const highingVal = highData[highingKey];
        const dataArr = dataSource[highingKey];

        const param = getParams2({
          data: dataArr,
          item: dataArr.find(item => item.dataIndex === highingVal) || {}
        });

        paramsArr.push(param);
      })

      params = [...paramsArr];
    }

    const { content } = option;
    if (!content) return;
    if (typeof content === 'function') {
      // return content(params, wholeTree);
      return content(params);
    }
    return content;
  }

  return centerBlockInfo.width ? (
    <div
      style={{
        width: centerBlockInfo.width,
        height: centerBlockInfo.width,
        borderRadius: '50%',
        position: 'absolute',
        left: centerBlockInfo.left,
        top: centerBlockInfo.left,
        // zIndex: -1,
        border,
        padding,
        boxSizing: 'border-box',
      }}
      className="center-block"
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          backgroundColor: option.backgroundColor || 'transparent',
          backgroundImage: option.backgroundImage
            ? `url(${option.backgroundImage})`
            : '',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {getCenterContent()}
      </div>
    </div>
  ) : null;
};

export default React.memo(CenterBlock);
