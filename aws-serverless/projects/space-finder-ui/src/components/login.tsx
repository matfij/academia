import { SyntheticEvent, useState } from 'react';
import { AuthService } from '../services/auth-service';
import { Navigate } from 'react-router-dom';

type LoginProps = {
    authService: AuthService;
    setUsernameCb: (username: string) => void;
};

export default function Login({ authService, setUsernameCb }: LoginProps) {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loginError, setLoginError] = useState<string>('');
    const [loginSuccess, setLoginSuccess] = useState<boolean>(false);

    const handleSubmit = async (event: SyntheticEvent) => {
        event.preventDefault();
        if (username && password) {
            const res = await authService.login(username, password);
            if (!res) {
                setLoginError('Invalid credentials');
                return;
            }
            setUsernameCb(username);
            setLoginSuccess(true);
        } else {
            setLoginError('Username and password required');
        }
    };

    const renderLoginResult = () => {
        if (loginError) {
            return <label className='error'>{loginError}</label>;
        }
    };

    return (
        <section role="main">
            {loginSuccess && <Navigate to="/profile" replace={true} />}
            <h2>Login to Space Finder</h2>
            <form onSubmit={(e) => handleSubmit(e)}>
                <label htmlFor="username">Username</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" />
                <label htmlFor="password">Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
                <button type="submit">Login</button>
            </form>
            {renderLoginResult()}
        </section>
    );
}
