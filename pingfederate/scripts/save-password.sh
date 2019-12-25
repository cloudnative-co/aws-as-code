#!/bin/bash

read -sp 'Password for Directory Services Resotore Mode: ' passvar
echo
aws ssm put-parameter --name "DSRMPassword" --value ${passvar} --type SecureString
if [ $? == 0 ]; then
    aws ssm get-parameter --name "DSRMPassword"
fi