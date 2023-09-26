#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkStarterStack } from '../lib/cdk-starter-stack';
import { PhotosStack } from '../lib/photos-stack';
import { PhotosHandlerStack } from '../lib/photos-handler-stack';
import { BucketTagger } from './bucket-tagger';

const app = new cdk.App();

new CdkStarterStack(app, 'CdkStarterStack');

const photosStack = new PhotosStack(app, 'PhotosStack');

new PhotosHandlerStack(app, 'PhotosHandlerStack', {
    targetBucket: photosStack.PHOTOS_BUCKET,
});

const tagger = new BucketTagger('env', 'test');
cdk.Aspects.of(app).add(tagger);
