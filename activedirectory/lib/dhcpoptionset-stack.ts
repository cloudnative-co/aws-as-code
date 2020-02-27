import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2')
import { Vpc, CfnDHCPOptions, CfnVPCDHCPOptionsAssociation } from '@aws-cdk/aws-ec2';

interface DHCPOptionSetStackProps extends cdk.StackProps {
  vpc: ec2.IVpc
  addsPrivateIpAddress: string
};

export class DHCPOptionSetStack extends cdk.Stack {
  public readonly dhcpOptionSet: CfnDHCPOptions;

  constructor(scope: cdk.Construct, id: string, props: DHCPOptionSetStackProps) {
    super(scope, id, props);

    // const adds_private_ip_address = process.env.CDK_MY_ADDS_PRIVATE_IP_ADDRESS || "10.100.0.4"
    const adds_private_ip_address = props.addsPrivateIpAddress;
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
