import React, { useState, useRef } from 'react';

export function useAutoParams() {
  const [current, setCurrent] = useState({});
  const idxRef = useRef({});
  const timerRef = useRef(null);

  const init = (params) => {
    if (typeof params !== 'object') return;
    const data = params || {};
    idxRef.current = data;
    setCurrent(data);
  };

  const getWip = (key) => {
    if (key) {
      return idxRef.current[key];
    }

    return idxRef.current;
  };

  const setWip = (params) => {
    if (typeof params !== 'object') return;

    idxRef.current = params || {};
  };

  const alernate = () => {
    setCurrent({
      ...idxRef.current,
    });
  };

  const createInterval = (params) => {
    removeInterval();
    const { enable = false, time, dataSource = [] } = params || {};

    if (!enable) return;
    timerRef.current = setInterval(() => {
      const wip = getWip();
      let _wip = wip;
      Object.keys(wip).forEach((key) => {
        const data = (dataSource[key] || []).filter((item) => item.show);
        const max = data.length - 1;
        // 判断是否超过数组长度
        let value = wip[key] >= max ? 0 : wip[key] + 1;
        _wip[key] = value;
      });
      setWip({
        ..._wip,
      });

      alernate();
    }, time);
  };

  const removeInterval = (callback) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);

      timerRef.current = null
      callback && callback();
    }
  };

  return {
    init,
    autoCurrent: current,
    setAutoCurrent: setCurrent,
    getWip,
    setWip,
    alernate,
    createInterval,
    removeInterval,
    autoIdx: timerRef.current,
  };
}
