import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2')
import { SubnetType, Subnet } from '@aws-cdk/aws-ec2';

export class PingfederateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', {
      cidr: '10.100.0.0/16',
      subnetConfiguration: [
        {
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC
        }
      ]
    });
  }
}
