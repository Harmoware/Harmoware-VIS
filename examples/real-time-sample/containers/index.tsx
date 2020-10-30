import * as React from 'react';
import { Container, MovesLayer, DepotsLayer, HarmoVisLayers, FpsDisplay,
  connectToHarmowareVis, LoadingIcon, BasedProps, Movesbase, MovesbaseOperation, EventInfo } from 'harmoware-vis';
import Controller from '../components/controller';
import * as io from 'socket.io-client';

const MAPBOX_TOKEN: string = process.env.MAPBOX_ACCESS_TOKEN;
const assign = Object.assign;

interface State {
  moveDataVisible: boolean,
  moveOptionVisible: boolean,
  depotOptionVisible: boolean,
  heatmapVisible: boolean,
  optionChange: boolean,
  iconChange: boolean,
  popup: [number, number, string]
}

interface SocketData {
  mtype: number,
  id: number,
  time: number,
  lat: number,
  lon: number,
  position?: number[]
}

interface FixMovesbase extends Movesbase {
  mtype?: number,
  id?: number,
  operation: MovesbaseOperation[]
}
const movesOptionFunc = (props: any, idx1: number, idx2: number) : Object => {
  const {departuretime, arrivaltime, operation, ...retValue1} = props.movesbase[idx1];
  const {elapsedtime, position, longitude, latitude, angle, ...retValue2} = operation[idx2];
  return assign(retValue1,retValue2,{direction:angle});
};

class App extends Container<BasedProps, State> {

  constructor(props: BasedProps) {
    super(props);
    const { setNoLoop, setSecPerHour, setLeading, setTrailing, setMovesOptionFunc } = props.actions;
    setNoLoop(true);
    setSecPerHour(3600);
    setLeading(3);
    setTrailing(0);
    setMovesOptionFunc(movesOptionFunc);
    const socket = io();
    this.state = {
      moveDataVisible: true,
      moveOptionVisible: false,
      depotOptionVisible: false,
      heatmapVisible: false,
      optionChange: false,
      iconChange: true,
      popup: [0, 0, '']
    };
    socket.on('connect', () => { console.log("Socket.IO Connected!") });
    socket.on('event', this.getEvent.bind(this));
    socket.on('disconnect', () => { console.log("Socket.IO Disconnected!") });
  }

  getEvent(socketData: string){
    // console.log('data:'+socketData);
    const { actions, movesbase } = this.props
    const { mtype, id, time: elapsedtime, lat, lon,
      position=[lon, lat, 0], ...otherkey }: SocketData = JSON.parse(socketData);
    let hit = false;
    const movesbasedata: FixMovesbase[] = [...movesbase];
    const setMovesbase: FixMovesbase[] = [];
    for (let i = 0, lengthi = movesbasedata.length; i < lengthi; i=(i+1)|0) {
      let setMovedata: FixMovesbase = assign({}, movesbasedata[i]);
      if(mtype === setMovedata.mtype && id === setMovedata.id){
        hit = true;
        const { operation } = setMovedata;
        operation.push({
          elapsedtime, position, ...otherkey
        });
        setMovedata = assign({}, setMovedata, { operation });
      }
      setMovesbase.push(setMovedata);
    }
    if(!hit){
      setMovesbase.push({
          mtype, id,
          operation: [{
            elapsedtime, position, ...otherkey
          }]
      });
    }
    actions.updateMovesBase(setMovesbase);
  }

  deleteMovebase(maxKeepSecond: number) {
    const { actions, animatePause, movesbase, settime } = this.props
    const movesbasedata: FixMovesbase[] = [...movesbase];
    const setMovesbase: FixMovesbase[] = [];
    let dataModify = false;
    const compareTime = settime - maxKeepSecond;
    for (let i = 0, lengthi = movesbasedata.length; i < lengthi; i=(i+1)|0) {
      const { operation: propsoperation } = movesbasedata[i];
      let startIndex = propsoperation.length;
      for (let j = 0, lengthj = propsoperation.length; j < lengthj; j=(j+1)|0) {
        if(propsoperation[j].elapsedtime > compareTime){
          startIndex = j;
          break;
        }
      }
      if(startIndex === 0){
        setMovesbase.push(assign({}, movesbasedata[i]));
      }else
      if(startIndex < propsoperation.length){
        setMovesbase.push(assign({}, movesbasedata[i], {
          operation: propsoperation.slice(startIndex)}));
        dataModify = true;  
      }else{
        dataModify = true;
      }
    }
    if(dataModify){
      if(!animatePause){
        actions.setAnimatePause(true);
      }
      actions.updateMovesBase(setMovesbase);
      if(!animatePause){
        actions.setAnimatePause(false);
      }
    }
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

  render() {
    const props = this.props;
    const {
      actions, routePaths, viewport, loading,
      clickedObject, movedData, movesbase, depotsData } = props;

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
          deleteMovebase={this.deleteMovebase.bind(this)}
          getMoveDataChecked={this.getMoveDataChecked.bind(this)}
          getMoveOptionChecked={this.getMoveOptionChecked.bind(this)}
          getDepotOptionChecked={this.getDepotOptionChecked.bind(this)}
          getOptionChangeChecked={this.getOptionChangeChecked.bind(this)}
          getIconChangeChecked={this.getIconChangeChecked.bind(this)}
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
            mapboxApiAccessToken={MAPBOX_TOKEN}
            mapboxAddLayerValue={null}
            layers={[].concat(
              depotsData.length > 0 ?
              new DepotsLayer({
                depotsData,
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
                clickedObject,
                actions,
                visible: this.state.moveDataVisible,
                optionVisible: this.state.moveOptionVisible,
                optionChange: this.state.optionChange,
                iconChange: this.state.iconChange,
                onHover
              }):null
            )}
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
