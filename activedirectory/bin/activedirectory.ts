#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { NetworkStack } from '../lib/network-stack';
import { ComputerStack } from '../lib/computer-stack';
import { IdentityStack } from '../lib/identity-stack';
import { ManagementStack } from '../lib/management-stack';
import { SecretStack } from '../lib/secrets-stack';
import { DhcpStack } from '../lib/dhcpoptionset-stack';

const myenv = {
    account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION,
    prefix: process.env.CDK_MY_PREFIX || "Adds"
}
const app = new cdk.App();
new SecretStack(app, myenv.prefix + 'SecretStack', { env: myenv });
new ManagementStack(app, myenv.prefix + 'ManagementStack', { env: myenv });
const identityStack = new IdentityStack(app, myenv.prefix + 'IdentityStack', { env: myenv });
const networkStack = new NetworkStack(app, myenv.prefix + 'NetworkStack', { env: myenv });
const computerStack = new ComputerStack(app, myenv.prefix + 'ComputerStack', {
    vpc: networkStack.vpc,
    addsRole: identityStack.addsRole,
    env: myenv
});
new DhcpStack(app, myenv.prefix + 'DhcpStack', {
    vpc: networkStack.vpc,
    addsPrivateIpAddress: computerStack.addsPrivateIpAddress,
    env: myenv
});
