const defaultColor = [
  '#77E4E4',
  '#E47676',
  '#E88E23',
  '#FAE55F',
  '#EAFF8F',
  '#68C57C',
  '#7CB305',
  '#BAE7FF',
  '#99BEFF',
  '#30A8F2',
  '#11BEEA',
];

const defaultData = [
  {
    name: '区域点位',
    value: 47,
  },
  {
    name: '饮用水源点位',
    value: 11,
  },
  {
    name: '风险监控点',
    value: 2,
  },
];

const defaultOption = {
  tooltip: {
    trigger: 'item',
  },
  legend: {},
  series: [
    {
      type: 'pie',
      radius: '50%',
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
  color: defaultColor,
};

const defaultAutoOption = {
  time: 3000,
  seriesIndex: 0,
};
export { defaultColor, defaultData, defaultAutoOption };
export default defaultOption;
