import './common/styles/index.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { HomeComponent } from './pages/home/HomeComponent.tsx';
import { AuthComponent } from './pages/auth/AuthComponent.tsx';
import { NotFoundComponent } from './common/components/NotFoundComponent.tsx';
import { ToastContainer } from 'react-toastify';
import { ROUTES } from './common/routes.ts';

const router = createBrowserRouter([
    {
        path: ROUTES.ROOT,
        element: <AuthComponent />,
        errorElement: <NotFoundComponent />,
    },
    {
        path: ROUTES.HOME,
        element: <HomeComponent />,
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <div className="pageWrapper">
            <RouterProvider router={router} />
            <ToastContainer />
        </div>
    </React.StrictMode>,
);
