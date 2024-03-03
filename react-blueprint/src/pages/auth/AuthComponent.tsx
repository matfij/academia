import style from './AuthComponent.module.scss';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UsersClient } from '../../common/api/client';
import { UserSigninDto } from '../../common/api/.generated';
import { StorageService } from '../../common/services/StorageService';
import { ToastService } from '../../common/services/ToastService';
import { ROUTES } from '../../common/routes';

export const AuthComponent = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserSigninDto>();
    const navigate = useNavigate();

    const handleSignin = async (data: UserSigninDto) => {
        if (errors.username || errors.password) {
            return;
        }
        const res = await UsersClient.signin(data);
        StorageService.set({ key: 'user', data: res.data });
        ToastService.success({ text: 'Welcome back!' });
        navigate(ROUTES.HOME);
    };

    return (
        <main className='mainWrapper'>
            <form onSubmit={handleSubmit((data) => handleSignin(data))} className={style.formWrapper}>
                <h2>Auth Component</h2>
                <label htmlFor="username">Username:</label>
                <input
                    {...register('username', {
                        required: 'Username is required',
                        minLength: { value: 4, message: 'Username must be at least 4 characters' },
                        maxLength: { value: 20, message: 'Username must not exceed 20 characters' },
                    })}
                />
                {errors.username && <p>{errors.username.message}</p>}
                <label htmlFor="password">Password:</label>
                <input
                    {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 4, message: 'Password must be at least 4 characters' },
                        maxLength: { value: 20, message: 'Password must not exceed 20 characters' },
                    })}
                />
                {errors.password && <p>{errors.password.message}</p>}
                <button type="submit" className="btn">
                    Signin
                </button>
            </form>
        </main>
    );
};
