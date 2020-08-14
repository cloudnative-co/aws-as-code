import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2')
import iam = require('@aws-cdk/aws-iam')
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2')
import { IVpc, ISecurityGroup, IInstance, Protocol } from '@aws-cdk/aws-ec2';
import { IRole } from '@aws-cdk/aws-iam';
import { CfnOutput } from '@aws-cdk/core'
import { ApplicationProtocol, ListenerCertificate, InstanceTarget, HealthCheck } from '@aws-cdk/aws-elasticloadbalancingv2';

export class PingFederateStack extends cdk.Stack {

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpcId = process.env.MY_VPC_ID
    const vpc = ec2.Vpc.fromLookup(this, "vpc", {
      vpcId: vpcId
    })

    // IAM Role
    const pfRole = new iam.Role(this, "pf-role", {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMManagedInstanceCore"),
        iam.ManagedPolicy.fromAwsManagedPolicyName("CloudWatchAgentServerPolicy")
      ]
    });

    // Security Group
    const pfSg = new ec2.SecurityGroup(this, "pingfederate-sg", {
      vpc: vpc,
      securityGroupName: "pingfederate"
    });
    [9999, 9031, 8080].forEach(v => {
      pfSg.addIngressRule(albSg, ec2.Port.tcp(v), "pingfederate-alb");
    });

    const albSg = new ec2.SecurityGroup(this, "pingfederate-alb", {
      vpc: vpc,
      securityGroupName: "pingfederate-alb"
    });
    [443, 9999].forEach(v => {
      pfSg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(v));
    });

    // EC2 Instance
    const pingfederate = new ec2.Instance(this, 'pingfederate', {
      vpc: vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3A, ec2.InstanceSize.MEDIUM),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2
      }),
    });
    pingfederate.addSecurityGroup(pfSg);

    // alb Instance
    const alb = new elbv2.ApplicationLoadBalancer(this, "pingfederate-alb", {
      loadBalancerName: "pingfederate-alb",
      vpc: vpc,
      internetFacing: true,
      securityGroup: albSg
    })

    const certArn = process.env.ALB_CERTIFICATE_ARN || ""
    const engineListener = alb.addListener("pingfederate-engine", {
      port: 443,
      protocol: ApplicationProtocol.HTTPS,
      certificates: [ListenerCertificate.fromArn(certArn)]
    })

    const consoleListener = alb.addListener("pingfederate-console", {
      port: 9999,
      protocol: ApplicationProtocol.HTTPS,
      certificates: [ListenerCertificate.fromArn(certArn)]
    })

    const healthcheckParams = {
      path: "/pf/heartbeat.ping",
      protocol: elbv2.Protocol.HTTP
    }

    const engineTarget = engineListener.addTargets("pingfederate-engine", {
      targets: [new InstanceTarget(pingfederate.instanceId)],
      port: 8080,
      protocol: ApplicationProtocol.HTTP,
    })
    engineTarget.configureHealthCheck(healthcheckParams)

    const consoleTarget = consoleListener.addTargets("pingfederate-console", {
      targets: [new InstanceTarget(pingfederate.instanceId)],
      port: 9999,
      protocol: ApplicationProtocol.HTTPS,
    })
    consoleTarget.configureHealthCheck(healthcheckParams)

    new CfnOutput(this, "pfinstanceid", {
      value: pingfederate.instanceId,
      description: "PingFederate Instance ID"
    });

    new CfnOutput(this, "albcname", {
      value: alb.loadBalancerDnsName,
      description: "ALB CNAME"
    })
  }
}
