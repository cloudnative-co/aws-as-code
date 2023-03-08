import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

interface DhcpStackProps extends cdk.StackProps {
  vpc: ec2.IVpc,
  addsPrivateIpAddress: cdk.CfnOutput
};

export class DhcpStack extends cdk.Stack {
  public readonly dhcpOptionSet: ec2.CfnDHCPOptions;

  constructor(scope: Construct, id: string, props: DhcpStackProps) {
    super(scope, id, props);

    const adds_private_ip_address = cdk.Fn.importValue(process.env.CDK_MY_PREFIX + props.addsPrivateIpAddress.toString().split("/")[1]);
    const cfn_dhcp_option_set = new ec2.CfnDHCPOptions(this, "adds-dhcp-options", {
      domainName: process.env.CDK_MY_DOMAIN_NAME,
      domainNameServers: [adds_private_ip_address],
      netbiosNameServers: [adds_private_ip_address],
      ntpServers: [adds_private_ip_address]
    });

    const dhcp_vpc_assoc = new ec2.CfnVPCDHCPOptionsAssociation(this, "dhcp-vpc-assoc", {
      dhcpOptionsId: cfn_dhcp_option_set.ref,
      vpcId: props.vpc.vpcId,
    });
  }
}
