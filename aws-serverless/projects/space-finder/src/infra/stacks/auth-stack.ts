import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import {
    CfnIdentityPool,
    CfnIdentityPoolRoleAttachment,
    CfnUserPoolGroup,
    UserPool,
    UserPoolClient,
} from 'aws-cdk-lib/aws-cognito';
import { Effect, FederatedPrincipal, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

interface AuthStackProps extends StackProps {
    photosBucket: IBucket;
}
export class AuthStack extends Stack {
    public userPool: UserPool;
    private userPoolClient: UserPoolClient;
    private identityPool: CfnIdentityPool;
    private adminRole: Role;
    private authRole: Role;
    private unauthRole: Role;

    constructor(scope: Construct, id: string, props: AuthStackProps) {
        super(scope, id, props);
        this.createUserPool();
        this.createUserPoolClient();
        this.createAdminsGroup();
        this.createIdentityPool();
        this.createRoles(props.photosBucket);
        // this.attachRoles();
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

    private createIdentityPool() {
        this.identityPool = new CfnIdentityPool(this, 'SpacesIdentityPool', {
            allowUnauthenticatedIdentities: true,
            cognitoIdentityProviders: [
                {
                    clientId: this.userPoolClient.userPoolClientId,
                    providerName: this.userPool.userPoolProviderName,
                },
            ],
        });
        new CfnOutput(this, 'SpacesIdentityPoolId', {
            value: this.identityPool.ref,
        });
    }

    private createRoles(photosBucket: IBucket) {
        this.authRole = new Role(this, 'CognitoDefaultAuthenticatedRole', {
            assumedBy: new FederatedPrincipal(
                'cognito-identity.amazonaws.com',
                {
                    StringEquals: {
                        'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
                    },
                    'ForAnyValue:StringLike': {
                        'cognito-identity.amazonaws.com:amr': 'authenticated',
                    },
                },
                'sts:AssumeRoleWithWebIdentity',
            ),
        });
        this.unauthRole = new Role(this, 'CognitoDefaultUnauthenticatedRole', {
            assumedBy: new FederatedPrincipal(
                'cognito-identity.amazonaws.com',
                {
                    StringEquals: {
                        'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
                    },
                    'ForAnyValue:StringLike': {
                        'cognito-identity.amazonaws.com:amr': 'unauthenticated',
                    },
                },
                'sts:AssumeRoleWithWebIdentity',
            ),
        });
        this.adminRole = new Role(this, 'CognitoAdminRole', {
            assumedBy: new FederatedPrincipal(
                'cognito-identity.amazonaws.com',
                {
                    StringEquals: {
                        'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
                    },
                    'ForAnyValue:StringLike': {
                        'cognito-identity.amazonaws.com:amr': 'authenticated',
                    },
                },
                'sts:AssumeRoleWithWebIdentity',
            ),
        });
        this.adminRole.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ['s3:PutObject', 's3:PutObjectAcl'],
                resources: [photosBucket.bucketArn + '/*'],
            }),
        );
    }

    private attachRoles() {
        new CfnIdentityPoolRoleAttachment(this, 'RolesAttachment', {
            identityPoolId: this.identityPool.ref,
            roles: {
                authenticated: this.authRole.roleArn,
                unauthenticated: this.unauthRole.roleArn,
            },
            roleMappings: {
                adminsMapping: {
                    type: 'Token',
                    ambiguousRoleResolution: 'AuthenticatedRole',
                    identityProvider: `${this.userPool.userPoolProviderName}:${this.userPoolClient.userPoolClientId}`,
                },
            },
        });
    }
}
