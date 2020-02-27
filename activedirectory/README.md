# Active Directory Stack

## 概要

Windows Serverインスタンスを起動して、Active Directory Domain Serviceのインストールまで実施するStack

## 構成

* VPCを作成する
* ADDSが稼働するEC2を作成する
* ADDSのEC2が利用するIAM Roleを作成する
* ADDSをインストールするPowerShell Scriptを定義するSSM Documentを作成する
* ADDS構成時に使うパスワードを生成するSecrets ManagerのSecretを作成する
* ADDSのDNSを参照するためのDHCP Option Setの作成と連携

## 使い方

* `.envrc.example` を `.envrc` にコピーする。
* `.envrc` の中身を、必要に応じて修正する。
* AddsIdentityStack, AddsManagementStack, AddsNetworkStack, AddsSecretStack, ComputerStackをdeployする。
* ADDSのインスタンスが起動して、SSMのマネージドインスタンスに登録されたら、 `./scripts/install-adds.sh` を実行する。
* `./scripts/setup-ssm-user.sh` を実行する。
* AddsDHCPOptionSetStackをdeployする。

## 注意点

* ADDSが起動する前にDHCP Options Setを作成してしまうと、名前解決できなくなってしまう。
  * その場合は、一度 default のDHCP Option Setにアタッチし直すと、AmazonのDNSが利用されるようになる。
* 利用しているAMIは、Windows Server 2019 Core (English)なので、必要に応じて変更すること。
* SSM経由で管理する前提なので、KeyPairは未設定なので、必要な場合は指定すること。

## TODO

* データからユーザーを自動生成するScriptの追加
* PowerShell ScriptのDSC化
