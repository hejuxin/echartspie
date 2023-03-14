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
  isNum,
  formatAutoOpsData,
} from './utils';
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
    return {}
  }, [])

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
    const autoInfo = {};
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

    autoParams.init(autoInfo);

    let newData = formatterData(dataArr);

    setDataSource(newData);
  };

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
        autoParams.removeInterval(() => {
          const current = autoParams.getWip();
          autoParams.setWip({
            ...current,
            [seriesIndex]: dataIndex,
          });
        });
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
        createInterval();
      }
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
    console.log('data update', radiusSource)
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
    // createInterval();
  }, [dataSource]);

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
    console.log(dataSource, 'dataSource')
    // 鼠标移开
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
