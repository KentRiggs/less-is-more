import { createBrowserRouter } from "react-router-dom";
import HomePage from "./components/HomePage";
import Register from "./components/Register";
import MemorialPage from "./components/MemorialPage";
import App from "./App";

const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: '/login',
        element: <Register />,
      },
      {
        path: '/signup',
        element: <Register />,
      },
      {
        path: '/memorial-page',
        element: <MemorialPage />,
      },
    ],
  },
]);

export default routes;
