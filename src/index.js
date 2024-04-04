import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import routes from './routes';
import { RouterProvider } from "react-router-dom";


ReactDOM.render(
    <React.StrictMode>
      <RouterProvider router={routes} />
    </React.StrictMode>,
    document.getElementById('root')
  );

