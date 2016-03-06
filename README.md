WebPushサンプル
===

Google ChromeやFirefoxで動作するWebPushのサンプルプログラム

## Original
- [GoogleChrome/samples/push-messaging-and-notifications](https://github.com/GoogleChrome/samples/tree/gh-pages/push-messaging-and-notifications)


## Usage

#### Google Chrome

1. [Google Developer Console](https://console.developers.google.com)にてプロジェクトを作成する
1. Google Cloud Messaging（GCM）を有効にする
1. [static/config.sample.js](static/config.sample.js)をconfig.jsにリネームする
1. [static/manifest.sample.json](static/manifest.sample.json)をmanifest.jsonにリネームする
1. `static/config.js`の`<Your Public API Key ...>`をGCMのAPIキーに書き換える
1. `static/manifest.json`の`<Your Project Number ...>`をプロジェクト番号に書き換える
1. （Node.jsの環境がある場合）`app.js`の`<Your Public API Key ...>`をGCMのAPIキーに書き換える

### Firefox
1. [static/config.sample.js](static/config.sample.js)をconfig.jsにリネームする


## Licence
[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0)

