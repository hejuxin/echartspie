import React from 'react';
import { getParams2, isNum } from '../utils';
import './index.css';

const LabelBlock = (props) => {
  const {
    data,
    labelPos,
    option,
    hightlightIndex,
    chartsWidth,
    distanceToLabelLine,
    color
  } = props;

  return (
    <>
      {data.map((item, index) => {
        if (!item.show) return <></>;
        const params = getParams2({ data, item, color });

        const posItem = labelPos[index];
        const startPos = posItem?.[0] || [];
        const endIndex = labelPos.length > 1 ? labelPos.length - 1 : 0;
        const endPos = posItem?.[endIndex] || [];
        const startPosX = startPos?.[0];
        const endPosX = endPos?.[0];
        const endPosY = endPos?.[1];
        let isLeft = true;
        if (isNum(startPosX) && isNum(endPosX)) {
          isLeft = startPosX - endPosX > 0;
        }

        const isActive = hightlightIndex === index;

        const activeLabel = {
          ...option?.active,
          ...item.emphasis?.label,
        };
        const normalLabel = {
          ...option?.normal,
          ...item.label,
        };
        // console.log(normalLabel, 'normalLabel');

        let isShowLabel = true;
        let isShowActive = false;
        if (isActive) {
          if (activeLabel?.show && activeLabel?.content) {
            isShowActive = true;
          } else {
            isShowActive = false;

            if (normalLabel?.show) {
              isShowLabel = true;
            } else {
              isShowLabel = false;
            }
          }
        } else {
          isShowActive = false;

          if (normalLabel?.show) {
            isShowLabel = true;
          } else {
            isShowLabel = false;
          }
        }

        let mode =
          (isShowActive ? activeLabel.mode : normalLabel.mode) || 'outsideLine';

        let textAlign = 'left';
        let transformX = 0;
        let transformY = '-50%';
        let maxWidth = 'auto';
        let left = endPosX;

        let distance = 0;
        if (mode === 'insideLine') {
          distance = isNum(distanceToLabelLine) ? distanceToLabelLine : 0;

          const lineLength2 =
            labelPos.length >= 2
              ? endPos[0] - posItem[labelPos.length - 2]?.[0]
              : 0;

          // 先取正，再进行计算
          maxWidth = Math.abs(lineLength2) - distance;

          if (isLeft) {
            textAlign = 'left';
            transformX = `calc(${distance}px)`;

            left = endPosX > 0 ? endPosX : 0;
          } else {
            textAlign = 'right';
            // 关于distance偏移，在右边往左偏时是减去
            if (endPosX > chartsWidth) {
              // 超出右边边界，此时left取最大值时width会存在问题。使用left先取charts宽度 - line长度，在transform时再进行回正
              left = chartsWidth - lineLength2;
              transformX = `calc(-100% + ${lineLength2}px - ${distance}px)`;
            } else {
              // 没超出右边边界时，此时left取最大值时width会可能存在问题
              left = endPosX - lineLength2;
              transformX = `calc(-100% + ${lineLength2}px - ${distance}px)`;
            }
          }
        } else if (mode === 'outsideLine') {
          distance = isNum(distanceToLabelLine) ? distanceToLabelLine : 5;
          if (isLeft) {
            // transformX = '-100%';
            transformX = `calc(-100% - ${distance}px)`;
            maxWidth = endPosX;
          } else {
            transformX = `calc(${distance}px)`;
            maxWidth = chartsWidth - endPosX;
          }

          maxWidth = maxWidth - distance;
        }

        const commonCapStyle = {
          position: 'absolute',
          left: endPosX < 0 ? 0 : endPosX > chartsWidth ? chartsWidth : endPosX,
          top: endPosY,

          transform: 'translateY(-50%)',
          background: params.color,
        };

        return (
          <>
            {isShowActive ? (
              <div
                style={{
                  ...commonCapStyle,
                  ...(activeLabel.capStyle || {}),
                }}
              ></div>
            ) : (
              isShowLabel && (
                <div
                  style={{
                    ...commonCapStyle,
                    ...(normalLabel.capStyle || {}),
                  }}
                ></div>
              )
            )}

            <div
              style={{
                left,
                top: endPosY,
                transform: `translate(${transformX}, ${transformY})`,
                maxWidth,
                textAlign,
              }}
              key={`label_${item.name}`}
              className="label-item"
            >
              {isShowActive
                ? activeLabel?.content(params)
                : isShowLabel &&
                normalLabel?.content &&
                normalLabel?.content(params)}
            </div>
          </>
        );
      })}
    </>
  );
};
export default LabelBlock;
