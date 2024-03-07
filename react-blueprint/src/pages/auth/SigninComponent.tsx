import style from './AuthComponent.module.scss';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { UserSigninDto } from '../../common/api/.generated';
import { UsersClient } from '../../common/api/client';
import { ROUTES } from '../../common/routes';
import { StorageService } from '../../common/services/StorageService';
import { ToastService } from '../../common/services/ToastService';

export const SigninComponent = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserSigninDto>();
    const navigate = useNavigate();

    const handleSignin = async (data: UserSigninDto) => {
        const res = await UsersClient.signin(data);
        StorageService.set({ key: 'user', data: res.data });
        ToastService.success({ text: 'Welcome back!' });
        navigate(ROUTES.APP);
    };

    return (
        <main className={style.mainWrapper}>
            <form onSubmit={handleSubmit((data) => handleSignin(data))} className={style.formWrapper}>
                <h2>Signin to App</h2>
                <label htmlFor="username">Username:</label>
                <input
                    {...register('username', {
                        required: 'Username is required',
                        minLength: { value: 4, message: 'Username must be at least 4 characters' },
                        maxLength: { value: 20, message: 'Username must not exceed 20 characters' },
                    })}
                />
                {errors.username && <p className='error'>{errors.username.message}</p>}
                <label htmlFor="password">Password:</label>
                <input
                    {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 4, message: 'Password must be at least 4 characters' },
                        maxLength: { value: 20, message: 'Password must not exceed 20 characters' },
                    })}
                    type="password"
                />
                {errors.password && <p className='error'>{errors.password.message}</p>}
                <button type="submit">Signin</button>
            </form>
            <button type="button" onClick={() => navigate(ROUTES.SIGNUP)}>
                Signup
            </button>
        </main>
    );
};
