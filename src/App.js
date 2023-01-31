import * as React from 'react';
import './style.css';
import { Outlet, Link, use } from 'react-router-dom';
import router from './router';

export default function App() {
  return (
    <React.Fragment>
      <ul>
        {router[0].children.map((item) => {
          const key = item.path.substring(1);
          return (
            <li key={key}>
              <Link to={item.path}>{key}</Link>
            </li>
          );
        })}
      </ul>
      <Outlet />
    </React.Fragment>
  );
}
