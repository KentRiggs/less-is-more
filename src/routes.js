import { createBrowserRouter } from "react-router-dom";
import HomePage from "./components/HomePage";
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
    ],
  },
]);

export default routes;
