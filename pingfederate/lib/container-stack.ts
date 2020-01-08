import cdk = require('@aws-cdk/core')

export class ContainerStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

    }
}