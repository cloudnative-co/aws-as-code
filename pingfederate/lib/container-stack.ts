import cdk = require('@aws-cdk/core')
import ecs = require('@aws-cdk/aws-ecs')
import ec2 = require('@aws-cdk/aws-ec2')
import { IVpc } from '@aws-cdk/aws-ec2'

interface ContainerStackProps extends cdk.StackProps {
    vpc: IVpc
}

export class ContainerStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: ContainerStackProps) {
        super(scope, id, props)

        const cluster = new ecs.Cluster(this, 'PingFederateCluster', {
            clusterName: "PingFederate",
            vpc: props.vpc
        })

        const taskDefinition = new ecs.Ec2TaskDefinition(this, 'PingFederateTask')
        taskDefinition.addContainer('PFContainer', {
            image: ecs.ContainerImage.fromRegistry("pingidentity/pingfederate:9.3.3", {

            })
        })
    }
}