import React from 'react';
import { getParams, isNum } from '../../utils';
import './index.css';

const LabelBlock = (props) => {
  const {
    data,
    labelPos,
    option,
    hightlightIndex,
    chartsWidth,
    distanceToLabelLine,
  } = props;
  const label = option.label;
  const mode = label.mode || 'outsideLine';

  // const getStyle = () => {
  //   let textAlign = 'left';
  //   let transformX = 0;
  //   let transformY = '-50%';
  //   let maxWidth = 'auto';
  //   return {
  //     textAlign,
  //     transformX,
  //     transformY,
  //     maxWidth,
  //   };
  // };
  return (
    <>
      {data.map((item, index) => {
        if (!item.show) return <></>;
        const params = getParams({ data, index });

        const posItem = labelPos[index];
        const startPos = posItem?.[0] || [];
        const endIndex = labelPos.length > 1 ? labelPos.length - 1 : 0;
        const endPos = posItem?.[endIndex] || [];
        const startPosX = startPos?.[0];
        const endPosX = endPos?.[0];
        let isLeft = true;
        if (isNum(startPosX) && isNum(endPosX)) {
          isLeft = startPosX - endPosX > 0;
        }

        const isActive = hightlightIndex === index;

        // const activeLabel = item.emphasis?.label
        //   ? item.emphasis?.label
        //   : option?.emphasis?.label;
        // const normalLabel = item.label ? item.label : option?.label;

        const activeLabel = {
          ...option?.emphasis?.label,
          ...item.emphasis?.label,
        };
        const normalLabel = {
          ...option?.label,
          ...item.label,
        };

        let textAlign = 'left';
        let transformX = 0;
        let transformY = '-50%';
        let maxWidth = 'auto';
        let left = endPosX;

        let distance = 0;
        if (mode === 'insideLine') {
          distance = isNum(distanceToLabelLine) ? distanceToLabelLine : 0;
          if (isLeft) {
            textAlign = 'left';
            transformX = `calc(${distance}px)`;

            left = endPosX > 0 ? endPosX : 0;
          } else {
            textAlign = 'right';
            transformX = `calc(-100% + ${distance}px)`;

            left = endPosX > chartsWidth ? chartsWidth : endPosX;
          }

          const lineLength2 =
            labelPos.length >= 2
              ? endPos[0] - posItem[labelPos.length - 2]?.[0]
              : 0;

          // 先取正，再进行计算
          maxWidth = Math.abs(lineLength2) - distance;
        } else if (mode === 'outsideLine') {
          distance = isNum(distanceToLabelLine) ? distanceToLabelLine : 5;
          if (isLeft) {
            transformX = '-100%';
            maxWidth = endPosX;
          } else {
            transformX = 0;
            maxWidth = chartsWidth - endPosX;
          }

          maxWidth = maxWidth - distance;
        }

        return (
          <div
            style={{
              left,
              top: endPos?.[1],
              transform: `translate(${transformX}, ${transformY})`,
              maxWidth,
              textAlign,
            }}
            key={`label_${item.name}`}
            className="label-item"
          >
            {activeLabel?.content
              ? isActive
                ? activeLabel.content(params)
                : normalLabel.content && normalLabel.content(params)
              : normalLabel.content && normalLabel.content(params)}
          </div>
        );
      })}
    </>
  );
};
export default LabelBlock;
