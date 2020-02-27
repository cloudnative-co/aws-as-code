#!/bin/bash

ADDS_INSTANCE_ID=`aws cloudformation describe-stacks --stack-name AddsComputerStack --query 'Stacks[0].Outputs[?OutputKey==\`addsinstanceid\`].OutputValue|[0]' --output text`
echo "Setup SSM User for ${ADDS_INSTANCE_ID}" 

SETUP_SSM_USER_DOCUMENT_NAME=`aws ssm list-documents --query 'DocumentIdentifiers[?Tags[?Key==\`Name\`].Value|[0]==\`setup-ssm-user\`][]|[0].Name'|tr -d '"'`
echo $SETUP_SSM_USER_DOCUMENT_NAME

RESULT=`aws ssm send-command --instance-ids "${ADDS_INSTANCE_ID}" --document-name "${SETUP_SSM_USER_DOCUMENT_NAME}" --cloud-watch-output-config '{"CloudWatchOutputEnabled":true}'`
echo $RESULT
