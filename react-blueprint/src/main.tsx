import './common/styles/index.scss';
// import './common/styles/colors.scss';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { HomeComponent } from './pages/home/HomeComponent.tsx';
import { LoginComponent } from './pages/login/LoginComponent.tsx';
import { NotFoundComponent } from './common/components/NotFoundComponent.tsx';
import { ToastContainer } from 'react-toastify';

const router = createBrowserRouter([
    {
        path: '/',
        element: <LoginComponent />,
        errorElement: <NotFoundComponent />,
    },
    {
        path: 'home',
        element: <HomeComponent />,
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
        <ToastContainer />
    </React.StrictMode>,
);
