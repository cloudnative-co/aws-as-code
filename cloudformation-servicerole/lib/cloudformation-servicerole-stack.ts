import * as cdk from '@aws-cdk/core';
import iam = require('@aws-cdk/aws-iam');

export class CloudformationServiceroleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    var document = iam.PolicyDocument.fromJson(
      {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Action": [
              "iam:GetRole",
              "iam:PassRole",
              "iam:DetachRolePolicy",
              "iam:DeleteRolePolicy",
              "iam:CreateRole",
              "iam:DeleteRole",
              "iam:AttachRolePolicy",
              "iam:PutRolePolicy"
            ],
            "Resource": "*"
          }
        ]
      }
    );

    var policy = new iam.ManagedPolicy(this, "MinimumIamPolicyForCloudFormation", {
      description: "Minimum IAM Policy for CloudFormation Service Role",
      managedPolicyName: "MinimumIamPolicyForCloudFormation",
      document: document,
    });

    var role = new iam.Role(this, "CloudFormationServiceRole", {
      description: "CloudFormation Service Role",
      roleName: "CloudFormationServiceRole",
      assumedBy: new iam.ServicePrincipal('cloudformation.amazonaws.com'),
      path: "/service-role/",
      managedPolicies: [
        policy,
        iam.ManagedPolicy.fromAwsManagedPolicyName("PowerUserAccess"),
      ]
    })
  }
}
