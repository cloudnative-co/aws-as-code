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
* AddsIdentityStack, AddsManagementStack, AddsNetworkStack, AddsSecretStack, AddsComputerStackをdeployする。
* ADDSのインスタンスが起動して、SSMのマネージドインスタンスに登録されたら、 `./scripts/install-adds.sh` を実行する。
* ADDSのインストールが完了し、OSが再起動完了したら、`./scripts/setup-ssm-user.sh` を実行する。
* AddsDhcpStackをdeployする。

## 設定

### .envrc

```sh
export CDK_MY_VPC_CIDR="10.100.0.0/16"
export CDK_MY_DOMAIN_NAME="aws.example.com"
export CDK_MY_DOMAIN_NETBIOS_NAME="EXAMPLE"
export CDK_MY_UI_TYPE="cli"
```

<dl>
<dt>CDK_MY_VPC_CIDR</dt>
<dd>作成するVPCのCIDR</dd>
<dt>CDK_MY_DOMAIN_NAME</dt>
<dd>ADDSのドメイン名</dd>
<dt>CDK_MY_DOMAIN_NETBIOS_NAME</dt>
<dd>ADDSのNetBios形式のドメイン名</dd>
<dt>CDK_MY_UI_TYPE</dt>
<dd>`gui`または`cli`を指定する。`cdk.json`のcontextで、利用するインスタンスサイズやAMIを定義していて、そこの切り替えに利用する。</dd>
</dl>

### cdk.json

```json
  "context": {
    "gui": {
      "instanceClass": "t3a",
      "instanceSize": "large",
      "windowsAmiVersion": "Windows_Server-2019-English-Full-Base"
    },
    "cli": {
      "instanceClass": "t3a",
      "instanceSize": "micro",
      "windowsAmiVersion": "Windows_Server-2019-English-Core-Base"
    }
  }
```

<dl>
<dt>gui</dt>
<dd>GUIが利用できる一般的なWindows Server 2019を起動する</dd>
<dt>cli</dt>
<dd>GUIが利用できないWindows Server Coreを起動する</dd>
</dl>

## 注意点

* ADDSが起動する前にDHCP Options Setを作成してしまうと、名前解決できなくなってしまう。
  * その場合は、一度 default のDHCP Option Setにアタッチし直すと、AmazonのDNSが利用されるようになる。
* SSM経由で管理する前提なので、KeyPairは未設定。
* Administratorのパスワードは、Secrets Managerを使って生成したパスワードを設定するので、下記のコマンドで取得できる。
  * `aws secretsmanager get-secret-value --secret-id AdminPassword`
