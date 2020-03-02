import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2')
import { IVpc, ISecurityGroup, IInstance } from '@aws-cdk/aws-ec2';
import { IRole } from '@aws-cdk/aws-iam';
import { CfnOutput } from '@aws-cdk/core'

interface ComputerStackProps extends cdk.StackProps {
  vpc: IVpc,
  addsSg: ISecurityGroup,
  addsRole: IRole,
};

export class ComputerStack extends cdk.Stack {
  public readonly addsInstance: IInstance;
  public readonly addsPrivateIpAddress: CfnOutput;

  constructor(scope: cdk.Construct, id: string, props: ComputerStackProps) {
    super(scope, id, props);

    // EC2 Instance Parameters
    const uiType = process.env.CDK_MY_UI_TYPE || "cli";
    const instanceParams = this.node.tryGetContext(uiType);

    // EC2 Instance
    const adds = new ec2.Instance(this, 'adds', {
      vpc: props.vpc,
      instanceType: ec2.InstanceType.of(instanceParams.instanceClass, instanceParams.instanceSize),
      machineImage: new ec2.WindowsImage(instanceParams.windowsAmiVersion),
      securityGroup: props.addsSg,
      role: props.addsRole
    });

    new CfnOutput(this, "addsinstanceid", {
      value: adds.instanceId,
      description: "ADDS Instance ID"
    });

    this.addsPrivateIpAddress = new CfnOutput(this, "addsprivateipaddress", {
      exportName: "addsprivateipaddress",
      value: adds.instancePrivateIp,
      description: "ADDS Instance Private IP Address"
    });
  }
}