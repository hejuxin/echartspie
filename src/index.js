import * as React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import router from './router';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

const getRoute = (router) => {
  return router.map((item) => {
    return (
      <Route key={item.path} path={item.path} element={item.element}>
        {item.children && getRoute(item.children)}
      </Route>
    );
  });
};

root.render(
  // <StrictMode>
  <BrowserRouter>
    <Routes>{getRoute(router)}</Routes>
  </BrowserRouter>
  // </StrictMode>
);
