import cdk = require('@aws-cdk/core');
import { IVpc, CfnDHCPOptions, CfnVPCDHCPOptionsAssociation } from '@aws-cdk/aws-ec2';
import { CfnOutput, Fn } from '@aws-cdk/core';

interface DhcpStackProps extends cdk.StackProps {
  vpc: IVpc,
  addsPrivateIpAddress: CfnOutput
};

export class DhcpStack extends cdk.Stack {
  public readonly dhcpOptionSet: CfnDHCPOptions;

  constructor(scope: cdk.Construct, id: string, props: DhcpStackProps) {
    super(scope, id, props);

    // const adds_private_ip_address = process.env.CDK_MY_ADDS_PRIVATE_IP_ADDRESS || "10.100.0.4"
    const adds_private_ip_address = Fn.importValue(props.addsPrivateIpAddress.toString().split("/")[1]);
    const cfn_dhcp_option_set = new CfnDHCPOptions(this, "adds-dhcp-options", {
      domainName: process.env.CDK_MY_DOMAIN_NAME,
      domainNameServers: [adds_private_ip_address],
      netbiosNameServers: [adds_private_ip_address],
      ntpServers: [adds_private_ip_address]
    });

    const dhcp_vpc_assoc = new CfnVPCDHCPOptionsAssociation(this, "dhcp-vpc-assoc", {
      dhcpOptionsId: cfn_dhcp_option_set.ref,
      vpcId: props.vpc.vpcId,
    });
  }
}
