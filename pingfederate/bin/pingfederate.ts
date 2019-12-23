#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { PingfederateStack } from '../lib/pingfederate-stack';

const app = new cdk.App();
new PingfederateStack(app, 'PingfederateStack');
