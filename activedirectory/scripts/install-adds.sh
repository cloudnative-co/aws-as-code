#!/bin/bash

echo "Install and configuration Active Directory Domain Service for ${CDK_MY_DOMAIN_NAME} (${CDK_MY_DOMAIN_NETBIOS_NAME})"

ADDS_INSTANCE_ID=`aws cloudformation describe-stacks --stack-name ${CDK_MY_PREFIX}ComputerStack --query 'Stacks[0].Outputs[?OutputKey==\`addsinstanceid\`].OutputValue|[0]' --output text`
echo $ADDS_INSTANCE_ID

ADDS_INSTALL_DOCUMENT_NAME=`aws ssm list-documents --query 'DocumentIdentifiers[?Tags[?Key==\`Name\`].Value|[0]==\`install-adds-doc\`][]|[0].Name'|tr -d '"'`
echo $ADDS_INSTALL_DOCUMENT_NAME

RESULT=`aws ssm send-command --instance-ids "${ADDS_INSTANCE_ID}" --document-name "${ADDS_INSTALL_DOCUMENT_NAME}" --parameters "domainName=${CDK_MY_DOMAIN_NAME},domainNetBiosName=${CDK_MY_DOMAIN_NETBIOS_NAME},prefix=${CDK_MY_PREFIX}" --cloud-watch-output-config '{"CloudWatchOutputEnabled":true}'`

if [ -x `which jq` ]; then
  echo $RESULT | jq ". | { CommandId: .Command.CommandId, InstanceIds: .Command.InstanceIds}"
else
  echo $RESULT
fi
