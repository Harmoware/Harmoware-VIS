import * as React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_play_circle_outline as icPlayArrow, ic_pause_circle_outline as icPause,
  ic_forward as icForward, ic_replay as icReplay,
  ic_fast_forward as icFastForward, ic_fast_rewind as icFastRewind } from 'react-icons-kit/md';
import { MovesInput, DepotsInput, LinemapInput,
  AddMinutesButton, PlayButton, PauseButton, ReverseButton, ForwardButton,
  ElapsedTimeRange, ElapsedTimeValue, SpeedRange, SpeedValue,
  SimulationDateTime, NavigationButton, BasedProps, Viewport } from 'harmoware-vis';
import i18n from '../locales/I18n';

interface Props extends BasedProps {
  t: (key: string) => string,
  viewport: Viewport,
}

export default class Controller extends React.Component<Props> {
  onLanguageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    i18n.changeLanguage(value);
  }

  render() {
    const { settime, timeBegin, timeLength, actions,
      secperhour, animatePause, animateReverse, t, viewport } = this.props;

    return (
      <div className="harmovis_controller">
        <ul className="harmovis_controller__list">
          <li className="harmovis_controller__list__item">
            <select
              className="harmovis_controller__select"
              id="language_select" value={t('langId')}
              onChange={this.onLanguageSelect.bind(this)}
            >
              <option value="ja">日本語</option>
              <option value="en">English</option>
            </select>
          </li>
          <hr />
          <li className="harmovis_controller__list__item">
            <span className="harmovis_controller__spacer">{t('movedData')}</span>
            <MovesInput actions={actions} className="caInput" />
          </li>
          <li className="harmovis_controller__list__item">
            <span className="harmovis_controller__spacer">{t('depotsData')}</span>
            <DepotsInput actions={actions} className="caInput" />
          </li>
          <li className="harmovis_controller__list__item">
            <span className="harmovis_controller__spacer">{t('mapData')}</span>
            <LinemapInput actions={actions} className="caInput" />
          </li>
          <hr />
          <li className="harmovis_controller__list__button">
            {animatePause ?
              <PlayButton actions={actions} className="caButton">
                <span><Icon icon={icPlayArrow} />&nbsp;{t('play')}</span></PlayButton> :
              <PauseButton actions={actions} className="caButton">
                <span><Icon icon={icPause} />&nbsp;{t('pause')}</span></PauseButton>
            }
            {animateReverse ?
              <ForwardButton actions={actions} className="caButton">
                <span><Icon icon={icForward} />&nbsp;{t('forward')}</span></ForwardButton> :
              <ReverseButton actions={actions} className="caButton">
                <span><Icon icon={icReplay} />&nbsp;{t('reverse')}</span></ReverseButton>
            }
          </li>
          <li className="harmovis_controller__list__button">
            <AddMinutesButton addMinutes={-10} actions={actions} className="caButton">
              <span><Icon icon={icFastRewind} />&nbsp;-10{t('minute')}</span></AddMinutesButton>
            <AddMinutesButton addMinutes={-5} actions={actions} className="caButton">
              <span><Icon icon={icFastRewind} />&nbsp;-5{t('minute')}</span></AddMinutesButton>
            <AddMinutesButton addMinutes={5} actions={actions} className="caButton">
              <span><Icon icon={icFastForward} />&nbsp;5{t('minute')}</span></AddMinutesButton>
            <AddMinutesButton addMinutes={10} actions={actions} className="caButton">
              <span><Icon icon={icFastForward} />&nbsp;10{t('minute')}</span></AddMinutesButton>
          </li>
          <li className="harmovis_controller__list__button">
            <NavigationButton buttonType="zoom-in" actions={actions} viewport={viewport} className="caButton" />
            <NavigationButton buttonType="zoom-out" actions={actions} viewport={viewport} className="caButton" />
            <NavigationButton buttonType="compass" actions={actions} viewport={viewport} className="caButton" />
          </li>
          <hr />
          <li className="harmovis_controller__list__item">
            <SimulationDateTime settime={settime} locales={t('locales')} className="caSpan" />
          </li>
          <hr />
          <li className="harmovis_controller__list__item">
            <span className="harmovis_controller__spacer">{t('elapsedTime')}
              <ElapsedTimeValue settime={settime} timeBegin={timeBegin} timeLength={timeLength} actions={actions} />{t('sec')}</span>
            <ElapsedTimeRange settime={settime} timeLength={timeLength} timeBegin={timeBegin} actions={actions} className="caRange" />
          </li>
          <hr />
          <li className="harmovis_controller__list__item">
            <span className="harmovis_controller__spacer">{t('speed')}
              <SpeedValue secperhour={secperhour} actions={actions} />{t('sec')}/{t('hour')}</span>
            <SpeedRange secperhour={secperhour} actions={actions} className="caRange" />
          </li>
        </ul>
      </div>
    );
  }
}
