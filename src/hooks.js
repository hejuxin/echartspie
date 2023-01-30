import React, { useState, useRef } from 'react';

export function useAutoParams() {
  const [autoIdx, setAutoIdx] = useState({});
  const idxRef = useRef({});

  const init = (params) => {
    if (typeof params !== 'object') return;
    const data = params || {};
    idxRef.current = data;
    setAutoIdx(data);
  };

  const getCurrent = (key) => {
    if (key) {
      return idxRef.current[key];
    }

    return idxRef.current;
  };

  const setCurrent = (params) => {
    if (typeof params !== 'object') return;

    idxRef.current = params || {};
  };

  const alernate = () => {
    setAutoIdx({
      ...idxRef.current,
    });
  };

  return {
    init,
    autoIdx,
    setAutoIdx,
    getCurrent,
    setCurrent,
    alernate,
  };
}
