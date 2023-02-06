import React, {
  useState,
  useRef,
  useLayoutEffect,
  useMemo,
  useCallback,
} from 'react';
import * as echarts from 'echarts';
import { useUpdateLayoutEffect } from 'ahooks';

import defaultOption, {
  defaultColor,
  defaultAutoOption,
} from './defaultOption';
import {
  formatterLegend,
  formatterTooltip,
  formatterData,
  flatAndUnique,
  getParams,
  isNum,
} from '../utils';
import { useAutoParams } from '../hooks';
import LabelBlock from './LabelBlock';
import LegendBlock from './LegendBlock';
import CenterBlock from './CenterBlock';

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
  } = props;
  const domRef = useRef();
  const chartRef = useRef();
  const [init, setInit] = useState(false);
  const autoParams = useAutoParams();
  const [dataSource, setDataSource] = useState([]);
  const [labelPos, setLabelPos] = useState({});
  const [radiusSource, setRadiusSource] = useState([]);
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
    return {
      color,
      legend: formatterLegend({
        option: legendOption,
        data,
        seriesIndexArr: Object.keys(radiusSource),
      }),
      tooltip: formatterTooltip(tooltipOption),
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
          labelLine: {
            length2: 50,
          },
        };

        if (radiusItem) {
          series.radius = radiusItem;
        }

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

  const createInterval = () => {
    autoParams.createInterval({
      ..._autoPlayOption,
      dataSource,
    });
  };

  const handleHightlight = ({ seriesIndex, dataIndex, isShowTip = false }) => {
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
        autoInfo[0] = -1;
        labelObj[0] = [];
      } else if (typeof radius === 'object') {
        Object.keys(radius).forEach((key) => {
          const dataItem = data[key];
          radiusArr[key] = radius[key];
          dataArr[key] = dataItem;
          // dataArr[key] = Array.isArray(dataItem) ? dataItem : data;
          autoInfo[key] = -1;
          labelObj[key] = [];
        });
      }
    }
    setDataSource(formatterData(dataArr));
    setRadiusSource(radiusArr);

    autoParams.init(autoInfo);
    setLabelPos(labelObj);

    setInit(true);
  };

  useLayoutEffect(() => {
    const myChart = echarts.init(domRef.current);
    chartRef.current = myChart;
    handleInit();

    return () => {
      autoParams.removeInterval();
    };
  }, []);

  useUpdateLayoutEffect(() => {
    if (init) {
      chartRef.current.on('mouseover', (value) => {
        const { seriesIndex, dataIndex } = value;

        autoParams.removeInterval(() => {
          const current = autoParams.getWip();
          autoParams.setWip({
            ...current,
            [seriesIndex]: dataIndex,
          });
        });

        autoParams.setAutoCurrent((obj) => {
          return {
            ...obj,
            [seriesIndex]: dataIndex,
          };
        });
        // handleHightlight({ seriesIndex, dataIndex, isShowTip: true });
      });
      chartRef.current.on('mouseout', (value) => {
        const { seriesIndex } = value;
        autoParams.setAutoCurrent((obj) => {
          return {
            ...obj,
            [seriesIndex]: -1,
          };
        });

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
    chartRef.current.setOption(ops);
    createInterval();
  }, [dataSource]);

  useUpdateLayoutEffect(() => {
    if (!_autoPlayOption.enable || !autoParams.autoIdx) return;
    handleHightlight({
      seriesIndex: autoParams.autoIdx
        ? _autoPlayOption.seriesIndex
        : Object.keys(autoParams.autoCurrent),
      dataIndex: autoParams.autoCurrent,
      isShowTip: true,
    });
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
    let seriesIndex = 0;
    const idxObj = autoParams.autoCurrent;
    Object.keys(idxObj).forEach((key) => {
      if (idxObj[key] !== -1) {
        seriesIndex = key;
      }
    });

    const params = getParams({
      data: dataSource[seriesIndex],
      index: idxObj[seriesIndex],
      color,
    });
    const { content } = centerBlockOption;
    if (!content) return;
    if (typeof content === 'function') {
      return content(params);
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
      {getOps(dataSource).legend?.show === false && (
        <LegendBlock
          option={getOps(dataSource).legend}
          data={flatAndUnique(dataSource)}
          handleLegendHover={handleLegendHover}
          handleLegendLeave={handleLegendLeave}
          handleLegendClick={handleLegendClick}
        />
      )}
      {Object.keys(labelPos).map((key) => {
        const { series } = getOps(dataSource);
        return (
          <>
            <LabelBlock
              option={series[key]}
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
    </div>
  );
};

export default Pie;
