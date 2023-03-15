import { isNum } from './common';
// seriesIndex为外界autoOption传入。数字/数组
export const getAutoSeriesIndex = ({ seriesIndex = 0, keyArr = [] }) => {
  const keys = keyArr.map(item => Number(item));
  if (isNum(seriesIndex)) {
    if (keys.includes(seriesIndex)) return [seriesIndex];
    return [keys[0]]
  }

  if (Array.isArray(seriesIndex)) {
    const seriesArr = seriesIndex.map((item) => {
      if (keys.includes(item)) return item;
    }).filter(item => isNum(item));

    if (!seriesArr.length) return [keys[0]];
    return seriesArr;
  }
};