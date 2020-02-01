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
        cluster.addCapacity('spot' {
            maxCapacity: 1,
            minCapacity: 1,
            desiredCapacity: 1,
            instanceType: new ec2.InstanceType('')
        })

        const taskDefinition = new ecs.Ec2TaskDefinition(this, 'PingFederateTask')
        taskDefinition.addContainer('PFContainer', {
            image: ecs.ContainerImage.fromRegistry("pingidentity/pingfederate:9.3.3"),
            memoryLimitMiB: 512
        })

        const ecsService = new ecs.Ec2Service(this, 'Service', {
            cluster,
            taskDefinition
        })
    }
}
