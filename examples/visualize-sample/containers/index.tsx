import * as React from 'react';
import { HexagonLayer } from 'deck.gl';
import { Marker, Popup } from 'react-map-gl';
import { Container, MovesLayer, DepotsLayer, LineMapLayer, HarmoVisLayers, MovedData,
  connectToHarmowareVis, LoadingIcon, BasedProps, EventInfo, FpsDisplay } from 'harmoware-vis';
import Controller from '../components/controller';
import SvgIcon from '../icondata/SvgIcon';

const MAPBOX_TOKEN: string = process.env.MAPBOX_ACCESS_TOKEN;

interface State {
  mapboxVisible: boolean,
  moveDataVisible: boolean,
  moveOptionVisible: boolean,
  depotOptionVisible: boolean,
  heatmapVisible: boolean,
  optionChange: boolean,
  iconChange: boolean,
  iconCubeType?: number,
  popup: [number, number, string],
  popupInfo: MovedData
}

class App extends Container<BasedProps, State> {

  constructor(props: BasedProps) {
    super(props);
    this.state = {
      mapboxVisible: true,
      moveDataVisible: true,
      moveOptionVisible: false,
      depotOptionVisible: false,
      heatmapVisible: false,
      optionChange: false,
      iconChange: true,
      iconCubeType: 0,
      popup: [0, 0, ''],
      popupInfo: null
    };
  }

  getMoveDataChecked(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ moveDataVisible: e.target.checked });
  }

  getMoveOptionChecked(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ moveOptionVisible: e.target.checked });
  }

  getDepotOptionChecked(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ depotOptionVisible: e.target.checked });
  }

  getOptionChangeChecked(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ optionChange: e.target.checked });
  }

  getIconChangeChecked(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ iconChange: e.target.checked });
  }

  getIconCubeTypeChecked(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ iconCubeType: e.target.checked ? 1 : 0 });
  }

  getHeatmapVisible(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ heatmapVisible: e.target.checked });
  }

  getMarker(data: MovedData, index: number) {
    const { viewport } = this.props;
    const { direction } = data;

    return (<Marker key={`marker-${index}`}
      longitude={data.longitude} latitude={data.latitude} >
      <SvgIcon viewport={viewport} direction={direction}
      onMouseOver={() => this.setState({popupInfo: data})}
      onMouseOut={() => this.setState({popupInfo: null})} />
      </Marker>);
  }

  getPopup() {
    const {popupInfo} = this.state;

    if(popupInfo){
      const objctlist = Object.entries(popupInfo);
      return (
        <Popup tipSize={5}
          anchor="bottom"
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          closeButton={false} >
          <div>{objctlist.map((item)=><p>{`${item[0]}: ${item[1].toString()}`}</p>)}</div>
        </Popup>
      );
    }
    return null;
  }

  getMapGlComponents(movedData: MovedData[]){
    const { moveDataVisible } = this.state;
    if(!moveDataVisible){
      return (
        <div>
          {movedData.map( this.getMarker.bind(this) )}
          {this.getPopup()}
        </div>
      );
    }
    return null;
  }

  render() {
    const props = this.props;
    const {
      actions, lightSettings, routePaths, viewport, loading,
      clickedObject, movedData, movesbase, depotsData, linemapData } = props;

    const onHover = (el: EventInfo) => {
      if (el && el.object) {
        let disptext = '';
        const objctlist = Object.entries(el.object);
        for (let i = 0, lengthi = objctlist.length; i < lengthi; i += 1) {
          const strvalue = objctlist[i][1].toString();
          disptext += i > 0 ? '\n' : '';
          disptext += (`${objctlist[i][0]}: ${strvalue}`);
        }
        this.setState({ popup: [el.x, el.y, disptext] });
      } else {
        this.setState({ popup: [0, 0, ''] });
      }
    };

    return (
      <div>
        <Controller
          {...props}
          getMoveDataChecked={this.getMoveDataChecked.bind(this)}
          getMoveOptionChecked={this.getMoveOptionChecked.bind(this)}
          getDepotOptionChecked={this.getDepotOptionChecked.bind(this)}
          getHeatmapVisible={this.getHeatmapVisible.bind(this)}
          getOptionChangeChecked={this.getOptionChangeChecked.bind(this)}
          getIconChangeChecked={this.getIconChangeChecked.bind(this)}
          getIconCubeTypeChecked={this.getIconCubeTypeChecked.bind(this)}
        />
        <div className="harmovis_footer">
          <a href="http://www.city.sabae.fukui.jp/users/tutujibus/web-api/web-api.html" rel="noopener noreferrer" target="_blank">
            サンプルプログラムで「つつじバスロケーションWEB API」で取得したデータを使用しています。</a>&nbsp;
          longitude:{viewport.longitude}&nbsp;
          latitude:{viewport.latitude}&nbsp;
          zoom:{viewport.zoom}&nbsp;
          bearing:{viewport.bearing}&nbsp;
          pitch:{viewport.pitch}
        </div>
        <div className="harmovis_area">
          <HarmoVisLayers
            viewport={viewport}
            actions={actions}
            mapboxApiAccessToken={this.state.mapboxVisible ? MAPBOX_TOKEN : ''}
            mapStyle={this.state.mapboxVisible ? undefined : ''}
            layers={[
              depotsData.length > 0 ?
              new DepotsLayer({
                depotsData,
                lightSettings,
                optionVisible: this.state.depotOptionVisible,
                optionChange: this.state.optionChange,
                onHover
              }):null,
              this.state.moveDataVisible && movedData.length > 0 ?
              new MovesLayer({
                viewport,
                routePaths,
                movedData,
                movesbase,
                clickedObject,
                actions,
                lightSettings,
                visible: this.state.moveDataVisible,
                optionVisible: this.state.moveOptionVisible,
                optionChange: this.state.optionChange,
                iconChange: this.state.iconChange,
                iconCubeType: this.state.iconCubeType,
                onHover
              }):null,
              linemapData.length > 0 ?
              new LineMapLayer({
                viewport,
                linemapData,
                onHover
              }):null,
              this.state.heatmapVisible && movedData.length > 0 ?
              new HexagonLayer({
                id: '3d-heatmap',
                data: movedData,
                radius: 100,
                opacity: 0.5,
                extruded: true,
                lightSettings,
                visible: this.state.heatmapVisible
              }):null
            ]}
            mapGlComponents={ this.getMapGlComponents(movedData) }
          />
        </div>
        <svg width={viewport.width} height={viewport.height} className="harmovis_overlay">
          <g fill="white" fontSize="12">
            {this.state.popup[2].length > 0 ?
              this.state.popup[2].split('\n').map((value, index) =>
                <text
                  x={this.state.popup[0] + 10} y={this.state.popup[1] + (index * 12)}
                  key={index.toString()}
                >{value}</text>) : null
            }
          </g>
        </svg>
        <LoadingIcon loading={loading} />
        <FpsDisplay />
      </div>
    );
  }
}

export default connectToHarmowareVis(App);
