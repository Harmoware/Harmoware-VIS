var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { settings } from 'harmoware-vis';
var COLOR1 = settings.COLOR1, COLOR2 = settings.COLOR2, COLOR3 = settings.COLOR3, COLOR4 = settings.COLOR4;
export var p02d = function (val) {
    if (val < 10) {
        return "0" + val;
    }
    return "" + val;
};
export var p04d = function (val) { return ("0000" + val).substr(-4); };
export var hsvToRgb = function (H, S, V) {
    var _a, _b, _c, _d, _e, _f, _g;
    var C = V * S;
    var Hp = H / 60;
    var X = C * (1 - Math.abs((Hp % 2) - 1));
    var R;
    var G;
    var B;
    if (Hp >= 0 && Hp < 1) {
        _a = [C, X, 0], R = _a[0], G = _a[1], B = _a[2];
    }
    if (Hp >= 1 && Hp < 2) {
        _b = [X, C, 0], R = _b[0], G = _b[1], B = _b[2];
    }
    if (Hp >= 2 && Hp < 3) {
        _c = [0, C, X], R = _c[0], G = _c[1], B = _c[2];
    }
    if (Hp >= 3 && Hp < 4) {
        _d = [0, X, C], R = _d[0], G = _d[1], B = _d[2];
    }
    if (Hp >= 4 && Hp < 5) {
        _e = [X, 0, C], R = _e[0], G = _e[1], B = _e[2];
    }
    if (Hp >= 5 && Hp < 6) {
        _f = [C, 0, X], R = _f[0], G = _f[1], B = _f[2];
    }
    var m = V - C;
    _g = [R + m, G + m, B + m], R = _g[0], G = _g[1], B = _g[2];
    R = Math.floor(R * 255);
    G = Math.floor(G * 255);
    B = Math.floor(B * 255);
    return [R, G, B];
};
export var delaycolor = function (delaysec, delayrange) {
    var color = 0;
    if (delaysec < 0) {
        color = 120;
    }
    else if (delaysec < (60 * delayrange)) {
        color = 120 - Math.floor(delaysec / ((60 * delayrange) / 120));
    }
    return hsvToRgb(color, 1, 1);
};
var getOptionValue = function (optionData) {
    var elevation = 'elevation';
    var color = 'color';
    var memo = 'memo';
    var returnValue = {};
    if (optionData && optionData.elevation) {
        if (!Array.isArray(optionData.elevation)) {
            returnValue.optElevation = [optionData.elevation];
        }
        else {
            returnValue.optElevation = optionData.elevation;
        }
    }
    if (optionData && optionData.color) {
        if (!Array.isArray(optionData.color[0])) {
            returnValue.optColor = [optionData.color];
        }
        else {
            returnValue.optColor = optionData.color;
        }
    }
    if (optionData && optionData.memo) {
        returnValue[memo] = optionData.memo;
    }
    return returnValue;
};
export var getBusstopOptionValue = function (props, busstopsbaseidx) {
    var depotsBase = props.depotsBase, settime = props.settime, selectedBusstop = props.selectedBusstop, hovered = props.hovered;
    var _a = depotsBase[busstopsbaseidx], code = _a.code, name = _a.name, option = _a.option;
    var color = COLOR4;
    var radius = 30;
    if (selectedBusstop === code) {
        color = COLOR3;
    }
    if (hovered && hovered.object && hovered.object.code === code) {
        radius = 50;
    }
    var optionValue = {};
    if (option && option.stime <= settime) {
        for (var i = 0, lengthi = option.data.length; i < lengthi; i += 1) {
            var optiondata = option.data[i];
            if ((optiondata.time <= settime && settime <= option.etime) ||
                (option.etime < settime && i === (lengthi - 1))) {
                optionValue = Object.assign({}, optionValue, __assign({}, getOptionValue(optiondata)));
            }
        }
    }
    return __assign({ code: code, name: name, color: color, radius: radius }, optionValue);
};
export var getBusOptionValue = function (props, movesbaseidx, operationidx) {
    var movesbase = props.movesbase, delayrange = props.delayrange, clickedObject = props.clickedObject, hovered = props.hovered;
    var _a = movesbase[movesbaseidx], busclass = _a.busclass, operation = _a.operation;
    var _b = operation[operationidx], specifycolor = _b.color, delaysec = _b.delaysec, busprop = _b.busprop;
    var clickedbus = (clickedObject && clickedObject[0].object &&
        clickedObject[0].object.movesbaseidx === movesbaseidx);
    var hoveredbus = (hovered && hovered.object &&
        hovered.object.movesbaseidx === movesbaseidx);
    var color = COLOR2;
    if (operationidx !== 0) {
        if (clickedbus) {
            color = COLOR3;
        }
        else if (delaysec) {
            color = delaycolor(delaysec, delayrange);
        }
        else {
            color = specifycolor || COLOR1;
        }
    }
    var radius = 80;
    if (operationidx !== 0) {
        if (hoveredbus) {
            radius = 50;
        }
        else if (clickedbus) {
            radius = 30;
        }
        else {
            radius = 20;
        }
    }
    var code = '9999';
    var name = 'バス';
    var optionValue = {};
    if (busclass) {
        var systemcode = busclass.systemcode, direction = busclass.direction, systemname = busclass.systemname, diagramid = busclass.diagramid, timetable = busclass.timetable;
        code = diagramid;
        name = systemcode + "-" + direction + " " + timetable + "\u767A " + systemname;
        optionValue = getOptionValue(busprop);
    }
    return __assign({ code: code,
        name: name,
        color: color,
        radius: radius }, optionValue, { sourcePosition: undefined, targetPosition: undefined });
};
export var updateArcLayerData = function (props) {
    var busoption = props.busoption, archbase = props.archbase, bustripscsv = props.bustripscsv, bustripindex = props.bustripindex, busstopscsv = props.busstopscsv, actions = props.actions, timeBegin = props.timeBegin, settime = props.settime;
    if (!busoption.archoption || busoption.archoption.length === 0 ||
        bustripscsv.length === 0 || busstopscsv.length === 0 || timeBegin === 0) {
        return []; // データがない
    }
    if (Object.keys(bustripindex).length === 0) {
        var d = new Date(timeBegin * 1000);
        var date_1 = [d.getFullYear(), d.getMonth(), d.getDate()];
        var bssidx_1 = {};
        busstopscsv.forEach(function (current, idx) {
            bssidx_1[current.code] = idx;
        });
        bustripscsv.forEach(function (csvdata) {
            var diagramid = csvdata.diagramid, timetable = csvdata.timetable, actualdep = csvdata.actualdep, busstopcode = csvdata.busstopcode, busstoporder = csvdata.busstoporder;
            if (timetable.match(/\d{1,2}:\d\d/) && actualdep.match(/\d{1,2}:\d\d:\d\d/) && bssidx_1[busstopcode]) {
                var hms = actualdep.split(':').map(function (current) { return parseInt(current, 10); });
                var timeDeparture = new (Date.bind.apply(Date, [void 0].concat(date_1, [hms[0], hms[1], hms[2], 0])))().getTime() / 1000;
                var busstopinfo = busstopscsv[bssidx_1[busstopcode]];
                bustripindex[diagramid + "-" + busstopcode + "-" + busstoporder] = {
                    elapsedtime: (timeDeparture - timeBegin),
                    position: [busstopinfo.longitude, busstopinfo.latitude]
                };
            }
        });
        actions.setBusTripIndex(bustripindex);
    }
    if (Object.keys(bustripindex).length > 0 && archbase.length === 0) {
        var archoption = busoption.archoption;
        archoption.forEach(function (optiondata) {
            var diagramId = optiondata.diagramId, sourceDepotsCode = optiondata.sourceDepotsCode, sourceDepotsOrder = optiondata.sourceDepotsOrder, targetDepotsCode = optiondata.targetDepotsCode, targetDepotsOrder = optiondata.targetDepotsOrder;
            if (diagramId && sourceDepotsCode && sourceDepotsOrder &&
                targetDepotsCode && targetDepotsOrder) {
                var sourceInfo = bustripindex[diagramId + "-" + sourceDepotsCode + "-" + sourceDepotsOrder];
                var targetInfo = bustripindex[diagramId + "-" + targetDepotsCode + "-" + targetDepotsOrder];
                if (sourceInfo && targetInfo) {
                    archbase.push({
                        departuretime: sourceInfo.elapsedtime,
                        arrivaltime: targetInfo.elapsedtime,
                        arcdata: __assign({ sourcePosition: sourceInfo.position, targetPosition: targetInfo.position }, optiondata)
                    });
                }
            }
        });
        actions.setArchBase(archbase);
    }
    var arcdata = [];
    archbase.forEach(function (archbasedata) {
        var departuretime = archbasedata.departuretime, arrivaltime = archbasedata.arrivaltime, basearcdata = archbasedata.arcdata;
        if (departuretime <= settime && settime <= arrivaltime) {
            arcdata.push(__assign({}, basearcdata));
        }
    });
    return arcdata;
};
//# sourceMappingURL=index.js.map