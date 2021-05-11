"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const iam = require("@aws-cdk/aws-iam");
class QuicksightServiceRoleStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        var quicksight_service_role = new iam.Role(this, "aws-quicksight-service-role-v0", {
            roleName: 'aws-quicksight-service-role-v0',
            assumedBy: new iam.ServicePrincipal('quicksight.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromManagedPolicyArn(this, "AWSQuicksightAthenaAccess", "arn:aws:iam::aws:policy/service-role/AWSQuicksightAthenaAccess")
            ]
        });
        var rds_policy_statement = new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
        });
        rds_policy_statement.addActions("rds:Describe*");
        rds_policy_statement.addAllResources();
        var rds_policy = new iam.ManagedPolicy(this, "AWSQuickSightRDSPolicy", {
            path: "/service-role/",
            roles: [quicksight_service_role],
            managedPolicyName: "AWSQuickSightRDSPolicy",
            statements: [rds_policy_statement]
        });
        var iam_policy_statement = new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
        });
        iam_policy_statement.addActions("iam:List*");
        iam_policy_statement.addAllResources();
        var iam_policy = new iam.ManagedPolicy(this, "AWSQuickSightIAMPolicy", {
            path: "/service-role/",
            roles: [quicksight_service_role],
            managedPolicyName: "AWSQuickSightIAMPolicy",
            statements: [iam_policy_statement]
        });
        var redshift_policy_statement = new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
        });
        redshift_policy_statement.addActions("redshift:Describe*");
        redshift_policy_statement.addAllResources();
        var redshift_policy = new iam.ManagedPolicy(this, "AWSQuickSightRedshiftPolicy", {
            path: "/service-role/",
            roles: [quicksight_service_role],
            managedPolicyName: "AWSQuickSightRedshiftPolicy",
            statements: [redshift_policy_statement]
        });
    }
}
exports.QuicksightServiceRoleStack = QuicksightServiceRoleStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpY2tzaWdodC1zZXJ2aWNlLXJvbGUtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJxdWlja3NpZ2h0LXNlcnZpY2Utcm9sZS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFxQztBQUNyQyx3Q0FBeUM7QUFFekMsTUFBYSwwQkFBMkIsU0FBUSxHQUFHLENBQUMsS0FBSztJQUN2RCxZQUFZLEtBQW9CLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQ2xFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLElBQUksdUJBQXVCLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxnQ0FBZ0MsRUFBRTtZQUNqRixRQUFRLEVBQUUsZ0NBQWdDO1lBQzFDLFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQywwQkFBMEIsQ0FBQztZQUMvRCxlQUFlLEVBQUU7Z0JBQ2YsR0FBRyxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsMkJBQTJCLEVBQUUsZ0VBQWdFLENBQUM7YUFDNUk7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLG9CQUFvQixHQUFHLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUNqRCxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLO1NBQ3pCLENBQUMsQ0FBQztRQUNILG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNqRCxvQkFBb0IsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUV2QyxJQUFJLFVBQVUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLHdCQUF3QixFQUFFO1lBQ3JFLElBQUksRUFBRSxnQkFBZ0I7WUFDdEIsS0FBSyxFQUFFLENBQUMsdUJBQXVCLENBQUM7WUFDaEMsaUJBQWlCLEVBQUUsd0JBQXdCO1lBQzNDLFVBQVUsRUFBRSxDQUFDLG9CQUFvQixDQUFDO1NBQ25DLENBQUMsQ0FBQztRQUVILElBQUksb0JBQW9CLEdBQUcsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ2pELE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUs7U0FDekIsQ0FBQyxDQUFDO1FBQ0gsb0JBQW9CLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzdDLG9CQUFvQixDQUFDLGVBQWUsRUFBRSxDQUFDO1FBRXZDLElBQUksVUFBVSxHQUFHLElBQUksR0FBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsd0JBQXdCLEVBQUU7WUFDckUsSUFBSSxFQUFFLGdCQUFnQjtZQUN0QixLQUFLLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQztZQUNoQyxpQkFBaUIsRUFBRSx3QkFBd0I7WUFDM0MsVUFBVSxFQUFFLENBQUMsb0JBQW9CLENBQUM7U0FDbkMsQ0FBQyxDQUFDO1FBRUgsSUFBSSx5QkFBeUIsR0FBRyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDdEQsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSztTQUN6QixDQUFDLENBQUM7UUFDSCx5QkFBeUIsQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUMzRCx5QkFBeUIsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUU1QyxJQUFJLGVBQWUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLDZCQUE2QixFQUFFO1lBQy9FLElBQUksRUFBRSxnQkFBZ0I7WUFDdEIsS0FBSyxFQUFFLENBQUMsdUJBQXVCLENBQUM7WUFDaEMsaUJBQWlCLEVBQUUsNkJBQTZCO1lBQ2hELFVBQVUsRUFBRSxDQUFDLHlCQUF5QixDQUFDO1NBQ3hDLENBQUMsQ0FBQztJQUVMLENBQUM7Q0FDRjtBQXBERCxnRUFvREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgaWFtID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWlhbScpO1xuXG5leHBvcnQgY2xhc3MgUXVpY2tzaWdodFNlcnZpY2VSb2xlU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgdmFyIHF1aWNrc2lnaHRfc2VydmljZV9yb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsIFwiYXdzLXF1aWNrc2lnaHQtc2VydmljZS1yb2xlLXYwXCIsIHtcbiAgICAgIHJvbGVOYW1lOiAnYXdzLXF1aWNrc2lnaHQtc2VydmljZS1yb2xlLXYwJyxcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdxdWlja3NpZ2h0LmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIG1hbmFnZWRQb2xpY2llczogW1xuICAgICAgICBpYW0uTWFuYWdlZFBvbGljeS5mcm9tTWFuYWdlZFBvbGljeUFybih0aGlzLCBcIkFXU1F1aWNrc2lnaHRBdGhlbmFBY2Nlc3NcIiwgXCJhcm46YXdzOmlhbTo6YXdzOnBvbGljeS9zZXJ2aWNlLXJvbGUvQVdTUXVpY2tzaWdodEF0aGVuYUFjY2Vzc1wiKVxuICAgICAgXVxuICAgIH0pO1xuXG4gICAgdmFyIHJkc19wb2xpY3lfc3RhdGVtZW50ID0gbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgIH0pO1xuICAgIHJkc19wb2xpY3lfc3RhdGVtZW50LmFkZEFjdGlvbnMoXCJyZHM6RGVzY3JpYmUqXCIpO1xuICAgIHJkc19wb2xpY3lfc3RhdGVtZW50LmFkZEFsbFJlc291cmNlcygpO1xuXG4gICAgdmFyIHJkc19wb2xpY3kgPSBuZXcgaWFtLk1hbmFnZWRQb2xpY3kodGhpcywgXCJBV1NRdWlja1NpZ2h0UkRTUG9saWN5XCIsIHtcbiAgICAgIHBhdGg6IFwiL3NlcnZpY2Utcm9sZS9cIixcbiAgICAgIHJvbGVzOiBbcXVpY2tzaWdodF9zZXJ2aWNlX3JvbGVdLFxuICAgICAgbWFuYWdlZFBvbGljeU5hbWU6IFwiQVdTUXVpY2tTaWdodFJEU1BvbGljeVwiLFxuICAgICAgc3RhdGVtZW50czogW3Jkc19wb2xpY3lfc3RhdGVtZW50XVxuICAgIH0pO1xuXG4gICAgdmFyIGlhbV9wb2xpY3lfc3RhdGVtZW50ID0gbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgIH0pO1xuICAgIGlhbV9wb2xpY3lfc3RhdGVtZW50LmFkZEFjdGlvbnMoXCJpYW06TGlzdCpcIik7XG4gICAgaWFtX3BvbGljeV9zdGF0ZW1lbnQuYWRkQWxsUmVzb3VyY2VzKCk7XG5cbiAgICB2YXIgaWFtX3BvbGljeSA9IG5ldyBpYW0uTWFuYWdlZFBvbGljeSh0aGlzLCBcIkFXU1F1aWNrU2lnaHRJQU1Qb2xpY3lcIiwge1xuICAgICAgcGF0aDogXCIvc2VydmljZS1yb2xlL1wiLFxuICAgICAgcm9sZXM6IFtxdWlja3NpZ2h0X3NlcnZpY2Vfcm9sZV0sXG4gICAgICBtYW5hZ2VkUG9saWN5TmFtZTogXCJBV1NRdWlja1NpZ2h0SUFNUG9saWN5XCIsXG4gICAgICBzdGF0ZW1lbnRzOiBbaWFtX3BvbGljeV9zdGF0ZW1lbnRdXG4gICAgfSk7XG5cbiAgICB2YXIgcmVkc2hpZnRfcG9saWN5X3N0YXRlbWVudCA9IG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICB9KTtcbiAgICByZWRzaGlmdF9wb2xpY3lfc3RhdGVtZW50LmFkZEFjdGlvbnMoXCJyZWRzaGlmdDpEZXNjcmliZSpcIik7XG4gICAgcmVkc2hpZnRfcG9saWN5X3N0YXRlbWVudC5hZGRBbGxSZXNvdXJjZXMoKTtcblxuICAgIHZhciByZWRzaGlmdF9wb2xpY3kgPSBuZXcgaWFtLk1hbmFnZWRQb2xpY3kodGhpcywgXCJBV1NRdWlja1NpZ2h0UmVkc2hpZnRQb2xpY3lcIiwge1xuICAgICAgcGF0aDogXCIvc2VydmljZS1yb2xlL1wiLFxuICAgICAgcm9sZXM6IFtxdWlja3NpZ2h0X3NlcnZpY2Vfcm9sZV0sXG4gICAgICBtYW5hZ2VkUG9saWN5TmFtZTogXCJBV1NRdWlja1NpZ2h0UmVkc2hpZnRQb2xpY3lcIixcbiAgICAgIHN0YXRlbWVudHM6IFtyZWRzaGlmdF9wb2xpY3lfc3RhdGVtZW50XVxuICAgIH0pO1xuXG4gIH1cbn1cbiJdfQ==