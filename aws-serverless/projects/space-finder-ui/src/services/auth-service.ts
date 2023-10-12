import { type CognitoUser } from '@aws-amplify/auth';
import { Amplify, Auth } from 'aws-amplify';
import { AuthStack } from '../../cdk-outputs.json';
import { AWS_REGION } from '../common/config';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

Amplify.configure({
    Auth: {
        mandatorySignIn: false,
        region: AWS_REGION,
        userPoolId: AuthStack.SpacesUserPoolId,
        userPoolWebClientId: AuthStack.SpacesUserPoolClientId,
        identityPoolId: AuthStack.SpacesIdentityPoolId,
        authenticationFlowType: 'USER_PASSWORD_AUTH',
    },
});

export class AuthService {
    private user: CognitoUser | undefined;
    private jwt: string | undefined;
    private temporaryCredentials: object | undefined;

    public async login(username: string, password: string): Promise<CognitoUser | undefined> {
        try {
            this.user = await Auth.signIn(username, password);
            this.jwt = this.user?.getSignInUserSession()?.getIdToken().getJwtToken();
            return this.user;
        } catch (err) {
            console.error(err);
            return undefined;
        }
    }

    public getJwt() {
        return this.jwt;
    }

    public getUsername() {
        return this.user?.getUsername();
    }

    public async getTemporaryCredentials() {
        if (!this.temporaryCredentials) {
            this.temporaryCredentials = await this.generateTemporaryCredentials();
        }
        return this.temporaryCredentials;
    }

    private async generateTemporaryCredentials(): Promise<object | undefined> {
        if (!this.jwt) {
            return undefined;
        }
        const cognitoIdentityPool = `cognito-idp.${AWS_REGION}.amazonaws.com/${AuthStack.SpacesUserPoolId}`;
        const cognitoIdentityCredentials = fromCognitoIdentityPool({
            identityPoolId: AuthStack.SpacesIdentityPoolId,
            clientConfig: {
                region: AWS_REGION,
            },
            logins: {
                [cognitoIdentityPool]: this.jwt,
            },
        });
        const cognitoIdentity = new CognitoIdentityClient({
            credentials: cognitoIdentityCredentials,
        });
        const credentials = await cognitoIdentity.config.credentials();
        return credentials;
    }
}
