import * as cdk from '@aws-cdk/core';
import iam = require('@aws-cdk/aws-iam');

export class QuicksightServiceRoleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    var quicksight_service_role = new iam.Role(this, "aws-quicksight-service-role-v0", {
      roleName: 'aws-quicksight-service-role-v0',
      assumedBy: new iam.ServicePrincipal('quicksight.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromManagedPolicyArn(this, "AWSQuicksightAthenaAccess", "arn:aws:iam::aws:policy/service-role/AWSQuicksightAthenaAccess")
      ]
    });

    var rds_policy_statement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
    });
    rds_policy_statement.addActions("rds:Describe*");
    rds_policy_statement.addAllResources();

    var rds_policy = new iam.ManagedPolicy(this, "AWSQuickSightRDSPolicy", {
      path: "/service-role/",
      roles: [quicksight_service_role],
      managedPolicyName: "AWSQuickSightRDSPolicy",
      statements: [rds_policy_statement]
    });

    var iam_policy_statement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
    });
    iam_policy_statement.addActions("iam:List*");
    iam_policy_statement.addAllResources();

    var iam_policy = new iam.ManagedPolicy(this, "AWSQuickSightIAMPolicy", {
      path: "/service-role/",
      roles: [quicksight_service_role],
      managedPolicyName: "AWSQuickSightIAMPolicy",
      statements: [iam_policy_statement]
    });

    var redshift_policy_statement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
    });
    redshift_policy_statement.addActions("redshift:Describe*");
    redshift_policy_statement.addAllResources();

    var redshift_policy = new iam.ManagedPolicy(this, "AWSQuickSightRedshiftPolicy", {
      path: "/service-role/",
      roles: [quicksight_service_role],
      managedPolicyName: "AWSQuickSightRedshiftPolicy",
      statements: [redshift_policy_statement]
    });

  }
}
