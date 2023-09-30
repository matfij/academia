import { Stack, StackProps } from 'aws-cdk-lib';
import {
    AuthorizationType,
    CognitoUserPoolsAuthorizer,
    Cors,
    LambdaIntegration,
    MethodOptions,
    ResourceOptions,
    RestApi,
} from 'aws-cdk-lib/aws-apigateway';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

interface ApiStackProps extends StackProps {
    spacesLambdaIntegration: LambdaIntegration;
    userPool: IUserPool;
}

export class ApiStack extends Stack {
    constructor(scope: Construct, id: string, props: ApiStackProps) {
        super(scope, id, props);
        const api = new RestApi(this, 'SpacesApi');
        const authorizer = new CognitoUserPoolsAuthorizer(this, 'SpacesApiAuthorizer', {
            cognitoUserPools: [props.userPool],
            identitySource: 'method.request.header.Authorization',
        });
        authorizer._attachToApi(api);
        this.setupResources(api, props.spacesLambdaIntegration, authorizer.authorizerId);
    }

    private setupResources(api: RestApi, integration: LambdaIntegration, authorizerId: string) {
        const authOptions: MethodOptions = {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: {
                authorizerId: authorizerId,
            },
        };
        const corsOptions: ResourceOptions = {
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS,
            },
        };
        const spacesRes = api.root.addResource('spaces',corsOptions);
        spacesRes.addMethod('POST', integration, authOptions);
        spacesRes.addMethod('GET', integration, authOptions);
        spacesRes.addMethod('PUT', integration, authOptions);
        spacesRes.addMethod('DELETE', integration, authOptions);
    }
}
