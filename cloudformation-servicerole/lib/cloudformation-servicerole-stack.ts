import * as cdk from '@aws-cdk/core';
import iam = require('@aws-cdk/aws-iam');
import { CfnOutput } from '@aws-cdk/core';

export class CloudformationServiceroleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    var document1 = iam.PolicyDocument.fromJson(
      {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Action": [
              "cloudformation:*",
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

    var policy1 = new iam.ManagedPolicy(this, "MinimumIamPolicyForCloudFormation", {
      description: "Minimum IAM Policy for CloudFormation Service Role",
      managedPolicyName: "MinimumIamPolicyForCloudFormation",
      document: document1,
    });

    var document2 = iam.PolicyDocument.fromJson(
      {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Action": [
              "s3:*",
              "lambda:*",
              "kms:*",
              "logs:*",
              "ssm:*",
              "apigateway:*",
              "sqs:*",
              "events:*"
            ],
            "Resource": "*"
          }
        ]
      }
    );

    var policy2 = new iam.ManagedPolicy(this, "ToolsDeployPolicy", {
      description: "IAM Policy for deploy",
      managedPolicyName: "ToolsDeployPolicy",
      document: document2,
    });

    var role = new iam.Role(this, "CloudFormationServiceRole", {
      description: "CloudFormation Service Role",
      roleName: "CloudFormationServiceRole",
      assumedBy: new iam.ServicePrincipal('cloudformation.amazonaws.com'),
      path: "/service-role/",
      managedPolicies: [
        policy1,
        policy2,
      ]
    });

    new CfnOutput(this, "ServiceRoleArn", {
      value: role.roleArn,
      description: "CloudFormationServiceRoleArn"
    });
  }
}
