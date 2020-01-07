import cdk = require('@aws-cdk/core');
import { CfnDocument } from '@aws-cdk/aws-ssm';

export class ManagementStack extends cdk.Stack {
  public readonly installAddsDocument: CfnDocument;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // SSM Document
    const install_adds_doc_json = require("../scripts/install-adds-forest.json");
    this.installAddsDocument = new CfnDocument(this, "install-adds-doc", {
      documentType: "Automation",
      content: install_adds_doc_json,
      tags: [
        {
          key: "Name",
          value: "install-adds-doc"
        }
      ]
    });
  }
}
