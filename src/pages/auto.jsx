import * as React from 'react';
import { AutoDemo1, AutoDemo2, AutoDemo3, AutoDemo11 } from '../demo';

export default function App() {
  return (
    <React.Fragment>
      <h2>自动轮播</h2>
      <p>鼠标移上去会暂停，移开会继续</p>
      {/* <AutoDemo1 /> */}
      <AutoDemo11 />
      {/* <AutoDemo2 /> */}
      {/* <AutoDemo3 /> */}
    </React.Fragment>
  );
}
