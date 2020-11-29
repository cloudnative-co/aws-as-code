import cdk = require('@aws-cdk/core');
import iam = require('@aws-cdk/aws-iam')
import { IRole, ServicePrincipal, Effect } from '@aws-cdk/aws-iam';
import { Tags } from '@aws-cdk/core';

export class IdentityStack extends cdk.Stack {
  public readonly addsRole: IRole;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // IAM Role
    const role = new iam.Role(this, "adds-role", {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMManagedInstanceCore"),
        iam.ManagedPolicy.fromAwsManagedPolicyName("CloudWatchAgentServerPolicy")
      ],
    });
    Tags.of(role).add("ssmmanaged", "true");
    this.addsRole = role;

    // Policy for Secrets Manager
    const secrets_policy_stat1 = new iam.PolicyStatement({
      effect: Effect.ALLOW
    });
    secrets_policy_stat1.addActions(
      "secretsmanager:GetResourcePolicy",
      "secretsmanager:GetSecretValue",
      "secretsmanager:DescribeSecret",
      "secretsmanager:ListSecretVersionIds"
    );
    secrets_policy_stat1.addResources("arn:aws:secretsmanager:*:*:secret:*");

    const secrets_policy_stat2 = new iam.PolicyStatement({
      effect: Effect.ALLOW
    });
    secrets_policy_stat2.addActions("secretsmanager:ListSecrets");
    secrets_policy_stat2.addAllResources();

    const secrets_policy = new iam.ManagedPolicy(this, "read-secrets", {
      description: "Allow Read Secrets from Secrets Manager",
      roles: [this.addsRole],
      statements: [secrets_policy_stat1, secrets_policy_stat2]
    });
    secrets_policy.attachToRole(this.addsRole);
  }
}
