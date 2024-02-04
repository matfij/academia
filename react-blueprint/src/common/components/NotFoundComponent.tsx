import { useRouteError } from 'react-router-dom';

export const NotFoundComponent = () => {
    const error = useRouteError() as { statusText?: string; statusMessage: string };

    return (
        <>
            <h2>404 Not Found</h2>
            <p>{error.statusText || error.statusMessage}</p>
        </>
    );
};
