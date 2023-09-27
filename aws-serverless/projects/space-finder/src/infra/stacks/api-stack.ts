import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

interface ApiStackProps extends StackProps {
    spacesLambdaIntegration: LambdaIntegration;
}

export class ApiStack extends Stack {
    constructor(scope: Construct, id: string, props: ApiStackProps) {
        super(scope, id, props);

        const api = new RestApi(this, 'SpacesApi');
        const spacesRes = api.root.addResource('spaces');
        spacesRes.addMethod('POST', props.spacesLambdaIntegration);
        spacesRes.addMethod('GET', props.spacesLambdaIntegration);
        spacesRes.addMethod('PUT', props.spacesLambdaIntegration);
        spacesRes.addMethod('DELETE', props.spacesLambdaIntegration);
    }
}
