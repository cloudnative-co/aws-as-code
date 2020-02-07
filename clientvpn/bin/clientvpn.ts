#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ClientvpnStack } from '../lib/clientvpn-stack';

const app = new cdk.App();
new ClientvpnStack(app, 'ClientvpnStack');
