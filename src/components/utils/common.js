
export const isNum = (value) => typeof value === 'number';

export const getNumVal = (value, defalutValue = 0) => {
  if (typeof value === 'number') return value;
  return defalutValue;
}