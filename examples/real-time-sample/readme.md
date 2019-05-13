# Harmoware-VIS/examples/real-time-sample
Harmoware-VIS を実行する基本的なアプリケーションのサンプルです。
## Using real-time-sample
### Mapbox Accesstoken Setting
[mapbox.com](https://www.mapbox.com/ "mapbox.com") から Accesstoken を取得してください。
これを環境変数を設定してください。
```
#!shell
 set MAPBOX_ACCESS_TOKEN=XXXXXXXXX
```
## Run real-time-sample
```
#!shell
npm run real-time-sample
```
シュミレーション用データを`ファイル選択`ボタンで選択すると、シュミレーションが開始します。

socket.io で位置情報を見るためのデモサーバプログラム → loc-update.exe

ダウンロード
https://bitbucket.org/uclabnu/loc-update/src/master/
