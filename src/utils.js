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
        if (item.children) {
          loop(item.children);
        }
      }
    });
  };

  loop(arr);
  return [...map.keys()];
};

const getTooltipPosition = (position, ...args) => {
  if (!position) return null;
  if (typeof position === 'string') {
    return position;
  } else if (typeof position === 'function') {
    return position(...args);
  } else if (Array.isArray(position)) {
    return position;
  } else if (typeof position === 'object') {
    const { mode, x, y } = position;
    if (mode !== 'fixed') return null;
    return [x || 0, y || 0];
  }
};

export const formatterTooltip = (option = {}, autoInfo = {}) => {
  const { content = '', position } = option;
  const { seriesIndex = [] } = autoInfo;

  const dom = document.createElement('div');
  const root = createRoot(dom);

  const ops = {
    ...defaultOption.tooltip,
    ...option,
  };
  if (seriesIndex.length > 1) {
    ops.show = false;
  }
  if (!content) {
    return {
      ...ops,
      position: (point, params, dom, rect, size) => {
        return getTooltipPosition(position, [point, params, dom, rect, size]);
      },
    };
  }

  return {
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
    position: (point, params, dom, rect, size) => {
      return getTooltipPosition(position, [point, params, dom, rect, size]);
    },
  };
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

export const formatterSunData = (data = [], option = {}) => {
  const flatData = flatAndUnique(data);
  const loop = ({ arr = [], id = -1, ops }) => {
    if (!arr.length) return;
    return arr.map((item, index) => {
      const childrenArr = item.children || [];

      const itemId = flatData.findIndex(
        (flatItem) => item.name === flatItem.name
      );
      return {
        ...item,
        parentId: id,
        id: itemId,
        children: loop({ arr: childrenArr, id: itemId, ops: option }),
        show: true,
        ...ops,
        seriesIndex: 0,
      };
    });
  };

  return loop({ arr: data });
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

export const getParams2 = ({ data = [], item = {}, color = defaultColor }) => {
  let totalBySeriersIndex = {};

  data.forEach((dataItem, index) => {
    const seriesIndex = dataItem.seriesIndex;
    if (!totalBySeriersIndex[seriesIndex]) {
      totalBySeriersIndex[seriesIndex] = 0;
    }
    totalBySeriersIndex[seriesIndex] += dataItem.value;
  });

  const flatData = flatAndUnique(data);
  // const _colorIndex = flatData.findIndex(flatItem => flatItem.seriesIndex === item.seriesIndex && flatItem.dataIndex === item.dataIndex);
  // const colorIndexByName = flatData.findIndex(flatItem => flatItem.name === item.name);
  let colorIndex = flatData.findIndex(
    (flatItem) => flatItem.name === item.name
  );
  if (colorIndex > color.length) {
    colorIndex = colorIndex % color.length;
  }

  return {
    name: item.name,
    value: item.value,
    dataIndex: item.dataIndex,
    color: color[colorIndex],
    percent: (item.value / totalBySeriersIndex[item.seriesIndex]) * 100 || 0,
  };
};

export const getWholeParams = ({ data = [], item = {} }) => {
  const flatData = flatAndUnique(data);
  let parentItem = item;
  while (parentItem.parentId !== -1) {
    parentItem = flatData[parentItem.parentId];
  }

  return parentItem;
};
