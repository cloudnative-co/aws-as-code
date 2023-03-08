import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';

import { Construct } from 'constructs';

export class IdentityStack extends cdk.Stack {
  public readonly addsRole: iam.IRole;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // IAM Role
    const role = new iam.Role(this, "adds-role", {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMManagedInstanceCore"),
        iam.ManagedPolicy.fromAwsManagedPolicyName("CloudWatchAgentServerPolicy")
      ],
    });
    cdk.Tags.of(role).add("ssmmanaged", "true");
    this.addsRole = role;

    // Policy for Secrets Manager
    const secrets_policy_stat1 = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW
    });
    secrets_policy_stat1.addActions(
      "secretsmanager:GetResourcePolicy",
      "secretsmanager:GetSecretValue",
      "secretsmanager:DescribeSecret",
      "secretsmanager:ListSecretVersionIds"
    );
    secrets_policy_stat1.addResources("arn:aws:secretsmanager:*:*:secret:*");

    const secrets_policy_stat2 = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW
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
