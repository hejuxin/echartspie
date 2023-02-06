import React from 'react';
import { getParams } from '../../utils';
import './index.css';

const LabelBlock = (props) => {
  const { data, labelPos, option, hightlightIndex, chartsWidth } = props;
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
        const endPosX = endPos?.[0];
        const isLeft = startPos[0] - endPosX > 0;

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
        if (mode === 'insideLine') {
          if (isLeft) {
            textAlign = 'left';
            transformX = 0;

            left = endPosX > 0 ? endPosX : 0;
          } else {
            textAlign = 'right';
            transformX = '-100%';

            left = endPosX > chartsWidth ? chartsWidth : endPosX;
          }

          const lineLength2 =
            labelPos.length >= 2
              ? endPos[0] - posItem[labelPos.length - 2]?.[0]
              : 0;

          maxWidth = Math.abs(lineLength2);
        } else if (mode === 'outsideLine') {
          if (isLeft) {
            transformX = '-100%';
            maxWidth = endPosX;
          } else {
            transformX = 0;
            maxWidth = chartsWidth - endPosX;
          }
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
