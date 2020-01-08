import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2')
import { IVpc, ISecurityGroup, IInstance, UserData } from '@aws-cdk/aws-ec2';
import { IRole } from '@aws-cdk/aws-iam';
import { CfnOutput } from '@aws-cdk/core'

interface ComputerStackProps extends cdk.StackProps {
  vpc: IVpc,
  addsSg: ISecurityGroup,
  pfSg: ISecurityGroup,
  remoteAccessSg: ISecurityGroup,
  addsRole: IRole,
  pfRole: IRole
};

export class ComputerStack extends cdk.Stack {
  public readonly addsInstance: IInstance;
  public readonly pfInstance: IInstance;

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

    const userData = UserData.forLinux();
    userData.addCommands(
      'echo ECS_CLUSTER=pingfederate >> /etc/ecs/ecs.config'
    )

    const pingfederate = new ec2.Instance(this, 'pingfederate', {
      vpc: props.vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3A, ec2.InstanceSize.MEDIUM),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2
      }),
      securityGroup: props.pfSg,
      role: props.pfRole,
      userData: userData
    });
    pingfederate.addSecurityGroup(props.remoteAccessSg);

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
