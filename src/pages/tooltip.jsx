import * as React from 'react';
import { TooltipDemo1, TooltipDemo2 } from '../demo';

export default function Tooltip() {
  return (
    <React.Fragment>
      <div>
        <h2>tooltip自定义</h2>
        <TooltipDemo1 />
        <TooltipDemo2 />
      </div>
    </React.Fragment>
  );
}
