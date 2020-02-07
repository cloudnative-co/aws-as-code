# Client VPN

Client VPNの接続を作成するAWS CDKのプロジェクト。

## 事前準備

このStackを作成する前に、下記の物が必要。

* [AWS CDK](https://aws.amazon.com/jp/cdk/)
* [direnv](https://direnv.net/)
* Client VPNに使用する秘密鍵と証明書
  * 作成方法は、[クライアント認証と認可 - AWS Client VPN](https://docs.aws.amazon.com/ja_jp/vpn/latest/clientvpn-admin/authentication-authrization.html#mutual)の相互認証のセクションを参照のこと。

## 作成されるClient VPNの設定

* 認証は証明書を使った相互認証
* Active Directoryとの連携はしない
* AWS経由のインターネットへのアクセスを許可する

## 使い方

### .envrcの設定

`.envrc.example` を `.envrc` にコピーして、利用する環境に合わせて設定する。

* CDK_MY_CLIENT_CERT_ARN
  * クライアント証明書をACMにアップロードして生成されたARN
* CDK_MY_SERVER_CERT_ARN
  * サーバー証明書をACMにアップロードして生成されたARN
* CDK_MY_CLIENT_CIDR_BLOCK
  * VPN接続時にクライアントに利用されるネットワークのCIDR
* CDK_MY_SUBNET_ID
  * Client VPN Endpointが接続するVPCのサブネットID
* CDK_MY_TARGET_CIDR
  * VPNクライアントが接続可能なネットワークのCIDR

### 初期セットアップ

```
npm install
npm run build
```

### デプロイ

```
cdk deploy
```

### Client VPNの設定の取得と設定

deployが成功したら、Client VPN EndpointのIDが出力される。
環境変数`CLIENT_VPN_ENDPOINT_ID`にIDを設定して、`script/export-client-vpc-client-configuration.sh`を実行する。

```
CLIENT_VPN_ENDPOINT_ID=<your_endpoint_id> script/export-client-vpc-client-configuration.sh
```

OpenVPNの設定ファイル `client-config.ovpn` が生成される。
ファイルを開いて、クライアント証明書と秘密鍵のファイルのパスを追加する。
相対パスではなく、フルパスを記載する

```
cert </path/to/your_client_cert>
key </path/to/your_client_key>
```

OpenVPN Clientまたは、AWS VPN Clientに、設定ファイルを入れると、VPN接続ができるようになる。

