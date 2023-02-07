import React from 'react';
import defaultOption, { defaultColor } from './components/defaultOption';
// import ReactDOM from 'react-dom/client';
import { createRoot } from 'react-dom/client';

export const formatterLegend = ({
  option = {},
  data = [],
  color = defaultColor,
  seriesIndexArr = [],
} = {}) => {
  const legend = {
    ...defaultOption.legend,
    ...option,
  };
  const { content = '' } = option;
  if (!content) return legend;

  if (typeof content === 'function') {
    const res = content({});

    if (typeof res === 'string') {
      if (seriesIndexArr.length) {
        let totalData = flatAndUnique(data);
        return {
          ...legend,
          formatter: (name) => {
            if (!content) return name;
            let params = {
              name,
            };
            seriesIndexArr.forEach((seriesIndex) => {
              const dataItem = data[seriesIndex] || [];
              const dataItemTotal = dataItem.reduce(
                (total, currentValue) => total + currentValue.value,
                0
              );

              dataItem.forEach((item, index) => {
                if (item.name === name) {
                  const colorIndex =
                    totalData.findIndex(
                      (totalDataItem) => totalDataItem.name === name
                    ) % color.length;

                  const { value } = item;
                  params = {
                    ...params,
                    value,
                    dataIndex: index,
                    color: color[colorIndex],
                    percent: (value / dataItemTotal) * 100 || 0,
                  };
                }
              });
            });

            if (typeof content === 'function') {
              const res = content(params);

              if (typeof res === 'string') {
                return res;
              }

              return '';
            }

            return content;
          },
        };
      } else {
      }
    } else {
      return {
        ...legend,
        show: false,
      };
    }
  }
};

export const flatAndUnique = (arr = []) => {
  const map = new Map();
  const loop = (array) => {
    array.forEach((item) => {
      if (Array.isArray(item)) {
        loop(item);
      } else if (!map.get(item)) {
        map.set(item);
      }
    });
  };

  loop(arr);
  return [...map.keys()];
};

const getTooltipPosition = (position, ...args) => {
  if (typeof position === 'string') {
    return position;
  } else if (typeof position === 'function') {
    return position(...args);
  } else if (Array.isArray(position)) {
    return position;
  } else if (typeof position === 'object') {
    const { mode, x, y } = position;
    console.log(mode, 'ddd');
    // return () => {
    //   if (!mode || mode !== 'fixed') return null;
    //   return [x || 0, y || 0];
    // };
    return null;
  }
};

export const formatterTooltip = (option = {}) => {
  const { content = '', position } = option;
  const dom = document.createElement('div');
  const root = createRoot(dom);

  if (!content) {
    const res = {
      ...defaultOption.tooltip,
      ...option,
    };

    if (position) {
      res.position = (point, params, dom, rect, size) => {
        return getTooltipPosition(position, [point, params, dom, rect, size]);
      };
    }
    console.log(res, 'res');
    return res;
  }

  const res = {
    ...defaultOption.tooltip,
    ...option,
    formatter: (params, ticket, callback) => {
      if (typeof content === 'function') {
        const res = content(params);
        if (typeof res === 'string') {
          return content(params);
        }
        root.render(res);
        return dom;
      }

      return content;
    },
  };
  if (position) {
    res.position = (point, params, dom, rect, size) => {
      return null;
    };
  }
  console.log(res, 'res');

  return res;
};

export const formatterData = (data = [], seriesIndex = 0) => {
  return data.map((item, index) => {
    if (Array.isArray(item)) {
      return formatterData(item, index);
    }
    return {
      ...item,
      show: true,
      dataIndex: index,
      seriesIndex,
    };
  });
};

export const getParams = ({
  data = [],
  index = 0,
  color = defaultColor,
  colorIndex,
} = {}) => {
  const item = data[index] || {};

  let totalBySeriersIndex = {};
  let dataBySeriersIndex = {};
  let dataIndex = index;

  data.forEach((dataItem) => {
    const { seriesIndex } = dataItem;
    if (!totalBySeriersIndex[seriesIndex]) {
      totalBySeriersIndex[seriesIndex] = 0;
    }
    if (!dataBySeriersIndex[seriesIndex]) {
      dataBySeriersIndex[seriesIndex] = [];
    }
    if (dataItem.name === item.name) {
      dataIndex = dataBySeriersIndex[seriesIndex].length;
    }
    dataBySeriersIndex[seriesIndex].push(dataItem);
    totalBySeriersIndex[seriesIndex] += dataItem.value;
  });

  let _colorIndex = isNum(colorIndex) ? colorIndex : index;
  if (_colorIndex > color.length) {
    _colorIndex = _colorIndex % color.length;
  }
  const { value } = item;
  return {
    name: item.name,
    value,
    dataIndex,
    color: color[_colorIndex],
    percent: (value / totalBySeriersIndex[item.seriesIndex]) * 100 || 0,
  };
};

export const isNum = (value) => typeof value === 'number';
