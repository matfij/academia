import { useNavigate } from 'react-router-dom';
import { UsersClient } from '../../common/api/client';
import { ChangeEvent, FormEvent, useState } from 'react';
import { UserSignupDto } from '../../common/api/generated';
import { StorageService } from '../../common/services/StorageService';
import { ToastService } from '../../common/services/ToastService';
import { ROUTES } from '../../common/routes';

export const LoginComponent = () => {
    const [formData, setFormData] = useState<UserSignupDto>({
        login: '',
        password: '',
    });
    const [formErrors, setFormErrors] = useState<Partial<UserSignupDto>>();
    const navigate = useNavigate();

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const checkFormErrors = () => {
        const errors: Partial<UserSignupDto> = {};
        let errorOccured = false;
        if (!formData.login) {
            errors.login = 'errors.loginRequired';
            errorOccured = true;
        }
        if (!formData.password) {
            errors.password = 'errors.passwordRequired';
            errorOccured = true;
        }
        setFormErrors(errors);
        return errorOccured;
    };

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (checkFormErrors()) {
            return;
        }
        const res = await UsersClient.signin(formData);
        StorageService.set({ key: 'user', data: res.data });
        ToastService.success({ text: 'Welcome back!' });
        navigate(ROUTES.HOME);
    };

    return (
        <>
            <h2>Login Component</h2>
            <form onSubmit={handleLogin}>
                <label htmlFor="login">
                    Login:
                    <input
                        type="text"
                        name="login"
                        id="login"
                        value={formData.login}
                        onChange={handleInputChange}
                    />
                    {formErrors?.login}
                </label>
                <label htmlFor="password">
                    Password:
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                </label>
                {formErrors?.password}
                <button type="submit">Login</button>
            </form>
        </>
    );
};
