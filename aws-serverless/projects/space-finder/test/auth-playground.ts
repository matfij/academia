import { type CognitoUser } from '@aws-amplify/auth';
import { Amplify, Auth } from 'aws-amplify';

Amplify.configure({
    Auth: {
        region: 'eu-central-1',
        userPoolId: 'eu-central-1_i5mnA0EGS',
        userPoolWebClientId: '1h4ougfjk5nqlcde4ijsar9j58',
        authenticationFlowType: 'USER_PASSWORD_AUTH',
    },
});

export class AuthPlayground {
    public async login(username: string, password: string) {
        const user = (await Auth.signIn(username, password)) as CognitoUser;
        return user;
    }
}
