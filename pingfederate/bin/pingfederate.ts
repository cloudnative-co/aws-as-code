#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { NetworkStack } from '../lib/network-stack';
import { ComputerStack } from '../lib/computer-stack';
import { IdentityStack } from '../lib/identity-stack';
import { ManagementStack } from '../lib/management-stack';
import { SecretStack } from '../lib/secrets-stack';
import { ContainerStack } from '../lib/container-stack';

const app = new cdk.App();
new SecretStack(app, 'SecretStack');
new ManagementStack(app, 'ManagementStack');
const identityStack = new IdentityStack(app, 'IdentityStack');
const networkStack = new NetworkStack(app, 'NetworkStack');
new ComputerStack(app, 'ComputerStack', {
    vpc: networkStack.vpc,
    addsSg: networkStack.addsSg,
    pfSg: networkStack.pfSg,
    remoteAccessSg: networkStack.remoteAccessSg,
    addsRole: identityStack.addsRole,
    pfRole: identityStack.pfRole
});
new ContainerStack(app, 'ContainerStack', {
    vpc: networkStack.vpc,
});