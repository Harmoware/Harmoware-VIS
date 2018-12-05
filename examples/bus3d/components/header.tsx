import * as React from 'react';
import { SimulationDateTime } from 'harmoware-vis';
import CanvasComponent from './canvas-component';
import { hsvToRgb } from '../library';
import { Bus3dProps } from '../types';

const CANVAS_WIDTH = 240;
const CANVAS_HEIGHT = 20;

interface Props extends Bus3dProps{
  t?: Function,
}

export default class Header extends React.Component<Props> {

  onBusReleaseClick() {
    const { actions } = this.props;
    actions.setClicked(null);
    actions.setRoutePaths([]);
  }

  setDelayHeight(e) {
    const { actions, clickedObject } = this.props;
    actions.setDelayHeight(e.target.value);
    actions.updateRoute(clickedObject, false);
  }

  setScaleElevation(e) {
    this.props.actions.setScaleElevation(e.target.value);
  }

  render() {
    const {
      movedData, busoption, bsoptFname, elevationScale, t,
      clickedObject, delayrange, delayheight, settime } = this.props;
    const flg = clickedObject ? clickedObject[0].object.name.match(/^\d+-[12]/) : null;
    const canvasProps = {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      updateCanvas: (context) => {
        const cont = context;
        const hMin = 0;
        const hMax = 120;
        const unit = CANVAS_WIDTH / hMax;
        for (let h = hMin; h <= hMax; h += 1) {
          cont.fillStyle = `rgb(${hsvToRgb(h, 1, 1).join(',')})`;
          cont.fillRect((hMax - h) * unit, 0, unit, CANVAS_HEIGHT);
        }
      },
    };
    const getClickedInfo = movedData.find((element) => {
      if (clickedObject && clickedObject[0].object &&
        clickedObject[0].object.movesbaseidx === element.movesbaseidx) {
        return true;
      }
      return false;
    });
    return (
      <div className="harmovis_header container" id="header_area">
        <SimulationDateTime settime={settime} locales={t('locales')} className="harmovis_header__spacer" />
        <span id="bus_count" className="harmovis_header__spacer">{movedData.length}&nbsp;{t('Operating')}</span>
        {Object.keys(busoption).length <= 0 ?
          <span className="harmovis_header__spacer">{t('busoption')}{t('non')}</span> :
          <span className="harmovis_header__spacer">{t('busoption')}{`：${bsoptFname}`}</span>
        }
        {Object.keys(busoption).length > 0 &&
          (busoption.busmovesoption || busoption.busstopsoption) &&
          <input
            className="harmovis_header__input"
            type="range" value={elevationScale} min="1" max="20" step="1"
            onChange={this.setScaleElevation.bind(this)}
          />}
        <br />
        <span className="harmovis_header__spacer">{t('delayrange')} 0{t('minute')}</span>
        <CanvasComponent {...canvasProps} />
        <span className="harmovis_header__spacer">～{delayrange}{t('minute')}</span>
        {flg && clickedObject && <span className="harmovis_header__spacer">{t('TD_display')}</span>}
        {flg && clickedObject &&
          <span className="harmovis_header__spacer">
            <input
              className="harmovis_header__input"
              type="range" value={delayheight} min="0" max="10" step="1"
              onChange={this.setDelayHeight.bind(this)}
            />
          </span>
        }
        {getClickedInfo &&
          <div>
            <span className="harmovis_header__spacer">
            {t('busInformation')}&nbsp;
              <button onClick={this.onBusReleaseClick.bind(this)} className="harmovis_button" style={{ width: '80px' }}>{t('release')}</button>
            </span>
            <span className="harmovis_header__spacer">
              {getClickedInfo.code} {getClickedInfo.name} {getClickedInfo.memo}
            </span>
          </div>
        }
      </div>
    );
  }
}
