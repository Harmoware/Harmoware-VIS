import { settings } from 'harmoware-vis';
import { Bus3dProps, Arcdata, ComObj } from '../types'

const {isArray} = Array;
const {abs} = Math;
const {assign,keys} = Object;

export const p02d = (val: number) => {
  if (val < 10) {
    return `0${val}`;
  }
  return `${val}`;
};

export const p04d = (val: string) => (`0000${val}`).substr(-4);

export const hsvToRgb = (H: number, S: number, V: number) => {
  const C = V * S;
  const Hp = H / 60;
  const X = C * (1 - abs((Hp % 2) - 1));

  let R: number, G: number, B: number;
  if (Hp >= 0 && Hp < 1) { [R, G, B] = [C, X, 0]; }
  if (Hp >= 1 && Hp < 2) { [R, G, B] = [X, C, 0]; }
  if (Hp >= 2 && Hp < 3) { [R, G, B] = [0, C, X]; }
  if (Hp >= 3 && Hp < 4) { [R, G, B] = [0, X, C]; }
  if (Hp >= 4 && Hp < 5) { [R, G, B] = [X, 0, C]; }
  if (Hp >= 5 && Hp < 6) { [R, G, B] = [C, 0, X]; }

  const m = V - C;
  [R, G, B] = [R + m, G + m, B + m];

  R = (R * 255)|0;
  G = (G * 255)|0;
  B = (B * 255)|0;

  return [R, G, B];
};

export const delaycolor = (delaysec: number, delayrange: number) => {
  let color = 0;
  if (delaysec < 0) {
    color = 120;
  } else if (delaysec < (60 * delayrange)) {
    color = 120 - ((delaysec / ((60 * delayrange) / 120))|0);
  }
  return hsvToRgb(color, 1, 1);
};

const getOptionValue = (optionData: { elevation?: (number | number[]),
  color?: (number[] | number[][]), memo?: string }) => {
  const returnValue: { optElevation?: number[],
    optColor?: number[][], memo?: string } = {};
  if(optionData){
    const { elevation, color, memo } = optionData;
    if (elevation) {
      if (isArray(elevation)) {
        returnValue.optElevation = elevation;
      } else {
        returnValue.optElevation = [elevation];
      }
    }
    if (color) {
      if (isArray(color[0])) {
        returnValue.optColor = color as number[][];
      } else {
        returnValue.optColor = [color as number[]];
      }
    }
    if (memo) {
      returnValue.memo = memo;
    }
  }
  return returnValue;
};

export const getBusstopOptionValue = (props: Bus3dProps, busstopsbaseidx: number) => {
  const { depotsBase, settime, timeBegin, selectedBusstop, hovered } = props;
  const currentTime = settime - timeBegin;
  const { code, name, option } = depotsBase[busstopsbaseidx];
  let color = settings.COLOR4;
  let radius = 30;
  if (selectedBusstop === code) {
    color = settings.COLOR3;
  }
  if (hovered && hovered.object && hovered.object.code === code) {
    radius = 50;
  }
  let optionValue = {};
  if (option && option.stime <= currentTime) {
    for (let i = 0, lengthi = option.data.length; i < lengthi; i=(i+1)|0) {
      const optiondata = option.data[i];
      if ((optiondata.time <= currentTime && currentTime <= option.etime) ||
          (option.etime < currentTime && i === (lengthi - 1))) {
        optionValue = assign({}, optionValue, {
          ...getOptionValue(optiondata)
        });
      }
    }
  }
  return { code, name, color, radius, ...optionValue };
};

export const getBusOptionValue = (props: Bus3dProps, movesbaseidx: number, operationidx: number) => {
  const { movesbase, delayrange, clickedObject, hovered } = props;
  const { busclass, operation } = movesbase[movesbaseidx];
  const { color: specifycolor, delaysec, busprop } = operation[operationidx];
  const clickedbus = (clickedObject && clickedObject[0].object &&
    clickedObject[0].object.movesbaseidx === movesbaseidx);
  const hoveredbus = (hovered && hovered.object &&
    hovered.object.movesbaseidx === movesbaseidx);
  let color = settings.COLOR2;
  if (operationidx !== 0) {
    if (clickedbus) {
      color = settings.COLOR3;
    } else if (delaysec) {
      color = delaycolor(delaysec, delayrange);
    } else {
      color = specifycolor || settings.COLOR1;
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
  return {
    code,
    name,
    color,
    radius,
    ...optionValue,
    sourcePosition: null,
    targetPosition: null };
};

export const updateArcLayerData = (props: Bus3dProps) => {
  const { busoption, archbase, bustripscsv, bustripindex, busstopscsv,
    actions, timeBegin, settime } = props;
  const currentTime = settime - timeBegin;
  if (!busoption.archoption || busoption.archoption.length === 0 ||
    bustripscsv.length === 0 || busstopscsv.length === 0 || timeBegin === 0) {
    return []; // データがない
  }

  if (keys(bustripindex).length === 0) {
    const d = new Date(timeBegin * 1000);
    const date: number[] = [d.getFullYear(), d.getMonth(), d.getDate()];

    const bssidx: ComObj<number> = {};
    busstopscsv.forEach((current, idx) => {
      bssidx[current.code] = idx;
    });

    bustripscsv.forEach((csvdata) => {
      const { diagramid, timetable, actualdep, busstopcode, busstoporder } = csvdata;
      if (timetable.match(/\d{1,2}:\d\d/) && actualdep.match(/\d{1,2}:\d\d:\d\d/) && bssidx[busstopcode]) {
        const hms = actualdep.split(':').map(current => +current);
        const timeDeparture = new Date(date[0], date[1], date[2], hms[0], hms[1], hms[2], 0).getTime() / 1000;
        const busstopinfo = busstopscsv[bssidx[busstopcode]];
        bustripindex[`${diagramid}-${busstopcode}-${busstoporder}`] = {
          elapsedtime: (timeDeparture - timeBegin),
          position: [busstopinfo.longitude, busstopinfo.latitude]
        };
      }
    });
    actions.setBusTripIndex(bustripindex);
  }

  if (keys(bustripindex).length > 0 && archbase.length === 0) {
    const { archoption } = busoption;
    archoption.forEach((optiondata) => {
      const { diagramId, sourceDepotsCode, sourceDepotsOrder,
        targetDepotsCode, targetDepotsOrder } = optiondata;
      if (diagramId && sourceDepotsCode && sourceDepotsOrder &&
        targetDepotsCode && targetDepotsOrder) {
        const sourceInfo = bustripindex[`${diagramId}-${sourceDepotsCode}-${sourceDepotsOrder}`];
        const targetInfo = bustripindex[`${diagramId}-${targetDepotsCode}-${targetDepotsOrder}`];
        if (sourceInfo && targetInfo) {
          archbase.push({
            departuretime: sourceInfo.elapsedtime,
            arrivaltime: targetInfo.elapsedtime,
            arcdata: {
              sourcePosition: sourceInfo.position,
              targetPosition: targetInfo.position,
              ...optiondata
            }
          });
        }
      }
    });
    actions.setArchBase(archbase);
  }

  const arcdata: Arcdata[] = [];
  const selectarchbase = archbase.filter((data)=>{
    return (data.departuretime <= currentTime && currentTime <= data.arrivaltime);
  });
  for (const selectarchbaseElement of selectarchbase) {
    arcdata.push({ ...selectarchbaseElement.arcdata });
  }
  return arcdata;
};
