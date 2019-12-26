import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2')
import iam = require('@aws-cdk/aws-iam')
import ssm = require('@aws-cdk/aws-ssm')
import secretsmanager = require('@aws-cdk/aws-secretsmanager')
import * as fs from 'fs-extra';
import { SubnetType, Subnet, CfnEC2Fleet, InstanceSize, CfnDHCPOptions, CfnVPCDHCPOptionsAssociation } from '@aws-cdk/aws-ec2';
import { SSL_OP_NO_QUERY_MTU } from 'constants';
import { ServicePrincipal, Effect } from '@aws-cdk/aws-iam';
import { CfnOutput } from '@aws-cdk/core';
import { CfnDocument } from '@aws-cdk/aws-ssm';

export class PingfederateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    const my_vpc = new ec2.Vpc(this, 'VPC', {
      cidr: process.env.CDK_MY_VPC_CIDR || '10.100.0.0/16',
      subnetConfiguration: [
        {
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC
        }
      ]
    });

    // SecurityGroup
    const pf_sg = new ec2.SecurityGroup(this, "pingfederate-sg", {
      vpc: my_vpc,
      securityGroupName: "pingfederate"
    });

    const adds_sg = new ec2.SecurityGroup(this, "adds-sg", {
      vpc: my_vpc,
      securityGroupName: "adds",
    });

    // TCP Ports for ADDS
    [42, 53, 88, 135, 139, 389, 445, 464, 3268, 636, 3269, 9389].forEach(v => {
      adds_sg.addIngressRule(pf_sg, ec2.Port.tcp(v), "pingfederate");
    });
    adds_sg.addIngressRule(pf_sg, ec2.Port.tcpRange(49152, 65535), "pingfederate");

    // UDP Ports for ADDS
    [53, 88, 123, 137, 389].forEach(v => {
      adds_sg.addIngressRule(pf_sg, ec2.Port.udp(v), "pingfederate");
    });

    // IAM Role
    const adds_role = new iam.Role(this, "adds-role", {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMManagedInstanceCore"),
        iam.ManagedPolicy.fromAwsManagedPolicyName("CloudWatchAgentServerPolicy")
      ]
    });

    const pf_role = new iam.Role(this, "pf-role", {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMManagedInstanceCore"),
        iam.ManagedPolicy.fromAwsManagedPolicyName("CloudWatchAgentServerPolicy")
      ]
    });

    // Policy for Secrets Manager
    const secrets_policy_stat1 = new iam.PolicyStatement({
      effect: Effect.ALLOW
    });
    secrets_policy_stat1.addActions(
      "secretsmanager:GetResourcePolicy",
      "secretsmanager:GetSecretValue",
      "secretsmanager:DescribeSecret",
      "secretsmanager:ListSecretVersionIds"
    );
    secrets_policy_stat1.addResources("arn:aws:secretsmanager:*:*:secret:*");

    const secrets_policy_stat2 = new iam.PolicyStatement({
      effect: Effect.ALLOW
    });
    secrets_policy_stat2.addActions("secretsmanager:ListSecrets");
    secrets_policy_stat2.addAllResources();

    const secrets_policy = new iam.ManagedPolicy(this, "read-secrets", {
      description: "Allow Read Secrets from Secrets Manager",
      roles: [adds_role, pf_role],
      statements: [secrets_policy_stat1, secrets_policy_stat2]
    });
    secrets_policy.attachToRole(adds_role);
    secrets_policy.attachToRole(pf_role);

    // EC2 Instance
    const adds = new ec2.Instance(this, 'adds', {
      vpc: my_vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3A, ec2.InstanceSize.LARGE),
      machineImage: new ec2.WindowsImage(ec2.WindowsVersion.WINDOWS_SERVER_2019_ENGLISH_CORE_BASE),
      securityGroup: adds_sg,
      role: adds_role
    });

    const pingfederate = new ec2.Instance(this, 'pingfederate', {
      vpc: my_vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3A, ec2.InstanceSize.MEDIUM),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2
      }),
      securityGroup: pf_sg,
      role: pf_role
    });

    // Generate DSRM Password
    const secret = new secretsmanager.Secret(this, "DSRMPassword", {
      secretName: "DSRM-Password",
      description: "Directory Service Restore Mode Password",
      generateSecretString: { passwordLength: 32 }
    })

    // SSM Document
    const install_adds_doc_json = require("../scripts/install-adds-forest.json");
    const install_adds_doc = new CfnDocument(this, "install-adds-doc", {
      documentType: "Command",
      content: install_adds_doc_json,
      tags: [
        {
          key: "Name",
          value: "install-adds-doc"
        }
      ]
    });

    new CfnOutput(this, "addsinstanceid", {
      value: adds.instanceId,
      description: "ADDS Instance ID"
    });

    new CfnOutput(this, "pfinstanceid", {
      value: pingfederate.instanceId,
      description: "PingFederate Instance ID"
    });
  }
}
