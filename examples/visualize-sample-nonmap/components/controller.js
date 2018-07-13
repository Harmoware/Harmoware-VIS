// @flow

import React, { Component } from 'react';
import { MovesInput, DepotsInput, LinemapInput,
  AddMinutesButton, PlayButton, PauseButton, ReverseButton, ForwardButton,
  ElapsedTimeRange, SpeedRange, SimulationDateTime } from 'harmoware-vis';
import type { Actions, InputEvent } from 'harmoware-vis';
import i18n from './../I18n';

type ControllerProps = {
  settime: number,
  timeBegin: number,
  timeLength: number,
  secperhour: number,
  animatePause: boolean,
  animateReverse: boolean,
  animatePause: boolean,
  actions: Actions,
  t: Function,
}

export default class Controller extends Component<ControllerProps> {

  onLanguageSelect(e: InputEvent) {
    const value = e.target.value;
    i18n.changeLanguage(value);
  }

  render() {
    const { settime, timeBegin, timeLength, actions,
      secperhour, animatePause, animateReverse, t } = this.props;

    const playCaption = `⏯️ ${t('play')}`;
    const pauseCaption = `⏯️ ${t('pause')}`;
    const forwardCaption = `️️️️️️️▶️ ${t('forward')}`;
    const reverseCaption = `◀️ ${t('reverse')}`;
    const minusTenCaption = `⏮ -10${t('minute')}`;
    const minusFiveCaption = `⏮ -5${t('minute')}`;
    const plusFiveCaption = `⏮ 5${t('minute')}`;
    const plusTenCaption = `⏮ 10${t('minute')}`;

    return (
      <div id="controller_area">
        <ul>
          <li>
            <select
              id="language_select" value={t('langId')}
              onChange={this.onLanguageSelect.bind(this)}
            >
              <option value="ja">日本語</option>
              <option value="en">English</option>
            </select>
          </li>
          <li>
            <span>{t('movedData')}</span>
            <MovesInput actions={actions} />
          </li>
          <li>
            <span>{t('depotsData')}</span>
            <DepotsInput actions={actions} />
          </li>
          <li>
            <span>{t('mapData')}</span>
            <LinemapInput actions={actions} />
          </li>
          <li>
            {animatePause ?
              <PlayButton actions={actions}>{playCaption}</PlayButton> :
              <PauseButton actions={actions}>{pauseCaption}</PauseButton>
            }&nbsp;
            {animateReverse ?
              <ForwardButton actions={actions}>{forwardCaption}</ForwardButton> :
              <ReverseButton actions={actions}>{reverseCaption}</ReverseButton>
            }
          </li>
          <li>
            <AddMinutesButton addMinutes={-10} actions={actions}>{minusTenCaption}
            </AddMinutesButton>&nbsp;
            <AddMinutesButton addMinutes={-5} actions={actions}>{minusFiveCaption}
            </AddMinutesButton>&nbsp;
            <AddMinutesButton addMinutes={5} actions={actions}>{plusFiveCaption}
            </AddMinutesButton>&nbsp;
            <AddMinutesButton addMinutes={10} actions={actions}>{plusTenCaption}
            </AddMinutesButton>
          </li>
          <li>
            <SimulationDateTime timeBegin={timeBegin} settime={settime} locales={t('locales')} />
          </li>
          <li><span>{t('elapsedTime')}</span>
            <ElapsedTimeRange settime={settime} timeLength={timeLength} actions={actions} />
            <span>{Math.floor(settime)}&nbsp;{t('sec')}</span>
          </li>
          <li><span>{t('speed')}</span>
            <SpeedRange secperhour={secperhour} actions={actions} />
            <span>{secperhour}&nbsp;{t('sec')}/{t('hour')}</span>
          </li>
        </ul>
      </div>
    );
  }
}
