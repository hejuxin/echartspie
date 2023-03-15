import React, {
  useState,
  useRef,
  useLayoutEffect,
  useMemo,
  useCallback,
} from 'react';
import * as echarts from 'echarts';
import { useMount, useUpdateLayoutEffect, useUpdateEffect, useUnmount } from 'ahooks';
import { INITNUM } from './enum';
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
  formatAutoOpsData,
} from './utils';
import { isNum, isEmptyArray, getNumVal } from './utils/common';
import { getAutoSeriesIndex } from './utils/auto';
import { useAutoParams } from './hooks';
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
    highLightCallback = () => { },
    nodeClick = false,
    highLightOption = {},
  } = props;
  const domRef = useRef();
  const chartRef = useRef();
  const chartOption = useRef({});
  const autoParams = useAutoParams();
  const [dataSource, setDataSource] = useState([]);
  const [labelPos, setLabelPos] = useState({});

  // const [highInfo, setHighInfo] = useState({});
  const [highInfo, setHighInfo] = useState({
    data: {},
    showTip: false
  });

  const radiusSource = useMemo(() => {
    if (
      typeof radius === 'string' ||
      typeof radius === 'number' ||
      (Array.isArray(radius) && radius.length)
    ) {
      return [radius];
    }

    if (typeof radius === 'object') {
      return Object.keys(radius).map(key => {
        return radius[key]
      });
    }
  }, [radius]);

  const _autoPlayOption = useMemo(() => {
    let autoSeriesArr = getAutoSeriesIndex({
      seriesIndex: autoPlayOption.seriesIndex,
      keyArr: Object.keys(radiusSource)
    });
    return {
      ...defaultAutoOption,
      ...autoPlayOption,
      enable: autoPlay || false,
      seriesIndexArr: autoSeriesArr
    };
  }, [autoPlay, autoPlayOption]);

  const _highOption = useMemo(() => {
    const ops = {
      highCallback: highLightOption.callback || highLightCallback,
      ...highLightOption
    };

    const defaultSeriesIndex = highLightOption.default?.seriesIndex || [];
    const defaultDataIndex = highLightOption.default?.dataIndex || [];

    if (isEmptyArray(defaultSeriesIndex) && !isEmptyArray(defaultDataIndex)) {
      ops.defaultSeriesIndex = [0];
      ops.defaultDataIndex = defaultDataIndex;
    } else if (!isEmptyArray(defaultSeriesIndex) && !isEmptyArray(defaultDataIndex)) {
      const sArr = [], dArr = [];
      const radiusKeyArr = Object.keys(radiusSource).map(key => Number(key));
      defaultSeriesIndex.forEach(sIdx => {
        const idx = radiusKeyArr.findIndex(key => key === sIdx);
        if (idx > -1) {
          sArr.push(sIdx);
          const data = getNumVal(defaultDataIndex[idx], defaultDataIndex[defaultDataIndex.length - 1]);
          dArr.push(data);
        }
      })
      ops.defaultSeriesIndex = sArr;
      ops.defaultDataIndex = dArr;
    }

    return ops;
  }, [highLightOption, highLightCallback])

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
  };

  const handleInit = () => {
    // let _autoSeriesArr = formatAutoOpsData(autoPlayOption.seriesIndex);
    const dataArr = [];
    const labelObj = {};
    if (radiusSource.length > 1) {
      Object.keys(radius).forEach((key) => {
        dataArr[key] = data[key];
        labelObj[key] = [];
      });
    } else {
      dataArr[0] = data;
      labelObj[0] = [];
    }
    setLabelPos(labelObj);


    let newData = formatterData(dataArr);

    setDataSource(newData);

    const autoInfo = {};

    const defaultSeriesIndex = _highOption.defaultSeriesIndex || [];
    const defaultDataIndex = _highOption.defaultDataIndex

    _autoPlayOption.seriesIndexArr.forEach(key => {
      if (isEmptyArray(defaultSeriesIndex)) {
        autoInfo[key] = INITNUM;
      } else {
        const keyIndex = defaultSeriesIndex.findIndex(sIdx => key === sIdx);
        autoInfo[key] = defaultDataIndex[keyIndex];
      }
    })
    autoParams.init(autoInfo);


    // 默认高亮
    const high = {};
    defaultSeriesIndex.forEach((sIdx, index) => {
      high[sIdx] = defaultDataIndex[index];
    })
    setHighInfo({
      ...highInfo,
      data: high
    });
  };

  const createInterval = useCallback(() => {
    autoParams.createInterval({
      ..._autoPlayOption,
      dataSource,
    });
  }, [dataSource]);

  // const handleLegendChange = useCallback((value) => {
  //   console.log(value, 'ffggg', dataSource)
  //   const { selected = {} } = value;
  //   const newData = Object.values(dataSource).map((data) => {
  //     return data.map((val) => {
  //       return {
  //         ...val,
  //         show: selected?.[val.name],
  //       };
  //     });
  //   });

  //   setDataSource(newData);
  // }, [dataSource])

  useMount(() => {
    const myChart = echarts.init(domRef.current);
    chartRef.current = myChart;
    console.log('init')
    handleInit();

    chartRef.current.on('mouseover', (value) => {
      const { seriesIndex, dataIndex, data } = value;

      // 若有自动，移除自动
      // 记录当前位置，下次轮播从这个点开始
      if (_autoPlayOption.enable) {
        autoParams.removeInterval();
        // 若该层存在自动轮播，则记录当前高亮位置，作为下次轮播起始点
        if (_autoPlayOption.seriesIndexArr.includes(Number(seriesIndex))) {
          const current = autoParams.getWip();
          autoParams.setWip({
            ...current,
            [seriesIndex]: dataIndex,
          });
        }
      }

      setHighInfo((info) => {
        return {
          ...info,
          data: {
            ...info?.data,
            [seriesIndex]: dataIndex
          }
        }
      })
    });
    chartRef.current.on('mouseout', (value) => {
      const { seriesIndex } = value;
      console.log('event: mouseout', seriesIndex)
      setHighInfo((info) => {
        return {
          ...info,
          data: {
            ...info?.data,
            [seriesIndex]: INITNUM
          }
        }
      })

      if (_autoPlayOption.enable) {
        // todo 直接createInterval 会拿不到最新的dataSource
        // createInterval();
        setDataSource((nowData) => [...nowData])
      }
    });

    chartRef.current.on('legendselectchanged', (value) => {
      const { selected = {} } = value;

      setDataSource((nowData) => {
        const newData = Object.values(nowData).map((data) => {
          return data.map((val) => {
            return {
              ...val,
              show: selected?.[val.name],
            };
          });
        });

        return newData
      })
    });

    window.addEventListener('resize', () => {
      myChart.resize()
    })
  });

  useUnmount(() => {
    autoParams.removeInterval();
    chartRef.current.dispose(domRef.current);
  })

  useUpdateLayoutEffect(() => {
    const dataArr = [];

    if (radiusSource.length > 1) {
      Object.keys(radiusSource).forEach((key) => {
        const dataItem = data[key];
        dataArr[key] = dataItem;
      });
    } else {
      dataArr[0] = data;
    }

    let newData = formatterData(dataArr);
    setDataSource(newData);
  }, [data])

  useUpdateLayoutEffect(() => {
    const ops = getOps(dataSource);
    chartOption.current = ops;
    chartRef.current.setOption(ops);
    createInterval();
  }, [dataSource]);

  useUpdateLayoutEffect(() => {
    console.log(autoParams.autoCurrent, 'autoParams.autoCurrent')
    if (!_autoPlayOption.enable || !autoParams.autoIdx) return;
    let dataIndex = autoParams.autoCurrent;
    // let seriesIndex = autoParams.autoIdx
    //   ? _autoPlayOption.seriesIndex
    //   : Object.keys(autoParams.autoCurrent);


    // if (!isPie) {
    //   // todo
    //   let seriesIndex = 0;
    //   const autoVal = dataIndex[seriesIndex];
    //   if (autoVal === -1) return;
    //   const id = dataSource[seriesIndex]?.[autoVal]?.id;
    //   dataIndex = id + 1;

    //   let isShowTip = false;

    //   // setHighInfo({
    //   // })
    // } else {
    // dataIndex = autoParams.autoCurrent;
    let isShowTip =
      typeof _autoPlayOption.showTip === 'boolean'
        ? _autoPlayOption.showTip
        : true;

    setHighInfo({
      // ...dataIndex
      data: {
        ...dataIndex
      },
      showTip: isShowTip
    })
    // }

    // const _params = {
    //   seriesIndex,
    //   dataIndex,
    //   isShowTip,
    // };

    // setHighInfo({
    //   ...dataIndex
    // })

    // handleHightlight(_params);
  }, [autoParams.autoCurrent]);

  useUpdateLayoutEffect(() => {
    const highData = highInfo.data;
    const seriesArr = Object.keys(highData);
    if (!seriesArr.length) return;

    const _params = {
      seriesIndex: seriesArr,
      dataIndex: highData,
      isShowTip: highInfo.showTip,
      // needHighlight: false
    };

    handleHightlight(_params);
  }, [highInfo]);

  const handleHightlight = ({ seriesIndex, dataIndex, isShowTip = false, needHighlight = true }) => {
    // 鼠标移开
    // todo
    if (dataIndex === INITNUM) {
      if (_autoPlayOption.enable) {
        chartRef.current.dispatchAction({
          type: 'downplay',
        });
        chartRef.current.dispatchAction({
          type: 'hideTip',
        });
      }

      return;
    }

    const seriesIndexArr = isNum(seriesIndex) ? [seriesIndex] : seriesIndex;
    const dataInfo = {
      batch: seriesIndexArr.map((item) => {
        return {
          seriesIndex: item,
          dataIndex: isNum(dataIndex) ? dataIndex : dataIndex[item],
        };
      }),
    };

    // if (_autoPlayOption.enable) {
    chartRef.current.dispatchAction({
      type: 'downplay',
    });

    setTimeout(() => {
      chartRef.current.dispatchAction({
        // type: 'select',
        type: 'highlight',
        ...dataInfo,
      });
    }, 0);
    // }

    if (isShowTip) {
      chartRef.current.dispatchAction({
        type: 'hideTip',
      });

      chartRef.current.dispatchAction({
        type: 'showTip',
        ...dataInfo,
      });
    }

    let paramsArr = [];

    seriesIndex.map(highingKey => {
      const highingVal = dataIndex[highingKey];
      const dataArr = dataSource[highingKey];

      const param = getParams2({
        data: dataArr,
        item: dataArr[highingVal]
      });

      paramsArr.push(param);
    })

    highLightCallback(paramsArr);
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
      <CenterBlock
        option={centerBlockOption}
        dataSource={dataSource}
        highData={highInfo.data}
      />
    </div>
  );
};

export default Pie;
