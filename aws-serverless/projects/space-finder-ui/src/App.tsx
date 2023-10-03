import { useState } from 'react';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Navbar from './components/navbar';
import Login from './components/login';
import { AuthService } from './services/auth-service';

const authService = new AuthService();

export default function App() {
    const [username, setUsername] = useState<string | undefined>();
    const router = createBrowserRouter([
        {
            element: (
                <>
                    <Navbar username={username} />
                    <div className="contentWrapper">
                        <Outlet />
                    </div>
                </>
            ),
            children: [
                { path: '/', element: <>Home Page</> },
                { path: '/login', element: <Login authService={authService} setUsernameCb={setUsername} /> },
                { path: '/profile', element: <>Profile Page</> },
                { path: '/createSpace', element: <>Create Space Page</> },
                { path: '/spaces', element: <>List Space Page</> },
            ],
        },
    ]);

    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}
