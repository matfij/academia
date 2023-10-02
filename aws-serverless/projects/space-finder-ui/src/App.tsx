import { useState } from 'react';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Navbar from './components/navbar';

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
                { path: '/login', element: <>Login Page</> },
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
