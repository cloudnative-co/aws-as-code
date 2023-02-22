import cdk = require('@aws-cdk/core');
import { CfnDocument } from '@aws-cdk/aws-ssm';
import { CfnOutput, Fn } from '@aws-cdk/core';

export class ManagementStack extends cdk.Stack {
  public readonly installAddsDocument: CfnDocument;
  public readonly setupSsmUserDocument: CfnDocument;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // SSM Document
    const install_adds_doc_json = require("../scripts/install-adds-forest.json");
    this.installAddsDocument = new CfnDocument(this, "install-adds-doc", {
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
    this.setupSsmUserDocument = new CfnDocument(this, "setup-ssm-user", {
      documentType: "Command",
      content: setup_ssm_user_doc_json,
      tags: [
        {
          key: "Name",
          value: "setup-ssm-user"
        }
      ]
    });

    new CfnOutput(this, "installaddsdoc", {
      exportName: process.env.CDK_MY_PREFIX + "installaddsdoc",
      value: this.installAddsDocument.logicalId,
      description: "Adds Install doc"
    });

    new CfnOutput(this, "setupssmuser", {
      exportName: process.env.CDK_MY_PREFIX + "setupssmuser",
      value: this.setupSsmUserDocument.logicalId,
      description: "Setup SSM User"
    });
  }
}
