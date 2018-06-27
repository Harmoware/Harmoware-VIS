# Harmoware-VIS
![topimage](topimage.jpg)

## はじめに
本ソフトウェアは JST OPERA (産学共創プラットフォーム共同研究推進プログラム)の支援を受けて、
人間機械協奏技術コンソーシアム (HMHS: Human Machine Harmonization System) (http://hmhs.jp)
において、主に名古屋大学河口研究室が中心になって開発したものです。

UBERが開発した Deck.GL( http://uber.github.io/deck.gl/ ) を利用し、その上に移動体とその付加情報を可視化する機能を
追加しています。

## Install

### 事前準備
- node, npm のインストール
- Mapbox access token の取得(後述）と環境変数への設定

以下で例が動作します
```
git clone https://github.com/Harmoware/Harmoware-VIS
npm install
# example bus3d
npm run bus3d
```

★注意事項★
node.js のバージョンは v9.11.1 で確認しています。

## Using Harmoware-VIS

### Mapbox Accesstoken Setting

[mapbox.com](https://www.mapbox.com/ "mapbox.com") から Accesstoken を取得してください。

### User Application Examples

```javascript
// app.js　mapboxを使用する場合のサンプル
import React from 'react';
import { Container, connectToHarmowareVis,
    HarmoVisLayers, MovesLayer, DepotsLayer, XbandmeshLayer,
    MovesInput, DepotsInput, XbandDataInput, SimulationDateTime,
    PauseButton, ForwardButton, ReverseButton, AddMinutesButton,
    ElapsedTimeRange, SpeedRange } from 'harmoware-vis';

const MAPBOX_TOKEN = XXXXXXXXXX; //mapbox.com から取得したAccesstoken

class App extends Container {

    render() {
        const { viewport, actions, routePaths, lightSettings,
                    animatePause, animateReverse, settime, secperhour, timeBegin, timeLength,
                    movesbase, movedData, clickedObject, depotsData, rainfall } = this.props;

        return (
          <div>
            <div className="controller_area"> //コントローラーエリア
              <ul>
                <li><MovesInput actions={actions} /></li>
                <li><DepotsInput actions={actions} /></li>
                <li>{ animatePause ?
                    <PlayButton actions={actions} /> :
                    <PauseButton actions={actions} /> }</li>
                <li>{ animateReverse ?
                    <ForwardButton actions={actions} /> :
                    <ReverseButton actions={actions} /> }</li>
                <li><AddMinutesButton addMinutes={-5} actions={actions}>⏮ -5分</AddMinutesButton>&nbsp;
                    <AddMinutesButton addMinutes={5} actions={actions}>5分 ⏭</AddMinutesButton></li>
                <li><SimulationDateTime timeBegin={timeBegin} settime={settime} /></li>
                <li><ElapsedTimeRange settime={settime} timeLength={timeLength} actions={actions} /></li>
                <li><SpeedRange secperhour={secperhour} actions={actions} /></li>
                <li><XbandDataInput actions={actions} /></li>
              </ul>
            </div>

            <div className="harmovis_area"> //シュミレーションエリア
              <HarmoVisLayers
                viewport={viewport}  actions={actions}
                mapboxApiAccessToken={MAPBOX_TOKEN}
                layers={[
                  new MovesLayer( { routePaths, movesbase, movedData, clickedObject, actions, } ),
                  new DepotsLayer( { depotsData, } ),
                  new XbandmeshLayer( { lightSettings, rainfall, } ),
                ]}
              />
            </div>
          </div>
        );
    }
}
export default connectToHarmowareVis(App);
```

## Harmoware-VIS API

### Harmoware-VIS reducer

Harmoware-VIS で定義される reducer から Component で受け取る props は以下の通りです。

| props | Type | Default | Description |
| :------------ | :------------ | :------------ | :------------ |
| actions | object | -- | redux action function object |
| animatePause | Boolean | false | アニメーション停止 |
| animateReverse | Boolean | false | アニメーション再生正逆 |
| bounds | object | {} | 運行シュミレーション範囲（東西南北 端） |
| defaultPitch | Number | 30 | 地図表示時規定角度 |
| defaultZoom | Number | 11.1 | 地図表示時規定拡大値 |
| depotsBase | Array | [] | 停留所データ保持エリア |
| depotsData | Array | [] | 描画用停留所データ |
| getDepotsOptionFunc | Function | null | 停留所データオプション処理関数 |
| getMovesOptionFunc | Function | null | 運行データオプション処理関数 |
| leading | Number | 100 | シュミレーション前余白時間（秒） |
| lightSettings | object | {...} | 3Ｄオブジェクト用光源設定 |
| movedData | Array | [] | 描画用運行データ |
| movesbase | Array | [] | 運行データ保持エリア |
| clickedObject | object | null | 選択中運行オブジェクト |
| rainfall | Array | [] | 描画用雨量データ |
| routePaths | Array | [] | 描画用運行経路 |
| secperhour | Number | 3 | 再生速度（秒/時） |
| settime | Number | 0 | シュミレーション中時間 |
| timeBegin | Number | 0 | シュミレーション開始時刻UNIX時間（秒） |
| timeLength | Number | 0 | シュミレーション期間（秒） |
| trailing | Number | 180 | シュミレーション後余白時間（秒） |
| viewport | object | {...} | マップ視点情報 |

### Harmoware-VIS Actions

Harmoware-VIS で定義される redux の action は以下の通りです。

| action | update props | Description |
| :------------ | :------------ | :------------ |
| addMinutes(Number) | settime  | シュミレーション中時間加算（分）更新 |
| setTime(Number) | settime | シュミレーション中時間更新 |
| setLeading(Number) | leading | シュミレーション前余白時間（秒）更新 |
| setTrailing(Number) | trailing | シュミレーション後余白時間（秒）更新 |
| setViewport(object) | viewport | マップ視点情報更新 |
| setLightSettings(object) | lightSettings | 3Ｄオブジェクト用光源設定更新 |
| setMovesBase(object/Array) | timeBegin, timeLength, bounds, movesbase | 運行シュミレーションデータ更新 |
| setDepotsBase(Array) | depotsBase | 停留所データ保持エリア更新 |
| setAnimatePause(Boolean) | animatePause | アニメーション動作停止更新 |
| setAnimateReverse(Boolean) | animateReverse | アニメーション再生正逆更新 |
| setSecPerHour(Number) | secperhour | 再生速度（秒/時）更新 |
| setClicked(object) | clickedObject | 選択中運行オブジェクト更新 |
| setRoutePaths(Array) | routePaths | 描画用運行経路更新 |
| setDefaultZoom(Number) | defaultZoom | 地図表示時規定拡大値更新 |
| setDefaultPitch(Number) | defaultPitch | 地図表示時規定角度更新 |
| setMovesOptionFunc(Function) | getMovesOptionFunc | 運行データオプション処理関数更新 |
| setDepotsOptionFunc(Function) | getDepotsOptionFunc | 停留所データオプション処理関数更新 |
| setRainfall(Array) | rainfall | 描画用雨量データ更新 |

### Container

React.Component から継承したクラスで、Harmoware-VIS ライブラリの base コンポーネント。
シミュレーション時間及び、アニメーションフレームの更新を実施します。
ユーザは render 関数で DOM 出力してください。

##### Examples

```javascript
// mapboxを使用する場合
import React from 'react';
import { Container, connectToHarmowareVis, HarmoVisLayers, ... } from 'harmoware-vis';
class App extends Container {
    render() {
        const { viewport, actions, ... } = this.props;
        return (
          <HarmoVisLayers
            viewport={viewport}  actions={actions} mapboxApiAccessToken={ ... } layers={[ ... ]}
          />
        );
    }
}
export default connectToHarmowareVis(App);
```
```javascript
// mapboxを使用しない場合
import React from 'react';
import { Container, connectToHarmowareVis, HarmoVisNonMapLayers, ... } from 'harmoware-vis';
class App extends Container {
    render() {
        const { viewport, actions, ... } = this.props;
        return (
          <HarmoVisNonMapLayers
            viewport={viewport}  actions={actions} layers={[ ... ]}
          />
        );
    }
}
export default connectToHarmowareVis(App);
```

### connectToHarmowareVis

connectToHarmowareVisのstateをcontainer componentのpropに同期するためのUtility関数です。

##### Function code

```javascript
export const connectToHarmowareVis = ( App, moreActions = null, mapStateToProps = defaultMapStateToProps ) => {

    const extendedActions = Object.assign( { }, Actions, moreActions );

    function mapDispatchToProps( dispatch ) {
        return { actions: bindActionCreators( extendedActions, dispatch ) };
    }

    return connect( mapStateToProps, mapDispatchToProps )( App );
};
```

### HarmoVisLayers

[deck.gl](https://github.com/uber/deck.gl "deck.gl") の [Layer](https://github.com/uber/deck.gl/blob/master/docs/api-reference/layer.md "Layer") クラスを継承するレイヤーをmapboxより取得したマップ上に表示します。

##### Examples

```html
<HarmoVisLayers
    viewport={this.props.viewport} actions={this.props.actions}
    mapboxApiAccessToken={MAPBOX_TOKEN}
    layers={ [ ... ] }
/>
```

##### HarmoVisLayers Properties

| Properties | PropTypes | Default | Description |
| :------------ | :------------ | :------------ | :------------ |
| actions | object required | -- | Harmoware-VIS の props.actions |
| viewport | object required | -- | Harmoware-VIS の props.viewport |
| mapboxApiAccessToken | string required | -- | mapbox.com のAccesstoken |
| mapStyle | string option | 'mapbox://styles/mapbox/dark-v8' | mapbox のマップスタイルURL |
| layers | array required | -- | Layer インスタンス(※1) の配列 |
| onChangeViewport | func option | this.props.actions.setViewport | viewports値更新イベント関数 |
※1 [deck.gl](https://github.com/uber/deck.gl "deck.gl") の [Layer](https://github.com/uber/deck.gl/blob/master/docs/api-reference/layer.md "Layer") クラスを継承するクラスのインスタンス

### HarmoVisNonMapLayers

[deck.gl](https://github.com/uber/deck.gl "deck.gl") の [Layer](https://github.com/uber/deck.gl/blob/master/docs/api-reference/layer.md "Layer") クラスを継承するレイヤーを３Ｄ表示します。

##### Examples

```html
<HarmoVisNonMapLayers
    viewport={this.props.viewport} actions={this.props.actions}
    layers={ [ ... ] }
/>
```

##### HarmoVisNonMapLayers Properties

| Properties | PropTypes | Default | Description |
| :------------ | :------------ | :------------ | :------------ |
| actions | object required | -- | Harmoware-VIS の props.actions |
| viewport | object required | -- | Harmoware-VIS の props.viewport |
| layers | array required | -- | Layer インスタンス(※1) の配列 |
| onChangeViewport | func option | this.props.actions.setViewport | viewports値更新イベント関数 |
※1 [deck.gl](https://github.com/uber/deck.gl "deck.gl") の [Layer](https://github.com/uber/deck.gl/blob/master/docs/api-reference/layer.md "Layer") クラスを継承するクラスのインスタンス

## Harmoware-VIS Layers

Harmoware-VIS 提供 Layer 一覧

### MovesLayer

車両などの移動体をmapboxより取得したマップ上にシュミレーションします。
HarmoVisLayersのpropsで使用してください。

##### Examples

```html
<HarmoVisLayers ...
    layers={[
        new MovesLayer( { routePaths: this.props.routePaths,
                        movesbase: this.props.movesbase,
                        movedData: this.props.movedData,
                        clickedObject: this.props.clickedObject,
                        actions: this.props.actions } )
    ]}
/>
```

##### MovesLayer Properties

| Properties | PropTypes | Default | Description |
| :------------ | :------------ | :------------ | :------------ |
| actions | object required | -- | Harmoware-VIS の props.actions |
| routePaths | Array required | -- | Harmoware-VIS の props.routePaths |
| movesbase| Array required | -- | Harmoware-VIS の props.movesbase |
| movedData| Array required | -- | Harmoware-VIS の props.movedData |
| clickedObject | object required |--  | Harmoware-VIS の props.clickedObject |
| layerRadiusScale | Number option | 1 | アイコンサイズスケール |
| layerOpacity | Number option | 0.75 | アイコン透過度 |
| getColor | Function option | x => x.color ││ GREEN | アイコン色指定アクセサ |
| optionVisible | Boolean option | true | option情報表示可否 |
| optionChange | Boolean option | false | option表示パターン切替 |
| lightSettings | object option | -- | optionVisible に true を指定した場合には必須。 Harmoware-VIS の props.lightSettings |
| optionOpacity | Number option | 0.25 | option情報透過度 |
| optionCellSize | Number option | 10 | option情報透過度セルサイズ |
| optionElevationScale | Number option | 1 | option情報高度スケール |
| getColor1～4 | Function option | x => (x.optColor && x.optColor[0～3]) ││ x.color ││ GREEN | option情報アイコン色指定アクセサ |
| getElevation1～4 | Function option | x => (x.optElevation && x.optElevation[0～3]) ││ 0 | option情報アイコン高度指定アクセサ |
| getCubeColor | Function option | x => x.optColor ││ [x.color] ││ [GREEN] | option情報アイコン色指定アクセサ2 |
| getCubeElevation | Function option | x => x.optElevation ││ [0] | option情報アイコン高度指定アクセサ2 |

##### 運行シュミレーションデータファイルのjsonフォーマット

- 形式１
```json
// bounds timeBegin timeLength movesbase
{   "timeBegin": 9999999999, //運行シュミレーション開始日時（UNIX時間（秒））
    "timeLength": 99999, //運行シュミレーション開始から終了までの経過時間（秒）
    "bounds": { //運行シュミレーション範囲（北端、南端、西端、東端）
        "northlatitude": 99.99999, "southlatitude": 99.99999,
        "westlongitiude" 999.99999, "eastlongitiude": 999.99999,
    },
    "movesbase": [ //運行シュミレーションデータ *必須
        { //運行単位（１便）ごとに時間と経路を定義する
          //（departuretime, arrivaltime, elapsedtime はtimeBeginからの経過時間（秒））
          //（timeBegin 省略時 departuretime, arrivaltime, elapsedtime はUNIX時間（秒））
            "departuretime": 99999, //出発時間（秒） *必須
            "arrivaltime": 99999, //到着時間（秒） *必須
            "operation": [ //運行単位（１便）ごとに時間と経路を定義する *必須
                { //経過時間順に定義する
                    "elapsedtime": 99999, //経過時間（秒） *必須
                    // position形式 又は longitude-latitude形式で指定する
                    "position": [999.9999, 999.9999, 999.9999], //elapsedtime時の位置（x,y,z）*必須
                    "longitude": 999.9999, //elapsedtime時の位置（経度）*必須
                    "latitude": 99.999, //elapsedtime時の位置（緯度）*必須
                },・・・・・・
            ],
        },・・・・・・
    ],
}
```

- 形式２
```json
[ //運行シュミレーションデータ
    { //運行単位（１便）ごとに時間と経路を定義する
      //（departuretime, arrivaltime, elapsedtime はUNIX時間（秒））
        "departuretime": 9999999999, //出発時間（秒） *必須
        "arrivaltime": 9999999999, //到着時間（秒） *必須
        "operation": [ //運行単位（１便）ごとに時間と経路を定義する *必須
            { //経過時間順に定義する
                "elapsedtime": 9999999999, //経過時間（秒） *必須
                // position形式 又は longitude-latitude形式で指定する
                "position": [999.9999, 999.9999, 999.9999], //elapsedtime時の位置（x,y,z）*必須
                "longitude": 999.9999, //elapsedtime時の位置（経度）*必須
                "latitude": 99.999, //elapsedtime時の位置（緯度）*必須
            },・・・・・・
        ],
    },・・・・・・
]
```

### DepotsLayer

停留所や駅などをmapboxより取得したマップ上にシュミレーションします。
HarmoVisLayersのpropsで使用してください。

##### Examples

```html
<HarmoVisLayers ...
    layers={[
        new DepotsLayer( { depotsData: this.props.depotsData } )
    ]}
/>
```

##### DepotsLayer Properties

| Properties | PropTypes | Default | Description |
| :------------ | :------------ | :------------ | :------------ |
| depotsData| Array required | -- | Harmoware-VIS の props.depotsData |
| layerRadiusScale | Number option | 1 | アイコンサイズスケール |
| layerOpacity | Number option | 0.5 | アイコン透過度 |
| getColor | Function option | x => x.color ││ DARKMAGENTA | アイコン色指定アクセサ |
| optionVisible | Boolean option | true | option情報表示可否 |
| optionChange | Boolean option | false | option表示パターン切替 |
| lightSettings | object option | -- | optionVisible に true を指定した場合には必須。 Harmoware-VIS の props.lightSettings |
| optionOpacity | Number option | 0.25 | option情報透過度 |
| optionCellSize | Number option | 15 | option情報透過度セルサイズ |
| optionElevationScale | Number option | 1 | option情報高度スケール |
| getColor1～4 | Function option | x => (x.optColor && x.optColor[0～3]) ││ x.color ││ DARKMAGENTA | option情報アイコン色指定アクセサ |
| getElevation1～4 | Function option | x => (x.optElevation && x.optElevation[0～3]) ││ 0 | option情報アイコン高度指定アクセサ |

##### 停留所情報データのjsonフォーマット

```json
// depotsData position形式
[   {   "position": [999.9999, 999.9999, 999.9999], //オブジェクト表示する位置（x,y,z）*必須
    },・・・・・・
]
// depotsData longitude-latitude形式
[   {   "longitude": 999.9999, //オブジェクト表示する位置（経度）
        "latitude": 99.9999, //オブジェクト表示する位置（緯度）
    },・・・・・・
]
```

### MovesNonmapLayer

移動体を３Ｄシュミレーションします。
HarmoVisNonMapLayersのpropsで使用してください。

##### Examples

```html
<HarmoVisNonMapLayers ...
    layers={[
        new MovesNonmapLayer( { routePaths: this.props.routePaths,
                        movesbase: this.props.movesbase,
                        movedData: this.props.movedData,
                        clickedObject: this.props.clickedObject,
                        actions: this.props.actions } )
    ]}
/>
```

##### MovesNonmapLayer Properties

| Properties | PropTypes | Default | Description |
| :------------ | :------------ | :------------ | :------------ |
| movedData| Array required | -- | Harmoware-VIS の props.movedData |
| movesbase| Array required | -- | Harmoware-VIS の props.movesbase |
| actions | object required | -- | Harmoware-VIS の props.actions |
| routePaths | Array required | -- | Harmoware-VIS の props.routePaths |
| clickedObject | object required |--  | Harmoware-VIS の props.clickedObject |
| layerOpacity | Number option | 0.75 | アイコン透過度 |
| getColor | Function option | x => x.color ││ GREEN | アイコン色指定アクセサ |
| getRadius | Function option | x => x.radius ││ 2 | アイコンサイズアクセサ |


##### 運行シュミレーションデータファイルのjsonフォーマット

- 形式１
```json
// bounds timeBegin timeLength movesbase
{   "timeBegin": 9999999999, //運行シュミレーション開始日時（UNIX時間（秒））
    "timeLength": 99999, //運行シュミレーション開始から終了までの経過時間（秒）
    "movesbase": [ //運行シュミレーションデータ *必須
        { //運行単位（１便）ごとに時間と経路を定義する
          //（departuretime, arrivaltime, elapsedtime はtimeBeginからの経過時間（秒））
          //（timeBegin 省略時 departuretime, arrivaltime, elapsedtime はUNIX時間（秒））
            "departuretime": 99999, //出発時間（秒） *必須
            "arrivaltime": 99999, //到着時間（秒） *必須
            "operation": [ //運行単位（１便）ごとに時間と経路を定義する *必須
                { //経過時間順に定義する
                    "elapsedtime": 99999, //経過時間（秒） *必須
                    "position": [999.9999, 999.9999, 999.9999], //elapsedtime時の位置（x,y,z）*必須
                },・・・・・・
            ],
        },・・・・・・
    ],
}
```

- 形式２
```json
[ //運行シュミレーションデータ
    { //運行単位（１便）ごとに時間と経路を定義する
      //（departuretime, arrivaltime, elapsedtime はUNIX時間（秒））
        "departuretime": 9999999999, //出発時間（秒） *必須
        "arrivaltime": 9999999999, //到着時間（秒） *必須
        "operation": [ //運行単位（１便）ごとに時間と経路を定義する *必須
            { //経過時間順に定義する
                "elapsedtime": 9999999999, //経過時間（秒） *必須
                "position": [999.9999, 999.9999, 999.9999], //elapsedtime時の位置（x,y,z）*必須
            },・・・・・・
        ],
    },・・・・・・
]
```

### FixedPointLayer

固定ポイントを３Ｄシュミレーションします。
HarmoVisNonMapLayersのpropsで使用してください。

##### Examples

```html
<HarmoVisNonMapLayers ...
    layers={[
        new FixedPointLayer( { depotsData: this.props.depotsData } )
    ]}
/>
```

##### FixedPointLayer Properties

| Properties | PropTypes | Default | Description |
| :------------ | :------------ | :------------ | :------------ |
| depotsData| Array required | -- | Harmoware-VIS の props.depotsData |
| layerOpacity | Number option | 0.75 | アイコン透過度 |
| getColor | Function option | x => x.color ││ DARKMAGENTA | アイコン色指定アクセサ |
| getRadius | Function option | x => x.radius ││ 2 | アイコンサイズアクセサ |

##### 固定ポイント情報データのjsonフォーマット

```json
// depotsData
[   {   "position": [999.9999, 999.9999, 999.9999], //オブジェクト表示する位置（x,y,z）*必須
    },・・・・・・
]
```

### LineMapLayer

線描画マップを３Ｄシュミレーションします。
HarmoVisNonMapLayersのpropsで使用してください。

##### Examples

```html
<HarmoVisNonMapLayers ...
    layers={[
        new LineMapLayer( { linemapData: this.props.linemapData } )
    ]}
/>
```

##### LineMapLayer Properties

| Properties | PropTypes | Default | Description |
| :------------ | :------------ | :------------ | :------------ |
| linemapData| Array required | -- | Harmoware-VIS の props.linemapData |
| layerOpacity | Number option | 1.0 | 線透過度 |
| strokeWidth | Number option | 20 | 線幅 |
| getColor | Function option | x => x.color ││ WHITE | 線色指定アクセサ |

##### 線描画マップ情報データのjsonフォーマット

```json
// depotsData
[   { "sourcePosition": [999.9999, 999.9999, 999.9999], //線描画開始位置（x,y,z）*必須
      "targetPosition": [999.9999, 999.9999, 999.9999], //線描画終了位置（x,y,z）*必須
    },・・・・・・
]
```

### XbandmeshLayer

雨量データをシュミレーションします。

##### Examples

```html
<HarmoVisLayers ...
    layers={[
        new XbandmeshLayer( { lightSettings: this.props.lightSettings,
                              rainfall: this.props.rainfall } )
    ]}
/>
```

##### XbandmeshLayer Properties

| Properties | PropTypes | Default | Description |
| :------------ | :------------ | :------------ | :------------ |
| lightSettings | object required | -- | Harmoware-VIS の props.lightSettings |
| rainfall | Array required | -- | Harmoware-VIS の props.rainfall |
| layerOpacity | Number option | 0.2 | GridCell透過度 |
| layerCellSize | Number option | 100 | GridCellサイズ |
| layerElevationScale | Number option | 20 | GridCell高度スケール20 |
| getElevation | Function option | x => x.elevation ｜｜ 0 | 降雨量指定アクセサ |
| getColor | Function option | x => x.color | セル色指定アクセサ |
| getRainfallColor | Function option | ※表外に記載 | 降雨量配色処理 |
| defaultColor | Array option | [0, 255, 255] | セルデフォルト色指定 |

※ getRainfallColor  降雨量配色デフォルト処理
```javascript
(x) => {
  if (x < 3) {
    return [255.0 - ((x / 3.0) * 255.0), 255.0, 255.0];
  } else
  if (x < 12) {
    return [0.0, 255.0 - (((x - 3.0) / 9.0) * 255.0), 255.0];
  } else
  if (x < 25) {
    return [(((x - 12.0) / 15.0) * 255.0), (((x - 12.0) / 15.0) * 255.0),
      255.0 - (((x - 12.0) / 15.0) * 255.0)];
  } else
  if (x < 40) {
    return [255.0, 255.0 - (((x - 25.0) / 15.0) * 255.0), 0.0];
  } else
  if (x < 80) {
    return [255.0 - (((x - 40.0) / 40.0) * 127.0), 0.0, (((x - 40.0) / 40.0) * 255.0)];
  }
  return [127.0, 0.0, 255.0];
}
```

##### xband雨量情報データのjsonフォーマット

```json
// rainfall
[   {   "position": [999.9999, 99.9999], //オブジェクト表示する位置（経度、緯度）
        "color": [rrr,ggg,bbb], //オブジェクト表示色
        "elevation": 999.9 //雨量情報
    },・・・・・・
]
```

## Harmoware-VIS Control component

Harmoware-VIS を Control する component 一覧

### MovesInput

「運行シュミレーションデータ」を設定したファイルを選択するダイアログを表示し、読み込んだデータより Harmoware-VIS の props.bounds、props.timeBegin、props.timeLength、props.movesbase に設定します。

##### Examples

```html
<MovesInput actions={this.props.actions} />
```

##### MovesInput Properties

| Properties | PropTypes | Default | Description |
| :------------ | :------------ | :------------ | :------------ |
| actions | object required | -- | Harmoware-VIS の props.actions |

### DepotsInput

「停留所情報データ」を設定したファイルを選択するダイアログを表示し、読み込んだデータより Harmoware-VIS の props.depotsBase に設定します。

##### Examples

```html
<DepotsInput actions={this.props.actions} />
```

##### DepotsInput Properties

| Properties | PropTypes | Default | Description |
| :------------ | :------------ | :------------ | :------------ |
| actions | object required | -- | Harmoware-VIS の props.actions |

### LinemapInput

「線描画マップ情報データ」を設定したファイルを選択するダイアログを表示し、読み込んだデータより Harmoware-VIS の props.linemapData に設定します。

##### Examples

```html
<LinemapInput actions={this.props.actions} />
```

##### LinemapInput Properties

| Properties | PropTypes | Default | Description |
| :------------ | :------------ | :------------ | :------------ |
| actions | object required | -- | Harmoware-VIS の props.actions |

### XbandDataInput

「xband雨量情報データ」を設定したファイルを選択するダイアログを表示し、読み込んだデータより Harmoware-VIS の props.rainfall に設定します。

##### Examples

```html
<XbandDataInput actions={this.props.actions} />
```

##### XbandDataInput Properties

| Properties | PropTypes | Default | Description |
| :------------ | :------------ | :------------ | :------------ |
| actions | object required | -- | Harmoware-VIS の props.actions |

### AddMinutesButton

「シュミレーション中時間（settime）」から addMinutes 分を加算した値を Harmoware-VIS の props.settime に設定する button オブジェクト。

##### Examples

```html
<AddMinutesButton addMinutes={5} actions={this.props.actions}>5分 ⏭</AddMinutesButton>
```

##### AddMinutesButton Properties

| Properties | PropTypes | Default | Description |
| :------------ | :------------ | :------------ | :------------ |
| actions | object required | -- | Harmoware-VIS の props.actions |
| children | node required | -- | Button Caption |
| addMinutes | number option | 10 | 加算する時間（分）10 |

### ElapsedTimeRange

「シュミレーション中時間（settime）」を Harmoware-VIS の props.settime に設定する range オブジェクト。

##### Examples

```html
<ElapsedTimeRange settime={this.props.settime} timeLength={this.props.timeLength} actions={this.props.actions} />
```

##### ElapsedTimeRange Properties

| Properties | PropTypes | Default | Description |
| :------------ | :------------ | :------------ | :------------ |
| settime | number required | -- | Harmoware-VIS の props.settime |
| timeLength | number required | -- | Harmoware-VIS の props.timeLength |
| actions | object required | -- | Harmoware-VIS の props.actions |
| caption | string option | '経過時間' | Range Caption |
| min | number option | -100 | Range 最小値（シュミレーション中時間（秒）） |
| step | number option | 1 | Range 増加値 |

### PauseButton

Harmoware-VIS の props.animatePause を true に更新する button オブジェクト。

##### Examples

```html
<PauseButton actions={this.props.actions} />
```

##### PauseButton Properties

| Properties | PropTypes | Default | Description |
| :------------ | :------------ | :------------ | :------------ |
| actions | object required | -- | Harmoware-VIS の props.actions |
| children | string option | '⏯️ 一時停止' | Button Caption |

### PlayButton

Harmoware-VIS の props.animatePause を false に更新する button オブジェクト。

##### Examples

```html
<PlayButton actions={this.props.actions} />
```

##### PlayButton Properties

| Properties | PropTypes | Default | Description |
| :------------ | :------------ | :------------ | :------------ |
| actions | object required | -- | Harmoware-VIS の props.actions |
| children | string option | '⏯️ 開始　　' | Button Caption |

### ForwardButton

Harmoware-VIS の props.animateReverse を false に更新する button オブジェクト。

##### Examples

```html
<ForwardButton actions={this.props.actions} />
```

##### ForwardButton Properties

| Properties | PropTypes | Default | Description |
| :------------ | :------------ | :------------ | :------------ |
| actions | object required | -- | Harmoware-VIS の props.actions |
| children | node option | '▶️ 正再生' | Button Caption |

### ReverseButton

Harmoware-VIS の props.animateReverse を true に更新する button オブジェクト。

##### Examples

```html
<ReverseButton actions={this.props.actions} />
```

##### ReverseButton Properties

| Properties | PropTypes | Default | Description |
| :------------ | :------------ | :------------ | :------------ |
| actions | object required | -- | Harmoware-VIS の props.actions |
| children | node option | '◀️ 逆再生' | Button Caption |

### SimulationDateTime

シミュレーション時刻を編集するコンポーネント。
表示例 `2018/02/21(水) 16:35:24`

##### Examples

```html
<SimulationDateTime timeBegin={this.props.timeBegin} settime={this.props.settime} />
```

##### SimulationDateTime Properties

| Properties | PropTypes | Default | Description |
| :------------ | :------------ | :------------ | :------------ |
| timeBegin | number required | -- | Harmoware-VIS の props.timeBegin |
| settime | number required | -- | Harmoware-VIS の props.settime |
| caption | string option | '' | Caption |
| locales | string option | 'ja-JP' | dateObj.toLocaleStringの引数 |
| options | object option | { year:'numeric',month:'2-digit',day:'2-digit',   hour:'2-digit',minute:'2-digit',second:'2-digit',    weekday:'short' } | dateObj.toLocaleStringの引数 |

### SpeedRange

「再生速度（秒/時）（secperhour）」を Harmoware-VIS の props.secperhour に設定する range オブジェクト。

##### Examples

```html
<SpeedRange secperhour={this.props.secperhour} actions={this.props.actions} />
```

##### SpeedRange Properties

| Properties | PropTypes | Default | Description |
| :------------ | :------------ | :------------ | :------------ |
| secperhour | number required | -- | Harmoware-VIS の props.secperhour |
| actions | object required | -- | Harmoware-VIS の props.actions |
| maxsecperhour | number option | 3600 | Range 最大値（再生速度（秒/時）） |
| caption | string option | 'スピード' | Range Caption |
| min | number option | 1 | Range 最小値 |
| step | number option | 1 | Range 増加値 |

## 履歴
| date | version | Description |
| :------------ | :------------ | :------------ |
| 2018.05.16 | 1.0.0 | 初版 |
| 2018.06.27 | 1.1.0 | bus3dサンプルにarclayer機能を追加 |
| ↓ | ↓ | visualize-sample-nonmapサンプルを追加 |
