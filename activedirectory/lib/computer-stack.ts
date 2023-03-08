import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

interface ComputerStackProps extends cdk.StackProps {
  vpc: ec2.IVpc,
  addsRole: iam.IRole,
};

export class ComputerStack extends cdk.Stack {
  public readonly addsInstance: ec2.IInstance;
  public readonly addsPrivateIpAddress: cdk.CfnOutput;

  constructor(scope: Construct, id: string, props: ComputerStackProps) {
    super(scope, id, props);

    // Security Groups
    const addsSg = ec2.SecurityGroup.fromSecurityGroupId(this, "adds-sg", cdk.Fn.importValue(process.env.CDK_MY_PREFIX + "adds-sg-id"));
    const internalSg = ec2.SecurityGroup.fromSecurityGroupId(this, "internal-sg", cdk.Fn.importValue(process.env.CDK_MY_PREFIX + "internal-sg-id"));
    const remoteAccessSg = ec2.SecurityGroup.fromSecurityGroupId(this, "remote-access-sg", cdk.Fn.importValue(process.env.CDK_MY_PREFIX + "remote-access-sg-id"));

    // EC2 Instance Parameters
    const uiType = process.env.CDK_MY_UI_TYPE || "cli";
    const instanceParams = this.node.tryGetContext(uiType);

    // EC2 Key Pair
    const keypair = new ec2.CfnKeyPair(this, 'CfnKeyPair', {
        keyName: 'adds-key-pair',
    })
    keypair.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY)

    // EC2 Instance
    const adds = new ec2.Instance(this, 'adds', {
      vpc: props.vpc,
      instanceType: ec2.InstanceType.of(instanceParams.instanceClass, instanceParams.instanceSize),
      machineImage: new ec2.WindowsImage(instanceParams.windowsAmiVersion),
      securityGroup: addsSg,
      role: props.addsRole,
      keyName: cdk.Token.asString(keypair.ref)
    });
    adds.addSecurityGroup(remoteAccessSg);
    adds.addSecurityGroup(internalSg);

    new cdk.CfnOutput(this, "addsinstanceid", {
      value: adds.instanceId,
      description: "ADDS Instance ID"
    });


    new cdk.CfnOutput(this, 'GetSSHKeyCommand', {
      value: `aws ssm get-parameter --name /ec2/keypair/${keypair.getAtt('KeyPairId')} --region ${this.region} --with-decryption --query Parameter.Value --output text`,
    })

    this.addsPrivateIpAddress = new cdk.CfnOutput(this, "addsprivateipaddress", {
      exportName: process.env.CDK_MY_PREFIX + "addsprivateipaddress",
      value: adds.instancePrivateIp,
      description: "ADDS Instance Private IP Address"
    });
  }
}
