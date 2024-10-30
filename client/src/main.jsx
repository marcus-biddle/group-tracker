import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import { Activity } from './sections/Activity/Activity.jsx';
import { Home } from './sections/Home/Home.jsx';
import { AuthForm } from './sections/Auth/AuthForm.jsx';
import LoginPage from './sections/Auth/LoginPage.jsx';
import ActivityPage from './sections/Activity/ActivityPage.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "activities/:activityId/:activityname",
        element: <Activity />
      },
      {
        path: "activities/v2/:activityId/:activityname",
        element: <ActivityPage />
      },
      {
        path: "/auth",
        element: <AuthForm />
      },
      {
        path: "/login",
        element: <LoginPage/>
      },
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
