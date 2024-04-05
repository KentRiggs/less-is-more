import React from 'react';
import { createRoot } from 'react-dom/client'; 
import './index.css';
import routes from './routes';
import { RouterProvider } from "react-router-dom";

const container = document.getElementById('root');
const root = createRoot(container); 

root.render(
  <React.StrictMode>
    <RouterProvider router={routes} />
  </React.StrictMode>
);


