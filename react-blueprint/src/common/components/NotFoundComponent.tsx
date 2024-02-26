import { useNavigate, useRouteError } from 'react-router-dom';
import { ROUTES } from '../routes';

export const NotFoundComponent = () => {
    const error = useRouteError() as { statusText?: string; statusMessage: string };
    const navigate = useNavigate();

    return (
        <>
            <h2>404 Not Found</h2>
            <p>{error.statusText || error.statusMessage}</p>
            <button onClick={() => navigate(ROUTES.ROOT)}>Go back</button>
        </>
    );
};
