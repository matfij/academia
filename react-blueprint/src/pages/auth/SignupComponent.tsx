import style from './AuthComponent.module.scss';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { UserSignupDto } from '../../common/api/.generated';
import { UsersClient } from '../../common/api/client';
import { ROUTES } from '../../common/config';
import { StorageService } from '../../common/services/StorageService';
import { ToastService } from '../../common/services/ToastService';

type UserSignupData = UserSignupDto & {
    confirmPassword: string;
};

export const SignupComponent = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<UserSignupData>();
    const navigate = useNavigate();

    const validatePasswordMatch = () =>
        watch('password') === watch('confirmPassword') || 'Passwords do not match';

    const handleSignup = async (data: UserSignupDto) => {
        validatePasswordMatch();
        const res = await UsersClient.signup({
            username: data.username,
            password: data.password,
        });
        StorageService.set({ key: 'user', data: res.data });
        ToastService.success({ text: 'Welcome to the app!' });
        navigate(`../${ROUTES.APP}`);
    };

    return (
        <main className={style.mainWrapper}>
            <form onSubmit={handleSubmit((data) => handleSignup(data))} className={style.formWrapper}>
                <h2>Signup to App</h2>
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
                <label htmlFor="confirmPassword">Confirm password:</label>
                <input
                    {...register('confirmPassword', {
                        required: 'Password is required',
                        minLength: { value: 4, message: 'Password must be at least 4 characters' },
                        maxLength: { value: 20, message: 'Password must not exceed 20 characters' },
                        validate: validatePasswordMatch,
                    })}
                    type="password"
                />
                {errors.confirmPassword && <p className='error'>{errors.confirmPassword.message}</p>}
                <button type="submit" className="btn">
                    Signup
                </button>
            </form>
            <button type="button" onClick={() => navigate(ROUTES.ROOT)}>
                Signin
            </button>
        </main>
    );
};
