import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { getSuffixFromStack } from '../utils';
import { join } from 'path';
import { existsSync } from 'fs';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Distribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';

export class UiStack extends Stack {
    private uiBucket: Bucket;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        this.createUiBucket();
        this.deployUi();
        this.configureUiBucketAccess();
    }

    private createUiBucket() {
        const suffix = getSuffixFromStack(this);
        this.uiBucket = new Bucket(this, 'uiBucket', {
            bucketName: `spaces-ui-${suffix}`,
        });
    }

    private deployUi() {
        const uiDir = join(__dirname, '../../../../space-finder-ui/dist');
        if (!existsSync(uiDir)) {
            console.warn('UI dir not found:', uiDir);
            return;
        }
        new BucketDeployment(this, 'SpacesUiDeployment', {
            destinationBucket: this.uiBucket,
            sources: [Source.asset(uiDir)],
        });
    }

    private configureUiBucketAccess() {
        const originIdentity = new OriginAccessIdentity(this, 'SpacesOriginAccessIdentity');
        this.uiBucket.grantRead(originIdentity);
        const distribution = new Distribution(this, 'SpacesUiDistribution', {
            defaultRootObject: 'index.html',
            defaultBehavior: {
                origin: new S3Origin(this.uiBucket, { originAccessIdentity: originIdentity }),
            },
        });
        new CfnOutput(this, 'SpacesUiUrl', {
            value: distribution.distributionDomainName,
        });
    }
}
