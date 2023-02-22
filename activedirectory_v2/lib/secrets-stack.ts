import * as cdk from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

import { Construct } from 'constructs';

export class SecretStack extends cdk.Stack {
  public readonly adminPassword: secretsmanager.ISecret;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Generate DSRM Password
    this.adminPassword = new secretsmanager.Secret(this, "AdminPassword", {
      secretName: process.env.CDK_MY_PREFIX + "AdminPassword",
      description: "Administrator and Directory Service Restore Mode Password",
      generateSecretString: {
        passwordLength: 16,
        excludePunctuation: false
      }
    })
  }
}
