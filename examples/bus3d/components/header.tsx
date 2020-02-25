import * as React from 'react';
import { SimulationDateTime } from 'harmoware-vis';
import CanvasComponent from './canvas-component';
import { hsvToRgb } from '../library';
import { Bus3dProps } from '../types';

const CANVAS_WIDTH = 240;
const CANVAS_HEIGHT = 20;

const canvasProps = {
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  updateCanvas: (context) => {
    const cont = context;
    const hMin = 0;
    const hMax = 120;
    const unit = CANVAS_WIDTH / hMax;
    for (let h = hMin; h <= hMax; h=(h+1)|0) {
      cont.fillStyle = `rgb(${hsvToRgb(h, 1, 1).join(',')})`;
      cont.fillRect((hMax - h) * unit, 0, unit, CANVAS_HEIGHT);
    }
  },
};

interface Props extends Bus3dProps{
  t: (key: string) => string,
}

export default class Header extends React.Component<Props> {

  onBusReleaseClick() {
    const { actions } = this.props;
    actions.setClicked(null);
    actions.setRoutePaths([]);
  }

  setDelayHeight(e: React.ChangeEvent<HTMLInputElement>) {
    const { actions, clickedObject } = this.props;
    actions.setDelayHeight(e.target.value);
    actions.updateRoute(clickedObject, false);
  }

  setScaleElevation(e: React.ChangeEvent<HTMLInputElement>) {
    this.props.actions.setScaleElevation(e.target.value);
  }

  render() {
    const {
      movedData, busoption, bsoptFname, elevationScale, t,
      clickedObject, delayrange, delayheight, settime } = this.props;
    const flg = clickedObject ? clickedObject[0].object.name.match(/^\d+-[12]/) : null;
    const getClickedInfo = movedData.find((element) => {
      if (clickedObject && clickedObject[0].object &&
        clickedObject[0].object.movesbaseidx === element.movesbaseidx) {
        return true;
      }
      return false;
    });
    return (
      <div className="bus3d_header">
        <SimulationDateTime settime={settime} locales={t('locales')} />
        <span id="bus_count">{movedData.length}&nbsp;{t('Operating')}</span>
        {Object.keys(busoption).length <= 0 ?
          <span>{t('busoption')}{t('non')}</span> :
          <span>{t('busoption')}{`：${bsoptFname}`}</span>
        }
        {Object.keys(busoption).length > 0 &&
          (busoption.busmovesoption || busoption.busstopsoption) &&
          <input
            type="range" value={elevationScale} min="1" max="20" step="1"
            onChange={this.setScaleElevation.bind(this)}
          />}
        <br />
        <span>{t('delayrange')} 0{t('minute')}</span>
        <CanvasComponent {...canvasProps} />
        <span>～{delayrange}{t('minute')}</span>
        {flg && clickedObject && <span>{t('TD_display')}</span>}
        {flg && clickedObject &&
          <span>
            <input
              type="range" value={delayheight} min="0" max="10" step="1"
              onChange={this.setDelayHeight.bind(this)}
            />
          </span>
        }
        {getClickedInfo &&
          <div>
            <span>
            {t('busInformation')}&nbsp;
              <button onClick={this.onBusReleaseClick.bind(this)}>{t('release')}</button>
            </span>
            <span>{getClickedInfo.code} {getClickedInfo.name} {getClickedInfo.memo}</span>
          </div>
        }
      </div>
    );
  }
}
