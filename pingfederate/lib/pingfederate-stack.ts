import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2')
import { SubnetType, Subnet, CfnEC2Fleet, InstanceSize } from '@aws-cdk/aws-ec2';
import { SSL_OP_NO_QUERY_MTU } from 'constants';

export class PingfederateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    const my_vpc = new ec2.Vpc(this, 'VPC', {
      cidr: '10.100.0.0/16',
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
    pf_sg.addIngressRule

    const adds_sg = new ec2.SecurityGroup(this, "adds-sg", {
      vpc: my_vpc,
      securityGroupName: "adds",
    });

    const remote_access_sg = new ec2.SecurityGroup(this, "remote-access-sg", {
      vpc: my_vpc,
      securityGroupName: "remote-access"
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

    // EC2 Instance
    const adds = new ec2.Instance(this, 'adds', {
      vpc: my_vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3A, ec2.InstanceSize.LARGE),
      machineImage: new ec2.WindowsImage(ec2.WindowsVersion.WINDOWS_SERVER_2019_ENGLISH_CORE_BASE),
      securityGroup: adds_sg
    });

    const pingfederate = new ec2.Instance(this, 'pingfederate', {
      vpc: my_vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3A, ec2.InstanceSize.MEDIUM),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2
      }),
      securityGroup: pf_sg
    });
  }
}
