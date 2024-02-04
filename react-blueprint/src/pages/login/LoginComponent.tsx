import { useNavigate } from 'react-router-dom';

export const LoginComponent = () => {
    const navigate = useNavigate();

    const onLogin = () => {
        navigate('home');
    };

    return (
        <>
            <h2>Login Component</h2>
            <button onClick={() => onLogin()}>Login</button>
        </>
    );
};
