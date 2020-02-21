#!/bin/bash

RESULT_SERVER=`aws --profile cn-prod acm import-certificate --certificate file://${CDK_MY_SERVER_CERT_FILE} --private-key file://${CDK_MY_SERVER_KEY_FILE} --certificate-chain file://${CDK_MY_CA_CERT_FILE} --region ap-northeast-1 --debug`
echo "Imported Server Certificate"
echo ${RESULT_SERVER}

RESULT_CLIENT=`aws --profile cn-prod acm import-certificate --certificate file://${CDK_MY_SERVER_CERT_FILE} --private-key file://${CDK_MY_SERVER_KEY_FILE} --certificate-chain file://${CDK_MY_CA_CERT_FILE} --region ap-northeast-1 --debug`
echo "Imported Client Certificate"
echo ${RESULT_CLIENT}
