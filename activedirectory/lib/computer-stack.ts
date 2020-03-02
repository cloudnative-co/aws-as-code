import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2')
import { IVpc, ISecurityGroup, IInstance } from '@aws-cdk/aws-ec2';
import { IRole } from '@aws-cdk/aws-iam';
import { CfnOutput, Fn } from '@aws-cdk/core'

interface ComputerStackProps extends cdk.StackProps {
  vpc: IVpc,
  addsRole: IRole,
};

export class ComputerStack extends cdk.Stack {
  public readonly addsInstance: IInstance;
  public readonly addsPrivateIpAddress: CfnOutput;

  constructor(scope: cdk.Construct, id: string, props: ComputerStackProps) {
    super(scope, id, props);

    // Security Groups
    const addsSg = ec2.SecurityGroup.fromSecurityGroupId(this, "adds-sg", Fn.importValue("adds-sg-id"));
    const internalSg = ec2.SecurityGroup.fromSecurityGroupId(this, "internal-sg", Fn.importValue("internal-sg-id"));
    const remoteAccessSg = ec2.SecurityGroup.fromSecurityGroupId(this, "remote-access-sg", Fn.importValue("remote-access-sg-id"));

    // EC2 Instance Parameters
    const uiType = process.env.CDK_MY_UI_TYPE || "cli";
    const instanceParams = this.node.tryGetContext(uiType);

    // EC2 Instance
    const adds = new ec2.Instance(this, 'adds', {
      vpc: props.vpc,
      instanceType: ec2.InstanceType.of(instanceParams.instanceClass, instanceParams.instanceSize),
      machineImage: new ec2.WindowsImage(instanceParams.windowsAmiVersion),
      securityGroup: addsSg,
      role: props.addsRole
    });
    adds.addSecurityGroup(remoteAccessSg);
    adds.addSecurityGroup(internalSg);

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
