import * as cdk from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class PhotosStack extends cdk.Stack {
    private STACK_SUFFIX: string;
    public readonly PHOTOS_BUCKET: string;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        this.initializeSuffix();

        const photosBucket = new Bucket(this, 'photos-bucket-1', {
            bucketName: `photos-bucket-${this.STACK_SUFFIX}`,
        });

        // new cdk.CfnOutput(this, 'photos-bucket', {
        //     value: photosBucket.bucketArn,
        //     exportName: 'photos-bucket',
        // });

        this.PHOTOS_BUCKET = photosBucket.bucketArn;
    }

    private initializeSuffix() {
        const stackId = cdk.Fn.select(2, cdk.Fn.split('/', this.stackId));
        this.STACK_SUFFIX = cdk.Fn.select(4, cdk.Fn.split('-', stackId));
    }
}
