import * as React from 'react';
import { PolygonLayer, HexagonLayer } from 'deck.gl';
import { Marker, Popup } from 'react-map-gl';
import { Container, MovesLayer, DepotsLayer, LineMapLayer, HarmoVisLayers, MovedData,
  connectToHarmowareVis, LoadingIcon, BasedProps, EventInfo, FpsDisplay } from 'harmoware-vis';
import Controller from '../components/controller';
import SvgIcon from '../icondata/SvgIcon';

// MovesLayer で iconCubeType=1(ScenegraphLayer) を使用する場合に登録要
import {registerLoaders} from '@loaders.gl/core';
import {GLTFLoader} from '@loaders.gl/gltf';
registerLoaders([GLTFLoader]);

const MAPBOX_TOKEN: string = process.env.MAPBOX_ACCESS_TOKEN;

interface State {
  mapboxVisible: boolean,
  moveDataVisible: boolean,
  moveOptionVisible: boolean,
  moveSvgVisible: boolean,
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
      moveSvgVisible: false,
      depotOptionVisible: false,
      heatmapVisible: false,
      optionChange: false,
      iconChange: true,
      iconCubeType: 0,
      popup: [0, 0, ''],
      popupInfo: null
    };
  }

  getMapboxChecked(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ mapboxVisible: e.target.checked });
  }

  getMoveDataChecked(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ moveDataVisible: e.target.checked });
  }

  getMoveOptionChecked(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ moveOptionVisible: e.target.checked });
  }

  getMoveSvgChecked(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ moveSvgVisible: e.target.checked });
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

  getIconCubeTypeSelected(e: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({ iconCubeType: Number(e.target.value) });
  }

  getHeatmapVisible(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ heatmapVisible: e.target.checked });
  }

  getMarker(data: MovedData, index: number) {
    const { viewport } = this.props;
    const { direction, position } = data;

    if(position){
      return (<Marker key={`marker-${index}`}
      longitude={data.position[0]} latitude={data.position[1]} >
      <SvgIcon viewport={viewport} direction={direction}
      onMouseOver={() => this.setState({popupInfo: data})}
      onMouseOut={() => this.setState({popupInfo: null})} />
      </Marker>);
    }
    return null;
  }

  getPopup() {
    const {popupInfo} = this.state;

    if(popupInfo && popupInfo.position){
      const objctlist = Object.entries(popupInfo);
      return (
        <Popup tipSize={5}
          anchor="bottom"
          longitude={popupInfo.position[0]}
          latitude={popupInfo.position[1]}
          closeButton={false} >
          <div>{objctlist.map((item)=><p>{`${item[0]}: ${item[1].toString()}`}</p>)}</div>
        </Popup>
      );
    }
    return null;
  }

  getMapGlComponents(movedData: MovedData[]){
    const { moveSvgVisible } = this.state;
    if(moveSvgVisible){
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
      actions, routePaths, viewport, loading,
      clickedObject, movedData, movesbase, depotsData, linemapData } = props;
    const polygonData = movedData.filter((x:any)=>(x.coordinates || x.polygon));

    const onHover = (el: EventInfo) => {
      if (el && el.object) {
        let disptext = '';
        const objctlist = Object.entries(el.object);
        for (let i = 0, lengthi = objctlist.length; i < lengthi; i=(i+1)|0) {
          const strvalue = objctlist[i][1].toString();
          disptext = disptext + (i > 0 ? '\n' : '');
          disptext = disptext + (`${objctlist[i][0]}: ${strvalue}`);
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
          iconCubeType={this.state.iconCubeType}
          getMapboxChecked={this.getMapboxChecked.bind(this)}
          getMoveDataChecked={this.getMoveDataChecked.bind(this)}
          getMoveOptionChecked={this.getMoveOptionChecked.bind(this)}
          getMoveSvgChecked={this.getMoveSvgChecked.bind(this)}
          getDepotOptionChecked={this.getDepotOptionChecked.bind(this)}
          getHeatmapVisible={this.getHeatmapVisible.bind(this)}
          getOptionChangeChecked={this.getOptionChangeChecked.bind(this)}
          getIconChangeChecked={this.getIconChangeChecked.bind(this)}
          getIconCubeTypeSelected={this.getIconCubeTypeSelected.bind(this)}
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
            visible={this.state.mapboxVisible}
            layers={[].concat(
              depotsData.length > 0 ?
              new DepotsLayer({
                depotsData,
                /* iconDesignations Setting Example
                iconDesignations: [{type:'stop', layer:'Scatterplot'},{type:'station', layer:'SimpleMesh'}],
                /**/
                optionVisible: this.state.depotOptionVisible,
                optionChange: this.state.optionChange,
                iconChange: this.state.iconChange,
                onHover
              }):null,
              this.state.moveDataVisible && movedData.length > 0 ?
              new MovesLayer({
                routePaths,
                movedData,
                movesbase,
                /* iconDesignations Setting Example
                iconDesignations:[{type:'car', layer:'SimpleMesh', getColor:()=>[255,0,0,255]},
                {type:'bus', layer:'Scenegraph', getScale:()=>[0.2,0.2,0.2], getOrientation:()=>[0,0,90]},
                {type:'walker', layer:'Scatterplot'},],
                /**/
                clickedObject,
                actions,
                visible: this.state.moveDataVisible,
                optionVisible: this.state.moveOptionVisible,
                optionChange: this.state.optionChange,
                iconChange: this.state.iconChange, // Invalid if there is iconDesignations definition
                iconCubeType: this.state.iconCubeType, // Invalid if there is iconDesignations definition
                sizeScale: this.state.iconCubeType === 0 ? 20 : 2,
                onHover
              }):null,
              linemapData.length > 0 ?
              new LineMapLayer({
                id: 'line-map',
                data: linemapData,
                onHover
              }):null,
              polygonData.length > 0  ?
              new PolygonLayer({
                id: 'PolygonLayer',
                data: polygonData,
                visible: true,
                opacity: 0.5,
                pickable: true,
                extruded: true,
                wireframe: true,
                getPolygon: (x: any) => x.coordinates || x.polygon,
                getFillColor: (x: any) => x.color || [255,255,255,255],
                getLineColor: null,
                getElevation: (x: any) => x.elevation || 3,
                onHover: onHover
              }):null,
              this.state.heatmapVisible && movedData.length > 0 ?
              new HexagonLayer({
                id: '3d-heatmap',
                data: movedData.filter(x=>x.position),
                getPosition: (x: any) => x.position,
                radius: 100,
                opacity: 0.5,
                extruded: true,
                visible: this.state.heatmapVisible
              }):null
            )}
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
