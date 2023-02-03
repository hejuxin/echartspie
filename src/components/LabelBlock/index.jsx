import React from 'react';
import { getParams } from '../../utils';
import './index.css';

const LabelBlock = (props) => {
  const { data, labelPos, option, hightlightIndex } = props;
  return (
    <>
      {data.map((item, index) => {
        if (!item.show) return <></>;
        const params = getParams({ data, index });
        const startPos = labelPos[index]?.[0] || [];
        const endPos = labelPos[index]?.[labelPos.length - 1 || 0] || [];
        const isLeft = startPos[0] - endPos[0] > 0;

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
        return (
          <div
            style={{
              left: endPos?.[0],
              top: endPos?.[1],
              transform: `translate(${isLeft ? '-100%' : 0}, -50%)`,
              maxWidth: isLeft ? endPos?.[0] : 'auto',
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
