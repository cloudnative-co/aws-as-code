import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2')
import { Vpc, SecurityGroup } from '@aws-cdk/aws-ec2';

export class NetworkStack extends cdk.Stack {
  public readonly vpc: Vpc;
  public readonly addsSg: SecurityGroup;
  public readonly pfSg: SecurityGroup;
  public readonly remoteAccessSg: SecurityGroup;

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
    this.pfSg = new ec2.SecurityGroup(this, "pingfederate-sg", {
      vpc: this.vpc,
      securityGroupName: "pingfederate"
    });

    this.addsSg = new ec2.SecurityGroup(this, "adds-sg", {
      vpc: this.vpc,
      securityGroupName: "adds",
    });

    // TCP Ports for ADDS
    [42, 53, 88, 135, 139, 389, 445, 464, 3268, 636, 3269, 9389].forEach(v => {
      this.addsSg.addIngressRule(this.pfSg, ec2.Port.tcp(v), "pingfederate");
    });
    this.addsSg.addIngressRule(this.pfSg, ec2.Port.tcpRange(49152, 65535), "pingfederate");

    // UDP Ports for ADDS
    [53, 88, 123, 137, 389].forEach(v => {
      this.addsSg.addIngressRule(this.pfSg, ec2.Port.udp(v), "pingfederate");
    });

    // SSH, RDP Ports for me
    this.remoteAccessSg = new ec2.SecurityGroup(this, "remote-access-sg", {
      vpc: this.vpc,
      securityGroupName: "remote-access"
    });
    this.remoteAccessSg.addIngressRule(ec2.Peer.ipv4(process.env.CDK_MY_IPADDRESS || "10.100.0.0/16"), ec2.Port.tcp(22), "ssh");
    this.remoteAccessSg.addIngressRule(ec2.Peer.ipv4(process.env.CDK_MY_IPADDRESS || "10.100.0.0/16"), ec2.Port.tcp(3389), "RDP");
  }
}
