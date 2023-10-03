import { type CognitoUser } from '@aws-amplify/auth';
import { Amplify, Auth } from 'aws-amplify';
import { AuthStack } from '../../cdk-outputs.json';

Amplify.configure({
    Auth: {
        mandatorySignIn: false,
        region: 'eu-central-1',
        userPoolId: AuthStack.SpacesUserPoolId,
        userPoolWebClientId: AuthStack.SpacesUserPoolClientId,
        identityPoolId: AuthStack.SpacesIdentityPoolId,
        authenticationFlowType: 'USER_PASSWORD_AUTH',
    },
});

export class AuthService {
    private user: CognitoUser | undefined;

    public async login(username: string, password: string): Promise<CognitoUser | undefined> {
        try {
            this.user = await Auth.signIn(username, password);
            return this.user;
        } catch (err) {
            console.error(err);
            return undefined;
        }
    }

    public getUsername() {
        return this.user?.getUsername();
    }
}
