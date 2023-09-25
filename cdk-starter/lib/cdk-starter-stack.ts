import * as cdk from 'aws-cdk-lib';
import { Bucket, CfnBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class CdkStarterStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // L1 construct - deployment parameter
        const duration = new cdk.CfnParameter(this, 'duration', {
            type: 'Number',
            default: 1,
            minValue: 1,
            maxValue: 7,
        });

        // L1 construct
        new CfnBucket(this, 'cdk-bucket-l1', {
            lifecycleConfiguration: {
                rules: [{ expirationInDays: duration.valueAsNumber, status: 'Enabled' }],
            },
        });

        // L2 construct
        const l2Bucket = new Bucket(this, 'cdk-bucket-l2', {
            lifecycleRules: [{ expiration: cdk.Duration.days(duration.valueAsNumber) }],
        });

        // L3 construct
        class L3Bucket extends Construct {
            constructor(scope: Construct, id: string, expirationHours = duration.valueAsNumber) {
                super(scope, id);

                new Bucket(this, 'cdk-bucket-l3-inner', {
                    lifecycleRules: [{ expiration: cdk.Duration.days(expirationHours) }],
                });
            }
        }
        new L3Bucket(this, 'cdk-bucket-l3', 48);

        // L1 construct for inter-stack data exchange
        new cdk.CfnOutput(this, 'L2 Bucket Name', {
            value: l2Bucket.bucketName,
            exportName: 'L2BucketName',
        });
    }
}
