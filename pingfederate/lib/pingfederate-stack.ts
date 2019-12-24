import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2')
import { SubnetType, Subnet, CfnEC2Fleet, InstanceSize } from '@aws-cdk/aws-ec2';

export class PingfederateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const my_vpc = new ec2.Vpc(this, 'VPC', {
      cidr: '10.100.0.0/16',
      subnetConfiguration: [
        {
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC
        }
      ]
    });

    const adds = new ec2.Instance(this, 'adds', {
      vpc: my_vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3A, ec2.InstanceSize.LARGE),
      machineImage: new ec2.WindowsImage(ec2.WindowsVersion.WINDOWS_SERVER_2019_ENGLISH_CORE_BASE)
    });

    const pingfederate = new ec2.Instance(this, 'pingfederate', {
      vpc: my_vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3A, ec2.InstanceSize.MEDIUM),
      machineImage: new ec2.WindowsImage(ec2.WindowsVersion.WINDOWS_SERVER_2019_ENGLISH_CORE_BASE)
    });
  }
}
