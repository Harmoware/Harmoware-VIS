import { settings, getContainerProp as baseGetContainerProp } from 'harmoware-vis';

const { COLOR1, COLOR2, COLOR3, COLOR4 } = settings;

export const p02d = (val) => {
  if (val < 10) {
    return `0${val}`;
  }
  return `${val}`;
};

export const p04d = val => (`0000${val}`).substr(-4);

export const hsvToRgb = (H, S, V) => {
  const C = V * S;
  const Hp = H / 60;
  const X = C * (1 - Math.abs((Hp % 2) - 1));

  let R;
  let G;
  let B;
  if (Hp >= 0 && Hp < 1) { [R, G, B] = [C, X, 0]; }
  if (Hp >= 1 && Hp < 2) { [R, G, B] = [X, C, 0]; }
  if (Hp >= 2 && Hp < 3) { [R, G, B] = [0, C, X]; }
  if (Hp >= 3 && Hp < 4) { [R, G, B] = [0, X, C]; }
  if (Hp >= 4 && Hp < 5) { [R, G, B] = [X, 0, C]; }
  if (Hp >= 5 && Hp < 6) { [R, G, B] = [C, 0, X]; }

  const m = V - C;
  [R, G, B] = [R + m, G + m, B + m];

  R = Math.floor(R * 255);
  G = Math.floor(G * 255);
  B = Math.floor(B * 255);

  return [R, G, B];
};

export const delaycolor = (delaysec, delayrange) => {
  let color = 0;
  if (delaysec < 0) {
    color = 120;
  } else if (delaysec < (60 * delayrange)) {
    color = 120 - Math.floor(delaysec / ((60 * delayrange) / 120));
  }
  return hsvToRgb(color, 1, 1);
};

const getOptionValue = (optionData) => {
  const elevation = 'elevation';
  const color = 'color';
  const memo = 'memo';
  const returnValue = {};
  if (optionData && optionData.elevation) {
    if (!Array.isArray(optionData.elevation)) {
      returnValue.optElevation = [optionData.elevation];
    } else {
      returnValue.optElevation = optionData.elevation;
    }
  }
  if (optionData && optionData.color) {
    if (!Array.isArray(optionData.color[0])) {
      returnValue.optColor = [optionData.color];
    } else {
      returnValue.optColor = optionData.color;
    }
  }
  if (optionData && optionData.memo) {
    returnValue[memo] = optionData.memo;
  }
  return returnValue;
};

export const getBusstopOptionValue = (props, busstopsbaseidx) => {
  const { depotsBase, settime, selectedBusstop, hovered } = props;
  const { code, name, option } = depotsBase[busstopsbaseidx];
  let color = COLOR4;
  let radius = 30;
  if (selectedBusstop === code) {
    color = COLOR3;
  }
  if (hovered && hovered.object && hovered.object.code === code) {
    radius = 50;
  }
  let optionValue = {};
  if (option && option.stime <= settime) {
    for (let i = 0, lengthi = option.data.length; i < lengthi; i += 1) {
      const optiondata = option.data[i];
      if ((optiondata.time <= settime && settime <= option.etime) ||
          (option.etime < settime && i === (lengthi - 1))) {
        optionValue = Object.assign({}, optionValue, {
          ...getOptionValue(optiondata)
        });
      }
    }
  }
  return { code, name, color, radius, ...optionValue };
};

export const getBusOptionValue = (props, movesbaseidx, operationidx) => {
  const { movesbase, delayrange, clickedObject, hovered } = props;
  const { busclass, operation } = movesbase[movesbaseidx];
  const { color: specifycolor, delaysec, busprop } = operation[operationidx];
  const clickedbus = (clickedObject && clickedObject.object &&
    clickedObject.object.movesbaseidx === movesbaseidx);
  const hoveredbus = (hovered && hovered.object &&
    hovered.object.movesbaseidx === movesbaseidx);
  let color = COLOR2;
  if (operationidx !== 0) {
    if (clickedbus) {
      color = COLOR3;
    } else if (delaysec) {
      color = delaycolor(delaysec, delayrange);
    } else {
      color = specifycolor || COLOR1;
    }
  }
  let radius = 80;
  if (operationidx !== 0) {
    if (hoveredbus) {
      radius = 50;
    } else if (clickedbus) {
      radius = 30;
    } else {
      radius = 20;
    }
  }
  let code = '9999';
  let name = 'バス';
  let optionValue = {};
  if (busclass) {
    const { systemcode, direction, systemname, diagramid, timetable } = busclass;
    code = diagramid;
    name = `${systemcode}-${direction} ${timetable}発 ${systemname}`;
    optionValue = getOptionValue(busprop);
  }
  return { code, name, color, radius, ...optionValue };
};

export const getContainerProp = state => ({
  ...baseGetContainerProp(state),
  ...state.controller,
  ...state.data,
  ...state.bus3d
});
