import React, { useMemo } from 'react';

const CenterBlock = (props) => {
  const { radius = 0, margin = 0, border = 'none', padding = 0 } = props;

  const centerBlockInfo = useMemo(() => {
    const width = radius ? `calc(${radius} - ${margin * 2}px)` : 0;
    const left = `calc(50% - ${width} / 2)`;

    return {
      width,
      left,
    };
  }, [radius, margin]);

  return centerBlockInfo.width ? (
    <div
      style={{
        width: centerBlockInfo.width,
        height: centerBlockInfo.width,
        borderRadius: '50%',
        position: 'absolute',
        left: centerBlockInfo.left,
        top: centerBlockInfo.left,
        zIndex: -1,
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
          backgroundColor: props.backgroundColor || 'transparent',
          backgroundImage: props.backgroundImage
            ? `url(${props.backgroundImage})`
            : '',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {props.children}
      </div>
    </div>
  ) : null;
};

export default React.memo(CenterBlock);
