import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { CfnUserPoolGroup, UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export class AuthStack extends Stack {
    public userPool: UserPool;
    private userPoolClient: UserPoolClient;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        this.createUserPool();
        this.createUserPoolClient();
        this.createAdminsGroup();
    }

    private createUserPool() {
        this.userPool = new UserPool(this, 'SpacesUserPool', {
            selfSignUpEnabled: true,
            signInAliases: {
                username: true,
                email: true,
            },
        });
        new CfnOutput(this, 'SpacesUserPoolId', {
            value: this.userPool.userPoolId,
        });
    }

    private createUserPoolClient() {
        this.userPoolClient = this.userPool.addClient('SpacesUserPoolClient', {
            authFlows: {
                adminUserPassword: true,
                custom: true,
                userPassword: true,
                userSrp: true,
            },
        });
        new CfnOutput(this, 'SpacesUserPoolClientId', {
            value: this.userPoolClient.userPoolClientId,
        });
    }

    private createAdminsGroup() {
        new CfnUserPoolGroup(this, 'SpacesAdmins', {
            userPoolId: this.userPool.userPoolId,
            groupName: 'admins',
        });
    }
}
