WebPushサンプル
===

Google ChromeやFirefoxで動作するWebPushのサンプルプログラム

## Original
- [GoogleChrome/samples/push-messaging-and-notifications](https://github.com/GoogleChrome/samples/tree/gh-pages/push-messaging-and-notifications)


## Demo
- [デモページ](https://megos-webpush-sample.herokuapp.com/)


## Usage
1. 「通知を有効にする」ボタンを押す
1. ブラウザの受信設定が表示されるので、有効にする
1. 「メッセージを送信する」ボタンを押すか、cURL Commandに表示されたスクリプトをコピーして、ターミナルやcygwinで実行する


## Setting

- htmlが動く環境またはNode.jsが動く環境が必要です
 - html環境の場合：Push通知はcurlコマンドを使う
 - Node.js環境の場合：Push通知をブラウザで行うことができる

### Google Chrome

1. [Google Developer Console](https://console.developers.google.com)にてプロジェクトを作成する
1. Google Cloud Messaging（GCM）を有効にする
1. `static/config.js`の`<Your Public API Key ...>`をGCMのAPIキーに書き換える
1. `static/manifest.json`の`<Your Project Number ...>`をプロジェクト番号に書き換える
1. （Node.jsの環境がある場合）`app.js`の`<Your Public API Key ...>`をGCMのAPIキーに書き換える

### Firefox
1. 特に設定の必要なし

### 実行（Node.js環境の場合）

- `$ node app.js`
- http://localhost:3000 にアクセス


## Licence
[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0)

