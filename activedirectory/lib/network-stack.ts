import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2')
import { Vpc, SecurityGroup, ISecurityGroup } from '@aws-cdk/aws-ec2';
import { CfnOutput } from '@aws-cdk/core';

export class NetworkStack extends cdk.Stack {
  public readonly vpc: Vpc;
  public readonly addsSgId: CfnOutput;
  public readonly internalSgId: CfnOutput;
  public readonly remoteAccessSgId: CfnOutput;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    this.vpc = new ec2.Vpc(this, 'VPC', {
      cidr: process.env.CDK_MY_VPC_CIDR || '10.100.0.0/16',
      subnetConfiguration: [
        {
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC
        }
      ]
    });

    // SecurityGroup
    const remoteAccessSg = new ec2.SecurityGroup(this, "remote-access-sg", {
      vpc: this.vpc,
      securityGroupName: "remote-access",
    });
    if (process.env.CDK_MY_IPADDRESS) {
      remoteAccessSg.addIngressRule(ec2.Peer.ipv4(process.env.CDK_MY_IPADDRESS), ec2.Port.tcp(3389));
    }

    const internalSg = new ec2.SecurityGroup(this, "internal-sg", {
      vpc: this.vpc,
      securityGroupName: "internal",
    });

    const addsSg = new ec2.SecurityGroup(this, "adds-sg", {
      vpc: this.vpc,
      securityGroupName: "adds",
    });

    // TCP Ports for ADDS
    [42, 53, 88, 135, 139, 389, 445, 464, 3268, 636, 3269, 9389].forEach(v => {
      addsSg.addIngressRule(internalSg, ec2.Port.tcp(v), "internal");
    });
    addsSg.addIngressRule(internalSg, ec2.Port.tcpRange(49152, 65535), "internal");

    // UDP Ports for ADDS
    [53, 88, 123, 137, 389].forEach(v => {
      addsSg.addIngressRule(internalSg, ec2.Port.udp(v), "internal");
    });

    this.remoteAccessSgId = new CfnOutput(this, "remote-access-sg-id", {
      exportName: "remote-access-sg-id",
      value: remoteAccessSg.securityGroupId,
      description: "Security Group for remote access"
    });

    this.internalSgId = new CfnOutput(this, "internal-sg-id", {
      exportName: "internal-sg-id",
      value: internalSg.securityGroupId,
      description: "Security Group for VPC Internal"
    });

    this.addsSgId = new CfnOutput(this, "adds-sg-id", {
      exportName: "adds-sg-id",
      value: addsSg.securityGroupId,
      description: "Security Group for ADDS"
    });
  }
}
