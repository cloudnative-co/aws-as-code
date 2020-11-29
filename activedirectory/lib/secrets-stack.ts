import cdk = require('@aws-cdk/core');
import secretsmanager = require('@aws-cdk/aws-secretsmanager')
import { ISecret } from '@aws-cdk/aws-secretsmanager';

export class SecretStack extends cdk.Stack {
  public readonly adminPassword: ISecret;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
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
