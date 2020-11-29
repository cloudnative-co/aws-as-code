#!/bin/bash

ADDS_INSTANCE_ID=`aws cloudformation describe-stacks --stack-name ${CDK_MY_PREFIX}ComputerStack --query 'Stacks[0].Outputs[?OutputKey==\`addsinstanceid\`].OutputValue|[0]' --output text`
aws ssm start-session --document-name AWS-StartPortForwardingSession --parameters "portNumber=3389,localPortNumber=13389" --target ${ADDS_INSTANCE_ID}
