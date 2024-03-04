import './common/styles/index.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { HomeComponent } from './pages/home/HomeComponent.tsx';
import { NotFoundComponent } from './common/components/NotFoundComponent.tsx';
import { ToastContainer } from 'react-toastify';
import { ROUTES } from './common/routes.ts';
import { SigninComponent } from './pages/auth/SigninComponent.tsx';
import { SignupComponent } from './pages/auth/SignupComponent.tsx';

const router = createBrowserRouter([
    {
        path: ROUTES.ROOT,
        element: <SigninComponent />,
        errorElement: <NotFoundComponent />,
    },
    {
        path: ROUTES.SIGNUP,
        element: <SignupComponent />,
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
