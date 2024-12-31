import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import { Home } from './sections/Home/Home.jsx';
import { AuthForm } from './sections/Auth/AuthForm.jsx';
import ActivityPage from './sections/Activity/ActivityPage.jsx';
import { LogPage } from './sections/Log/LogPage.jsx';
import { Import } from './sections/Import/Import.jsx';
import { ProfilePage } from './sections/Profile/ProfilePage.jsx';
import GoogleOAuth from './components/GoogleOAuth.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <ActivityPage />
      },
      {
        path: "/activity",
        element: <ActivityPage />
      },
      {
        path: "/log",
        element: <LogPage />
      },
      {
        path: "/log/import",
        element: <Import />
      },
      {
        path: "/login",
        element: <GoogleOAuth />
      },
      {
        path: "/profile",
        element: <ProfilePage />
      },
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
