import { Fn, Stack, StackProps } from 'aws-cdk-lib';
import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export interface PhotosHandlerStackProps extends StackProps {
    targetBucket: string;
}

export class PhotosHandlerStack extends Stack {
    // private targetBucket =  Fn.importValue('photos-bucket');

    constructor(scope: Construct, id: string, props: PhotosHandlerStackProps) {
        super(scope, id, props);

        new LambdaFunction(this, 'photos-handler', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'index.handler',
            code: Code.fromInline(`
                exports.handler = async (event) => {
                    console.log('Target bucket', process.env.TARGET_BUCKET)
                }
            `),
            environment: {
                TARGET_BUCKET: props.targetBucket,
            },
        });
    }
}
