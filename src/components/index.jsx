import React, {
  useState,
  useRef,
  useLayoutEffect,
  useMemo,
  useCallback,
} from 'react';
import * as echarts from 'echarts';
import { useMount, useUpdateLayoutEffect, useUpdateEffect } from 'ahooks';

import defaultOption, {
  defaultColor,
  defaultAutoOption,
} from './defaultOption';
import {
  formatterLegend,
  formatterTooltip,
  formatterData,
  formatterSunData,
  flatAndUnique,
  getParams,
  getParams2,
  getWholeParams,
  isNum,
  formatAutoOpsData,
} from '../utils';
import { useAutoParams } from '../hooks';
import LabelBlock from './LabelBlock';
import LegendBlock from './LegendBlock';
import CenterBlock from './CenterBlock';
import TooltipBlock from './TooltipBlock';

const Pie = (props) => {
  const {
    legendOption = {},
    tooltipOption = {},
    seriesOption = {},
    data = {},
    color = defaultColor,
    radius = '50%',
    autoPlay,
    autoPlayOption = {},
    centerBlockOption = {},
    wrapStyle = {},
    type = 'pie',
    highLightCallback = () => {},
    nodeClick = false,
  } = props;
  const domRef = useRef();
  const chartRef = useRef();
  const chartOption = useRef({});
  const [init, setInit] = useState(false);
  const autoParams = useAutoParams();
  const [dataSource, setDataSource] = useState([]);
  const [labelPos, setLabelPos] = useState({});
  const [radiusSource, setRadiusSource] = useState([]);

  const isPie = useMemo(() => {
    return type !== 'sunburst';
  }, [type]);

  const getCustomLegendData = useCallback((data) => {
    const dataArr = data.map((item) => {
      if (Array.isArray(item)) {
        return getCustomLegendData(item);
      }
      return item.show ? item : null;
    });
    if (dataArr.filter(Boolean).length === 0)
      return new Array(dataArr.length).fill(-1);
    return dataArr;
  }, []);
  const getOps = (data = []) => {
    let isLegendCustom = false;
    if (legendOption.content) {
      const res = legendOption.content({});
      if (typeof res !== 'string') {
        isLegendCustom = true;
      }
    }

    const autoInfo = {
      seriesIndex: Object.keys(autoParams.autoCurrent),
    };
    if (isPie) {
      return {
        color,
        legend: formatterLegend({
          option: legendOption,
          data,
          seriesIndexArr: Object.keys(radiusSource),
        }),
        // todo 打平直接放到data里去
        tooltip: formatterTooltip(tooltipOption, autoInfo),
        // series: Object.keys(radius || {}).map((key, index) => {
        series: Object.keys(radiusSource).map((key) => {
          let newSeriesOps = [];
          if (!Array.isArray(seriesOption)) {
            newSeriesOps[key] = seriesOption;
          } else {
            newSeriesOps = seriesOption;
          }
          const seriesItem = newSeriesOps[key] || {};
          const dataItem = data[key] || [];
          const radiusItem = (radiusSource || {})[key];

          const series = {
            ...defaultOption.series[0],
            ...seriesItem,
            type,
            data: isLegendCustom ? getCustomLegendData(dataItem) : dataItem,
            labelLayout: (params) => {
              let dataIndex = params.dataIndex;
              if (!isLegendCustom) {
                const showData = dataItem.filter((item) => item.show);
                dataIndex = showData[params.dataIndex]?.dataIndex;
              }

              setTimeout(() => {
                setLabelPos((labelPosObj) => {
                  let newArr = [...(labelPosObj[key] || [])];
                  newArr[dataIndex] = params.labelLinePoints;
                  const newObj = {
                    ...labelPosObj,
                    [key]: newArr,
                  };

                  return newObj;
                });
              }, 0);
            },
          };

          // 对tooltip进行格式化
          // series.tooltip = formatterTooltip(series.tooltip, autoInfo);

          // 打平后放到这里
          series.tooltip = formatterTooltip(
            {
              ...tooltipOption,
              ...series.tooltip,
            },
            autoInfo
          );

          // 对label进行格式化
          const { label = {} } = series;
          if (label.content) {
            label.formatter = () => {
              return '';
            };
          }

          const labelLineExtendLength = label.lineExtendLength;
          if (label.isLineExtend && isNum(labelLineExtendLength)) {
            series.labelLine = {
              ...series.labelLine,
              length2: labelLineExtendLength,
            };
          }

          if (radiusItem) {
            series.radius = radiusItem;
          }

          return series;
        }),
      };
    }

    return {
      color,
      legend: {
        show: false,
      },
      tooltip: formatterTooltip(tooltipOption),
      series: Object.keys(radiusSource).map((key) => {
        let newSeriesOps = [];
        if (!Array.isArray(seriesOption)) {
          newSeriesOps[key] = seriesOption;
        } else {
          newSeriesOps = seriesOption;
        }
        const seriesItem = newSeriesOps[key] || {};
        const dataItem = data[key] || [];
        const radiusItem = (radiusSource || {})[key];

        const series = {
          ...defaultOption.series[0],
          ...seriesItem,
          type,
          data: dataItem,
          nodeClick,
        };

        if (radiusItem) {
          series.radius = radiusItem;
        }

        // todo sunburst没有tooltip配置项

        return series;
      }),
    };
  };

  const _autoPlayOption = useMemo(() => {
    return {
      ...defaultAutoOption,
      ...autoPlayOption,
      enable: autoPlay || false,
    };
  }, [autoPlay, autoPlayOption]);

  const autoStartInfo = useMemo(() => {
    const autoStartOps = autoPlayOption.startOps || {};
    if (autoStartOps.dataIndex) {
      return {
        seriesIndex: formatAutoOpsData(autoStartOps?.seriesIndex),
        dataIndex: formatAutoOpsData(autoStartOps?.dataIndex),
      };
    }

    return {};
  }, [autoPlayOption]);

  const createInterval = () => {
    // console.log('createInterval', dataSource);
    autoParams.createInterval({
      ..._autoPlayOption,
      dataSource,
    });
  };
  const handleHightlight = ({ seriesIndex, dataIndex, isShowTip = false }) => {
    const flatData = flatAndUnique(dataSource);
    let wholeTree;
    let item;
    let params;
    if (!isPie) {
      if (dataIndex > 0) {
        item = flatData[dataIndex - 1];
        wholeTree = getWholeParams({
          data: dataSource[0],
          item,
        });
        params = getParams2({
          data: dataSource[0],
          item,
        });
        params = {
          ...params,
          ...item,
        };
      }
    } else {
      item = flatData[dataIndex];
      params = getParams2({
        data: dataSource[0],
        item,
      });
    }

    highLightCallback(params, wholeTree);

    const seriesIndexArr = isNum(seriesIndex) ? [seriesIndex] : seriesIndex;
    const dataInfo = {
      batch: seriesIndexArr.map((item) => {
        return {
          seriesIndex: item,
          dataIndex: isNum(dataIndex) ? dataIndex : dataIndex[item],
        };
      }),
    };
    chartRef.current.dispatchAction({
      type: 'downplay',
    });
    chartRef.current.dispatchAction({
      type: 'hideTip',
    });

    setTimeout(() => {
      chartRef.current.dispatchAction({
        // type: 'select',
        type: 'highlight',
        ...dataInfo,
      });
    }, 0);

    if (isShowTip) {
      chartRef.current.dispatchAction({
        type: 'showTip',
        ...dataInfo,
      });
    }
  };

  const handleInit = () => {
    let _autoSeriesArr = formatAutoOpsData(autoPlayOption.seriesIndex);

    const radiusArr = [];
    const dataArr = [];
    const autoInfo = {};
    const labelObj = {};
    if (radius) {
      if (
        typeof radius === 'string' ||
        typeof radius === 'number' ||
        (Array.isArray(radius) && radius.length)
      ) {
        radiusArr[0] = radius;
        dataArr[0] = data;
        labelObj[0] = [];

        if (!_autoSeriesArr.length) {
          // dataIndex 存在才有意义
          if (autoStartInfo.dataIndex) {
            autoInfo[0] = isNum(autoStartInfo.dataIndex[0])
              ? autoStartInfo.dataIndex[0]
              : -1;
          } else {
            autoInfo[0] = -1;
          }
        }
        // autoInfo[0] = -1;
      } else if (typeof radius === 'object') {
        Object.keys(radius).forEach((key) => {
          const dataItem = data[key];
          radiusArr[key] = radius[key];
          dataArr[key] = dataItem;
          labelObj[key] = [];

          if (!_autoSeriesArr.length) {
            const { seriesIndex: sIdx = [], dataIndex: dIdx } = autoStartInfo;
            // 先判断轮播的series有没有start。
            // 1. 如果有，则取dataIndex中对应位置的data。
            //  - 若该位置没有，则代表两个Index长度不同。此时取dataIndex最后一项。最后一项也没有则为-1
            // 2. 若没有，则代表没有start。直接-1
            if (sIdx && dIdx) {
              const autoIdx = sIdx.indexOf(key);
              if (autoIdx > -1) {
                autoInfo[key] = isNum(dIdx[autoIdx])
                  ? dIdx[autoIdx]
                  : isNum(dIdx[dIdx.length - 1])
                  ? dIdx[dIdx.length - 1]
                  : -1;
              } else {
                autoInfo[key] = -1;
              }
            } else if (dIdx) {
              // 若没有series。直接取取dataIndex中对应位置的data。
              autoInfo[key] = isNum(dIdx[key]) ? dIdx[key] : -1;
            } else {
              autoInfo[key] = -1;
            }

            // autoInfo[key] = 0;
          }
          // autoInfo[key] = -1;
        });
      }
    }

    if (_autoSeriesArr.length) {
      _autoSeriesArr.forEach((key) => {
        const { seriesIndex: sIdx = [], dataIndex: dIdx } = autoStartInfo;
        // 先判断轮播的series有没有start。
        // 1. 如果有，则取dataIndex中对应位置的data。
        //  - 若该位置没有，则代表两个Index长度不同。此时取dataIndex最后一项。最后一项也没有则为-1
        // 2. 若没有，则代表没有start。直接-1
        if (sIdx && dIdx) {
          const autoIdx = sIdx.indexOf(key);
          if (autoIdx > -1) {
            autoInfo[key] = isNum(dIdx[autoIdx])
              ? dIdx[autoIdx]
              : isNum(dIdx[dIdx.length - 1])
              ? dIdx[dIdx.length - 1]
              : -1;
          } else {
            autoInfo[key] = -1;
          }
        } else if (dIdx) {
          // 若没有series。直接取取dataIndex中对应位置的data。
          autoInfo[key] = isNum(dIdx[key]) ? dIdx[key] : -1;
        } else {
          autoInfo[key] = -1;
        }
      });
    }
    setRadiusSource(radiusArr);
    setLabelPos(labelObj);

    autoParams.init(autoInfo);

    let newData = [];
    if (isPie) {
      newData = formatterData(dataArr);
    } else {
      newData = [
        formatterSunData(data, {
          emphasis: {
            focus: 'ancestor',
          },
        }),
      ];
    }

    setDataSource(newData);

    setInit(true);
  };

  useMount(() => {
    const myChart = echarts.init(domRef.current);
    chartRef.current = myChart;
    handleInit();

    // window.addEventListener('resize', () => {
    //   if (myChart && myChart.dispose) {
    //     myChart.dispose(domRef.current);
    //     const newChart = echarts.init(domRef.current);
    //     chartRef.current = newChart;
    //   }
    //   handleInit();
    // });

    return () => {
      autoParams.removeInterval();
      myChart.dispose(domRef.current);
    };
  }, []);

  useUpdateLayoutEffect(() => {
    if (init) {
      let _autoSeriesArr = formatAutoOpsData(autoPlayOption.seriesIndex);
      const { seriesIndex: sIdx, dataIndex: dIdx } = autoStartInfo;
      if (dIdx) {
        handleHightlight({
          seriesIndex: sIdx || _autoSeriesArr || [],
          dataIndex: dIdx || [],
        });
      }

      chartRef.current.on('mouseover', (value) => {
        const { seriesIndex, dataIndex, data } = value;

        if (!isPie) {
          let wholeTree = getWholeParams({
            data: dataSource[0],
            item: data,
          });

          const index = (dataSource[0] || []).findIndex(
            (item) => item.name === wholeTree.name
          );

          autoParams.removeInterval(() => {
            const current = autoParams.getWip();
            autoParams.setWip({
              ...current,
              [seriesIndex]: index,
            });
          });

          autoParams.setAutoCurrent((obj) => {
            return {
              ...obj,
              [seriesIndex]: index,
            };
          });

          if (!_autoPlayOption.enable) {
            highLightCallback(data, wholeTree);
          }
          return;
        }

        autoParams.removeInterval(() => {
          const current = autoParams.getWip();
          autoParams.setWip({
            ...current,
            [seriesIndex]: dataIndex,
          });
        });

        // todo
        // if (_autoPlayOption.enable) {
        //   autoParams.setAutoCurrent((obj) => {
        //     return {
        //       ...obj,
        //       [seriesIndex]: dataIndex,
        //     };
        //   });
        // }
        autoParams.setAutoCurrent((obj) => {
          return {
            ...obj,
            [seriesIndex]: dataIndex,
          };
        });

        if (!_autoPlayOption.enable) {
          highLightCallback(data);
        }
        // handleHightlight({ seriesIndex, dataIndex, isShowTip: true });
      });
      chartRef.current.on('mouseout', (value) => {
        const { seriesIndex } = value;
        autoParams.setAutoCurrent((obj) => {
          if (isPie) {
            return {
              ...obj,
              [seriesIndex]: -1,
            };
          }

          return {
            ...obj,
          };
        });

        // todo
        // if (_autoPlayOption.enable) {
        //   createInterval();
        // }
        createInterval();
      });

      chartRef.current.on('legendselectchanged', (value) => {
        const { selected = {} } = value;
        const newData = Object.values(dataSource).map((data) => {
          return data.map((val) => {
            return {
              ...val,
              show: selected?.[val.name],
            };
          });
        });
        setDataSource(newData);
      });
    }
  }, [init]);

  useUpdateLayoutEffect(() => {
    const ops = getOps(dataSource);
    chartOption.current = ops;
    chartRef.current.setOption(ops);
    createInterval();
  }, [dataSource]);

  useUpdateLayoutEffect(() => {
    if (!_autoPlayOption.enable || !autoParams.autoIdx) return;
    let dataIndex = autoParams.autoCurrent;
    let seriesIndex = autoParams.autoIdx
      ? _autoPlayOption.seriesIndex
      : Object.keys(autoParams.autoCurrent);

    let isShowTip =
      typeof _autoPlayOption.showTip === 'boolean'
        ? _autoPlayOption.showTip
        : true;
    if (!isPie) {
      seriesIndex = 0;
      const autoVal = dataIndex[seriesIndex];
      if (autoVal === -1) return;
      const id = dataSource[seriesIndex]?.[autoVal]?.id;
      dataIndex = id + 1;

      isShowTip = false;
    } else {
      dataIndex = autoParams.autoCurrent;
    }

    const _params = {
      seriesIndex,
      dataIndex,
      isShowTip,
    };
    handleHightlight(_params);
  }, [autoParams.autoCurrent]);

  const handleLegendHover = (name) => {
    autoParams.removeInterval();

    const legendObj = {};
    flatAndUnique(dataSource).forEach((item) => {
      const { name, seriesIndex, dataIndex } = item;
      if (!legendObj[name]) {
        legendObj[name] = {};
      }

      legendObj[name][seriesIndex] = dataIndex;
    });
    const legendItem = legendObj[name];
    handleHightlight({
      seriesIndex: Object.keys(legendItem),
      dataIndex: legendItem,
    });
  };

  const handleLegendLeave = () => {
    chartRef.current.dispatchAction({
      type: 'downplay',
    });
    createInterval();
  };

  const handleLegendClick = (name) => {
    const newData = [...dataSource];
    flatAndUnique(dataSource).forEach((item) => {
      if (item.name === name) {
        const { seriesIndex, dataIndex } = item;
        const show = newData[seriesIndex][dataIndex].show;
        newData[seriesIndex][dataIndex].show = !show;
      }
    });

    setDataSource(newData);
  };
  const getCenterContent = () => {
    let seriesIndex = -1;
    // todo 是否有问题 为啥是autoParams 如果没开auto会咋样
    const idxObj = autoParams.autoCurrent;
    Object.keys(idxObj).forEach((key) => {
      if (typeof idxObj[key] === 'number' && idxObj[key] !== -1) {
        seriesIndex = key;
      }
    });

    if (seriesIndex === -1) return;

    const data = dataSource[seriesIndex];
    const flatData = flatAndUnique(data);

    let params = {};
    if (idxObj[seriesIndex] !== -1) {
      let data = flatData;
      let index = idxObj[seriesIndex];

      if (!isPie) {
        data = [''].concat(flatData);

        const autoVal = idxObj[seriesIndex];
        const id = dataSource[seriesIndex]?.[autoVal]?.id;
        index = id + 1;
      }
      params = getParams({
        data,
        index,
        color,
      });
    }

    let wholeTree;

    if (!isPie && flatData.length) {
      const item = flatData.find((flatItem) => params.name === flatItem.name);
      // wholeTree = getWholeParams({
      //   data,
      //   item,
      // });
    }

    const { content } = centerBlockOption;
    if (!content) return;
    if (typeof content === 'function') {
      return content(params, wholeTree);
    }
    return content;
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        ...wrapStyle,
      }}
    >
      <div ref={domRef} style={{ width: '100%', height: '100%' }}></div>
      {chartOption.current.legend?.show === false && (
        <LegendBlock
          option={chartOption.current.legend}
          data={flatAndUnique(dataSource)}
          handleLegendHover={handleLegendHover}
          handleLegendLeave={handleLegendLeave}
          handleLegendClick={handleLegendClick}
        />
      )}
      {Object.keys(labelPos).map((key) => {
        if (!Object.keys(chartOption.current).length) return;
        const { series } = chartOption.current;
        const seriesItem = series[key];
        const labelOption = {
          normal: {
            ...seriesItem.label,
            cap: seriesItem.labelLine?.cap,
          },
          active: {
            ...seriesItem.emphasis?.label,
            cap: seriesItem.emphasis?.labelLine?.cap,
          },
        };
        return (
          <>
            <LabelBlock
              option={labelOption}
              hightlightIndex={autoParams.autoCurrent[key]}
              data={dataSource[key]}
              labelPos={labelPos[key]}
              key={key}
              chartsWidth={chartRef.current.getWidth()}
            />
          </>
        );
      })}
      {!!Object.keys(centerBlockOption).length && (
        <CenterBlock {...centerBlockOption}>{getCenterContent()}</CenterBlock>
      )}
      {Object.keys(autoParams.autoCurrent).length > 1 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            // border: '1px solid',
            // width: 100,
            // height: 100,
          }}
        >
          <TooltipBlock
            autoCurrent={autoParams.autoCurrent}
            dataSource={dataSource}
            seriesOps={chartOption.current.series}
          />
        </div>
      )}
    </div>
  );
};

export default Pie;
