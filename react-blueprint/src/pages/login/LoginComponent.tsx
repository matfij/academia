import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UsersClient } from '../../common/api/client';
import { UserSignupDto } from '../../common/api/generated';
import { StorageService } from '../../common/services/StorageService';
import { ToastService } from '../../common/services/ToastService';
import { ROUTES } from '../../common/routes';

export const LoginComponent = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserSignupDto>();
    const navigate = useNavigate();

    const login = async (data: UserSignupDto) => {
        if (errors.login || errors.password) {
            return;
        }
        const res = await UsersClient.signin(data);
        StorageService.set({ key: 'user', data: res.data });
        ToastService.success({ text: 'Welcome back!' });
        navigate(ROUTES.HOME);
    };

    return (
        <>
            <h2>Login Component</h2>
            <form onSubmit={handleSubmit((data) => login(data))}>
                <label htmlFor="login">Login:</label>
                <input
                    {...register('login', {
                        required: 'Login is required',
                        minLength: { value: 4, message: 'Login must be at least 4 characters' },
                        maxLength: { value: 20, message: 'Login must not exceed 20 characters' },
                    })}
                />
                {errors.login && <p>{errors.login.message}</p>}
                <label htmlFor="password">Password:</label>
                <input
                    {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 4, message: 'Password must be at least 4 characters' },
                        maxLength: { value: 20, message: 'Password must not exceed 20 characters' },
                    })}
                />
                {errors.password && <p>{errors.password.message}</p>}
                <button type="submit">Login</button>
            </form>
        </>
    );
};
