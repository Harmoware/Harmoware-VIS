import * as React from 'react';
import { FPSStats } from 'react-stats';
import { Container, MovesLayer, DepotsLayer, HarmoVisLayers,
  connectToHarmowareVis, LoadingIcon, BasedProps, Movesbase, MovesbaseOperation } from 'harmoware-vis';
import Controller from '../components/controller';
import * as io from 'socket.io-client';

const MAPBOX_TOKEN: string = process.env.MAPBOX_ACCESS_TOKEN;

interface State {
  moveDataVisible: boolean,
  moveOptionVisible: boolean,
  depotOptionVisible: boolean,
  heatmapVisible: boolean,
  optionChange: boolean,
  popup: Array<any>
}

interface SocketData {
  mtype: number,
  id: number,
  time: number,
  lat: number,
  lon: number,
  angle: number,
  speed: number
}

interface FixOperation extends MovesbaseOperation {
  angle?: number,
  speed?: number,
}
interface FixMovesbase extends Movesbase {
  mtype?: number,
  id?: number,
  operation: FixOperation[]
}

class App extends Container<BasedProps, State> {

  constructor(props: BasedProps) {
    super(props);
    const socket = io();
    this.state = {
      moveDataVisible: true,
      moveOptionVisible: false,
      depotOptionVisible: false,
      heatmapVisible: false,
      optionChange: false,
      popup: [0, 0, '']
    };
    socket.on('connect', () => { console.log("Socket.IO Connected!") });
    socket.on('event', this.getEvent.bind(this));
    socket.on('disconnect', () => { console.log("Socket.IO Disconnected!") });
  }

  componentWillMount() {
    const { setSecPerHour, setLeading, setTrailing } = this.props.actions;
    setSecPerHour(3600);
    setLeading(3);
    setTrailing(3);
  }

  getEvent(socketData: string){
    // console.log('data:'+socketData);
    const { actions, movesbase } = this.props
    const { mtype, id, time, lat, lon, angle, speed }: SocketData = JSON.parse(socketData);
    let hit = false;
    const movesbasedata: FixMovesbase[] = [...movesbase];
    const setMovesbase: FixMovesbase[] = [];
    for (let i = 0, lengthi = movesbasedata.length; i < lengthi; i += 1) {
      let setMovedata: FixMovesbase = Object.assign({}, movesbasedata[i]);
      if(mtype === setMovedata.mtype && id === setMovedata.id){
        hit = true;
        const { operation } = setMovedata;
        const arrivaltime = time;
        operation.push({
          elapsedtime: time,
          position: [lon, lat, 0],
          angle, speed
        });
        setMovedata = Object.assign({}, setMovedata, { arrivaltime, operation });
      }
      setMovesbase.push(setMovedata);
    }
    if(!hit){
      setMovesbase.push({
          mtype, id,
          departuretime: time,
          arrivaltime: time,
          operation: [{
            elapsedtime: time,
            position: [lon, lat, 0],
            angle, speed
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
    for (let i = 0, lengthi = movesbasedata.length; i < lengthi; i += 1) {
      const { departuretime: propsdeparturetime, operation: propsoperation } = movesbasedata[i];
      let departuretime = propsdeparturetime;
      let startIndex = propsoperation.length;
      for (let j = 0, lengthj = propsoperation.length; j < lengthj; j += 1) {
        if(propsoperation[j].elapsedtime > compareTime){
          startIndex = j;
          departuretime = propsoperation[j].elapsedtime;
          break;
        }
      }
      if(startIndex === 0){
        setMovesbase.push(Object.assign({}, movesbasedata[i]));
      }else
      if(startIndex < propsoperation.length){
        setMovesbase.push(Object.assign({}, movesbasedata[i], {
          operation: propsoperation.slice(startIndex), departuretime }));
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

  render() {
    const props = this.props;
    const {
      actions, lightSettings, routePaths, viewport, loading,
      clickedObject, movesbase, movedData, depotsData } = props;

    const onHover = (el) => {
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
          deleteMovebase={this.deleteMovebase.bind(this)}
          getMoveDataChecked={this.getMoveDataChecked.bind(this)}
          getMoveOptionChecked={this.getMoveOptionChecked.bind(this)}
          getDepotOptionChecked={this.getDepotOptionChecked.bind(this)}
          getOptionChangeChecked={this.getOptionChangeChecked.bind(this)}
        />
        <div className="harmovis_footer">
          <a href="http://www.city.sabae.fukui.jp/users/tutujibus/web-api/web-api.html" rel="noopener noreferrer" target="_blank">
            サンプルプログラムで「つつじバスロケーションWEB API」で取得したデータを使用しています。</a>&nbsp;
          longitude:{viewport.longitude}&nbsp;
          latitude:{viewport.latitude}&nbsp;
          zoom:{viewport.zoom}&nbsp;
          bearing:{viewport.bearing}&nbsp;
          pitch:{viewport.pitch}
          <FPSStats isActive />
        </div>
        <div className="harmovis_area">
          <HarmoVisLayers
            viewport={viewport}
            actions={actions}
            mapboxApiAccessToken={MAPBOX_TOKEN}
            layers={[
              new DepotsLayer({
                depotsData,
                lightSettings,
                optionVisible: this.state.depotOptionVisible,
                optionChange: this.state.optionChange,
                onHover
              }),
              new MovesLayer({
                routePaths,
                movesbase,
                movedData,
                clickedObject,
                actions,
                lightSettings,
                visible: this.state.moveDataVisible,
                optionVisible: this.state.moveOptionVisible,
                optionChange: this.state.optionChange,
                onHover
              })
            ]}
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
      </div>
    );
  }
}

export default connectToHarmowareVis(App);
