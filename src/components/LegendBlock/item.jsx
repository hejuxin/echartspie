import React, { useCallback, useEffect, useRef } from 'react';
import './index.css';

const LegendItem = props => {
  const { name, show } = props;
  const domRef = useRef();
  const operateRef = useRef();
  // todo 执行两次
  // useEffect(() => {
  //   domRef.current?.removeEventListener('mouseenter', () => { })
  //   domRef.current && domRef.current.addEventListener('mouseenter', () => {
  //     console.log('ggggg')
  //   })

  // }, [])
  const handleMouseEnter = useCallback(() => {
    props.handleLegendHover(name)
  }, [name])

  const handleMouseLeave = () => {
    if (operateRef.current === 'click') return;
    props.handleLegendLeave()
  }

  const handleMouseClick = useCallback(() => {
    operateRef.current = 'click';
    props.handleLegendClick(name)
  }, [name])
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleMouseClick}
    >
      <div
        ref={domRef}

        // className={`${styles['legend-item']} 
        // ${show ? '' : ` ${styles['noselect-item']}`}`}
        className={`legend-item${show ? '' : ' noselect-item'}`}
      >
        {props.children}
      </div>
    </div>

  )
}

export default LegendItem