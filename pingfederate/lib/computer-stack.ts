import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2')
import { IVpc, ISecurityGroup } from '@aws-cdk/aws-ec2';
import { IRole } from '@aws-cdk/aws-iam';

interface ComputerStackProps extends cdk.StackProps {
  vpc: IVpc,
  addsSg: ISecurityGroup,
  pfSg: ISecurityGroup,
  remoteAccessSg: ISecurityGroup,
  addsRole: IRole,
  pfRole: IRole
};

export class ComputerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ComputerStackProps) {
    super(scope, id, props);

    // EC2 Instance
    const adds = new ec2.Instance(this, 'adds', {
      vpc: props.vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3A, ec2.InstanceSize.LARGE),
      machineImage: new ec2.WindowsImage(ec2.WindowsVersion.WINDOWS_SERVER_2019_ENGLISH_CORE_BASE),
      securityGroup: props.addsSg,
      role: props.addsRole
    });
    adds.addSecurityGroup(props.remoteAccessSg);

    const pingfederate = new ec2.Instance(this, 'pingfederate', {
      vpc: props.vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3A, ec2.InstanceSize.MEDIUM),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2
      }),
      securityGroup: props.pfSg,
      role: props.pfRole
    });
    pingfederate.addSecurityGroup(props.remoteAccessSg);
  }
}
