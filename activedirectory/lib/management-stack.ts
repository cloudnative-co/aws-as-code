import * as cdk from 'aws-cdk-lib';
import { aws_ssm as ssm } from 'aws-cdk-lib';

import { Construct } from 'constructs';

export class ManagementStack extends cdk.Stack {
  public readonly installAddsDocument: ssm.CfnDocument;
  public readonly setupSsmUserDocument: ssm.CfnDocument;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // SSM Document
    const install_adds_doc_json = require("../scripts/install-adds-forest.json");
    this.installAddsDocument = new ssm.CfnDocument(this, "install-adds-doc", {
      documentType: "Command",
      content: install_adds_doc_json,
      tags: [
        {
          key: "Name",
          value: "install-adds-doc"
        }
      ]
    });

    const setup_ssm_user_doc_json = require("../scripts/setup-ssm-user.json");
    this.setupSsmUserDocument = new ssm.CfnDocument(this, "setup-ssm-user", {
      documentType: "Command",
      content: setup_ssm_user_doc_json,
      tags: [
        {
          key: "Name",
          value: "setup-ssm-user"
        }
      ]
    });

    new cdk.CfnOutput(this, "installaddsdoc", {
      exportName: process.env.CDK_MY_PREFIX + "installaddsdoc",
      value: this.installAddsDocument.logicalId,
      description: "Adds Install doc"
    });

    new cdk.CfnOutput(this, "setupssmuser", {
      exportName: process.env.CDK_MY_PREFIX + "setupssmuser",
      value: this.setupSsmUserDocument.logicalId,
      description: "Setup SSM User"
    });
  }
}
