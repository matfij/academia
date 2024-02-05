import { useNavigate } from 'react-router-dom';
import { UsersClient } from '../../common/api/client';

export const LoginComponent = () => {
    const navigate = useNavigate();

    const onLogin = async () => {
        const res = await UsersClient.signin({ body: { login: 'test', password: 'test' } });
        console.log(res.accessToken, res.login, res.level);
        navigate('home');
    };

    return (
        <>
            <h2>Login Component</h2>
            <button onClick={() => onLogin()}>Login</button>
        </>
    );
};
