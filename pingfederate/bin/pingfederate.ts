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
    region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION
}
const app = new cdk.App();
new SecretStack(app, 'PfSecretStack', { env: myenv });
new ManagementStack(app, 'PfManagementStack', { env: myenv });
const identityStack = new IdentityStack(app, 'PfIdentityStack', { env: myenv });
const networkStack = new NetworkStack(app, 'PfNetworkStack', { env: myenv });
const computerStack = new ComputerStack(app, 'PfComputerStack', {
    vpc: networkStack.vpc,
    addsRole: identityStack.addsRole,
    env: myenv
});
new DhcpStack(app, 'PfDhcpStack', {
    vpc: networkStack.vpc,
    addsPrivateIpAddress: computerStack.addsPrivateIpAddress,
    env: myenv
});
