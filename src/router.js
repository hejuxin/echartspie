import React from 'react';
import App from './App';
import { Auto, Double, Doughnut, Label, Tooltip } from './pages';

const router = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/auto',
        element: <Auto />,
      },
      {
        path: '/double',
        element: <Double />,
      },
      {
        path: '/doughnut',
        element: <Doughnut />,
      },
      {
        path: '/label',
        element: <Label />,
      },
      {
        path: '/tooltip',
        element: <Tooltip />,
      },
    ],
  },
];

export default router;