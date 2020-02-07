import * as cdk from '@aws-cdk/core';
import ec2 = require('@aws-cdk/aws-ec2');
import { CfnOutput, cfnTagToCloudFormation } from '@aws-cdk/core';
import { DESTRUCTION } from 'dns';

export class ClientvpnStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const endpoint = new ec2.CfnClientVpnEndpoint(this, "certauth", {
      authenticationOptions: [
        {
          type: "certificate-authentication",
          mutualAuthentication: {
            clientRootCertificateChainArn: process.env.CDK_MY_CLIENT_CERT_ARN || ""
          }
        }
      ],
      clientCidrBlock: process.env.CDK_MY_CLIENT_CIDR_BLOCK || "10.0.1.0/22",
      connectionLogOptions: {
        enabled: false,
      },
      serverCertificateArn: process.env.CDK_MY_SERVER_CERT_ARN || ""
    });

    const certauthassoc = new ec2.CfnClientVpnTargetNetworkAssociation(this, "certauthassoc", {
      clientVpnEndpointId: endpoint.ref,
      subnetId: process.env.CDK_MY_SUBNET_ID || ""
    });

    new ec2.CfnClientVpnAuthorizationRule(this, "certauthrule", {
      clientVpnEndpointId: endpoint.ref,
      targetNetworkCidr: process.env.CDK_MY_TARGET_CIDR || "10.0.0.0/16",
      authorizeAllGroups: true
    });

    const certauthroute = new ec2.CfnClientVpnRoute(this, "certauthroute", {
      clientVpnEndpointId: endpoint.ref,
      destinationCidrBlock: "0.0.0.0/0",
      targetVpcSubnetId: process.env.CDK_MY_SUBNET_ID || ""
    });
    certauthroute.addDependsOn(certauthassoc);

    new CfnOutput(this, "clientvpnendpointid", {
      value: endpoint.ref,
      description: "Client VPN Endpoint ID"
    });
  };
}
