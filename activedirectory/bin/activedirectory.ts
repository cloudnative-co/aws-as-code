#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { NetworkStack } from '../lib/network-stack';
import { ComputerStack } from '../lib/computer-stack';
import { IdentityStack } from '../lib/identity-stack';
import { ManagementStack } from '../lib/management-stack';
import { SecretStack } from '../lib/secrets-stack';
import { DHCPOptionSetStack } from '../lib/dhcpoptionset-stack';

const app = new cdk.App();
new SecretStack(app, 'AddsSecretStack');
new ManagementStack(app, 'AddsManagementStack');
const identityStack = new IdentityStack(app, 'AddsIdentityStack');
const networkStack = new NetworkStack(app, 'AddsNetworkStack');
const computerStack = new ComputerStack(app, 'AddsComputerStack', {
    vpc: networkStack.vpc,
    addsSg: networkStack.addsSg,
    addsRole: identityStack.addsRole,
});
new DHCPOptionSetStack(app, 'AddsDHCPOptionSetStack', {
    vpc: networkStack.vpc,
    addsPrivateIpAddress: computerStack.addsPrivateIpAddress
});
