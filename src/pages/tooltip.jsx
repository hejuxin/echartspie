import * as React from 'react';
import { TooltipDemo1, TooltipDemo2, TooltipDemo3 } from '../demo';

export default function Tooltip() {
  return (
    <React.Fragment>
      <div>
        <h2>tooltip自定义</h2>
        <TooltipDemo1 />
        {/* <TooltipDemo2 /> */}
        <TooltipDemo3 />
      </div>
    </React.Fragment>
  );
}
