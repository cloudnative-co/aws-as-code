import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');

interface PingFederateStackProps extends cdk.StackProps {
  vpc: ec2.IVpc,
  secretsPolicy: iam.IManagedPolicy,
}

export class PingFederateStack extends cdk.Stack {

  constructor(scope: cdk.Construct, id: string, props: PingFederateStackProps) {
    super(scope, id, props);

    const prefix = process.env.CDK_MY_PREFIX || "";
    const internalSg = ec2.SecurityGroup.fromSecurityGroupId(this, "internal-sg", cdk.Fn.importValue(prefix + "internal-sg-id"));
    const readSecretsPolicy = iam.ManagedPolicy.fromManagedPolicyArn(this, "readSecretsPolicy", cdk.Fn.importValue(prefix + "read-secrets-arn"));

    const pfSg = new ec2.SecurityGroup(this, "pf-sg", {
      vpc: props.vpc,
      securityGroupName: "pf-sg",
    });

    const pfRole = new iam.Role(this, "pf-role", {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMManagedInstanceCore"),
        iam.ManagedPolicy.fromAwsManagedPolicyName("CloudWatchAgentServerPolicy"),
        readSecretsPolicy
      ]
    });
    cdk.Tags.of(pfRole).add("ssmmanaged", "true");

    const pingfederate = new ec2.Instance(this, 'pingfederate', {
      vpc: props.vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3A, ec2.InstanceSize.LARGE),
      // machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
      machineImage: new ec2.LookupMachineImage({ name: "amzn2-ami-hvm-2.0.20200904.0-x86_64-gp2" }),
      securityGroup: pfSg,
      role: pfRole
    });
    pingfederate.addSecurityGroup(internalSg);

    new cdk.CfnOutput(this, "pfinstanceid", {
      value: pingfederate.instanceId,
      description: "PingFederate Instance ID"
    })
  }
}
