import { AuthPlayground } from './auth-playground';

const testAuth = async () => {
    const playground = new AuthPlayground();
    const user = await playground.login('test', 'specAA11#');

    console.log(user);
};

testAuth();
