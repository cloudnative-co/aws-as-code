#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CloudformationServiceroleStack } from '../lib/cloudformation-servicerole-stack';

const app = new cdk.App();
new CloudformationServiceroleStack(app, 'CloudformationServiceroleStack');
