import * as React from 'react';
import './style.css';
import {
  TooltipDemo1,
  TooltipDemo2,
  LabelDemo1,
  LabelDemo2,
  LegendDemo1,
  LegendDemo2,
  LegendDemo3,
  LegendDemo4,
  DoughnutDemo1,
  DoughnutDemo2,
  DoubleDemo1,
  DoubleDemo2,
  DoubleDemo3,
  AutoDemo1,
  AutoDemo2,
  AutoDemo3,
} from './demo';

export default function App() {
  return (
    <React.Fragment>
      <div>
        <h2>tooltip自定义</h2>
        <TooltipDemo1 />
        <TooltipDemo2 />
      </div>
      <div>
        <h2>label自定义</h2>
        <LabelDemo1 />
        <LabelDemo2 />
      </div>
      <div>
        <h2>图例自定义</h2>
        <LegendDemo1 />
        <LegendDemo2 />
        <LegendDemo3 />
        <LegendDemo4 />
      </div>
      <div>
        <h2>圆环内圈元素自定义</h2>
        <DoughnutDemo1 />
        <DoughnutDemo2 />
      </div>
      <div>
        <h2>自动轮播</h2>
        <p>鼠标移上去会暂停，移开会继续</p>
        <AutoDemo1 />
        <AutoDemo2 />
        <AutoDemo3 />
      </div>
      <div>
        <h2>双饼图</h2>
        <DoubleDemo1 />
        <DoubleDemo2 />
        <DoubleDemo3 />
      </div>
    </React.Fragment>
  );
}
