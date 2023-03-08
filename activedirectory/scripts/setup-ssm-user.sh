#!/bin/bash

ADDS_INSTANCE_ID=`aws cloudformation describe-stacks --stack-name ${CDK_MY_PREFIX}ComputerStack --query 'Stacks[0].Outputs[?OutputKey==\`addsinstanceid\`].OutputValue|[0]' --output text`
echo "Setup SSM User for ${ADDS_INSTANCE_ID}"

SETUP_SSM_USER_DOCUMENT_NAME=`aws cloudformation describe-stack-resource --stack-name ${CDK_MY_PREFIX}ManagementStack --logical-resource-id setupssmuser --query 'StackResourceDetail.PhysicalResourceId'|tr -d '"'`
echo $SETUP_SSM_USER_DOCUMENT_NAME

RESULT=`aws ssm send-command --instance-ids "${ADDS_INSTANCE_ID}" --document-name "${SETUP_SSM_USER_DOCUMENT_NAME}" --parameters "domainNetBiosName=${CDK_MY_DOMAIN_NETBIOS_NAME},prefix=${CDK_MY_PREFIX}" --cloud-watch-output-config '{"CloudWatchOutputEnabled":true}'`

if [ -x `which jq` ]; then
  echo $RESULT | jq ". | { CommandId: .Command.CommandId, InstanceIds: .Command.InstanceIds }"
else
  echo $RESULT
fi
