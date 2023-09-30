import { App } from 'aws-cdk-lib';
import { DataStack } from './stacks/data-stack';
import { LambdaStack } from './stacks/lambda-stack';
import { ApiStack } from './stacks/api-stack';
import { AuthStack } from './stacks/auth-stack';
import { UiStack } from './stacks/ui-stack';

const app = new App();

const dataStack = new DataStack(app, 'DataStack');

const lambdastack = new LambdaStack(app, 'LambdaStack', {
    spacesTable: dataStack.spacesTable,
});

const authStack = new AuthStack(app, 'AuthStack');

new ApiStack(app, 'ApiStack', {
    spacesLambdaIntegration: lambdastack.spacesLambdaIntegration,
    userPool: authStack.userPool,
});

new UiStack(app, 'UiStack');
