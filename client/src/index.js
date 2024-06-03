import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './App.scss';
import App from './App';
import store from './Store/store';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import UserInfo from "./Components/UserInfo/UserInfo";
import Favorite from "./Components/Favorite/Favorite";
import NotFoundPage from "./Components/404/NotFoundPage";
import AboutUs from "./Components/AboutUs/AboutUs";
import Contacts from "./Components/Contacts/Contacts";
import { NotificationProvider } from './Components/Notification/Notification';

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <NotFoundPage />,
    },
    {
        path: "/about",
        element: <AboutUs />,
    },
    {
        path: "/contacts",
        element: <Contacts/>,
    },
    {
        path: "/user-info",
        element: <UserInfo />,
    },
    {
        path: "/my-favorite",
        element: <Favorite />,
    },
]);

root.render(
  <React.StrictMode>
      <Provider store={store}>
          <NotificationProvider>
      <RouterProvider router={router} store={store} />
          </NotificationProvider>
      </Provider>
  </React.StrictMode>
);


