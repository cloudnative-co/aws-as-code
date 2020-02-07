#!/bin/sh

aws ec2 export-client-vpn-client-configuration --client-vpn-endpoint-id ${CLIENT_VPN_ENDPOINT_ID} --output text > client-config.ovpn