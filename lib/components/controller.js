'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _busstopInfo = require('./busstop-info');

var _busstopInfo2 = _interopRequireDefault(_busstopInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getXbandLabelBySize = function getXbandLabelBySize(cellSize) {
  if (cellSize === 0) {
    return '雨量表示(0)';
  } else if (cellSize <= 50) {
    return '雨量表示(1)';
  } else if (cellSize <= 100) {
    return '雨量表示(2)';
  } else if (cellSize <= 150) {
    return '雨量表示(3)';
  } else if (cellSize >= 200) {
    return '雨量表示(4)';
  }
  return '雨量表示(X)';
};

var getNextCellSize = function getNextCellSize(cellSize) {
  if (cellSize >= 200) {
    return 0;
  }
  return cellSize + 50;
};

var Controller = function (_Component) {
  (0, _inherits3.default)(Controller, _Component);

  function Controller() {
    (0, _classCallCheck3.default)(this, Controller);
    return (0, _possibleConstructorReturn3.default)(this, (Controller.__proto__ || (0, _getPrototypeOf2.default)(Controller)).apply(this, arguments));
  }

  (0, _createClass3.default)(Controller, [{
    key: 'onTripSelect',


    /*  constructor() {
        super();
      } */

    value: function onTripSelect(e) {
      var answer = e.target.value;
      var actions = this.props.actions;

      actions.setAnswer(answer);
      actions.setupFetch(answer);
      actions.setRoutePaths([]);
      actions.setSelectedBusstop('');
      actions.setHovered(null);
      actions.setClicked(null);
      actions.setAnimatePause(false);
      actions.setAnimateReverse(false);
    }
  }, {
    key: 'onBusSelect',
    value: function onBusSelect(e) {
      var _props = this.props,
          actions = _props.actions,
          busmovesbasedic = _props.busmovesbasedic;

      var code = e.target.value;
      var el = {
        object: {
          code: code,
          busmovesbaseidx: busmovesbasedic[code]
        },
        layer: {
          id: 'busmoves'
        }
      };
      actions.updateRoute(el, true);
      actions.setSelectedBus(code);
    }
  }, {
    key: 'onBusstopSelect',
    value: function onBusstopSelect(e) {
      var value = e.target.value;

      var _props2 = this.props,
          actions = _props2.actions,
          busstops = _props2.busstops;


      var busstop = busstops.find(function (busstopElement) {
        if (busstopElement.code === value) {
          return true;
        }
        return false;
      });

      if (!busstop) {
        return;
      }

      actions.setSelectedBusstop(value);
      actions.setViewport({
        longitude: busstop.coordinates[0],
        latitude: busstop.coordinates[1],
        zoom: 16
      });
    }
  }, {
    key: 'setDelayRange',
    value: function setDelayRange(e) {
      var range = e.target.value;
      var _props3 = this.props,
          actions = _props3.actions,
          clicked = _props3.clicked;

      actions.setDelayRange(range);
      actions.updateRoute(clicked, false);
    }
  }, {
    key: 'setCellSize',
    value: function setCellSize() {
      var _props4 = this.props,
          cellSize = _props4.cellSize,
          actions = _props4.actions;

      var nextCellSize = getNextCellSize(cellSize);
      actions.setCellSize(nextCellSize);
      if (nextCellSize === 0) {
        actions.setRainfall({ rainfall: [] });
      }
    }
  }, {
    key: 'start',
    value: function start() {
      var _props5 = this.props,
          settime = _props5.settime,
          timeLength = _props5.timeLength,
          loopTime = _props5.loopTime,
          actions = _props5.actions;

      actions.setAnimatePause(false);
      actions.setTimeStamp(Date.now() - settime / timeLength * loopTime);
    }
  }, {
    key: 'pause',
    value: function pause() {
      this.props.actions.setAnimatePause(true);
    }
  }, {
    key: 'play',
    value: function play(bool) {
      this.props.actions.setAnimateReverse(bool);
    }
  }, {
    key: 'addMinutes',
    value: function addMinutes(minutes) {
      this.props.actions.addMinutes(minutes);
    }
  }, {
    key: 'updateSpeed',
    value: function updateSpeed(e) {
      var _props6 = this.props,
          settime = _props6.settime,
          timeLength = _props6.timeLength,
          actions = _props6.actions,
          animatePause = _props6.animatePause;

      var value = e.target.value;
      var secpermin = 11 - Math.floor(value);
      var loopTime = timeLength / 60 * 1000 * secpermin;
      actions.setSecPerMin(secpermin);
      actions.setLoopTime(loopTime);
      if (!animatePause) {
        actions.setTimeStamp(Date.now() - settime / timeLength * loopTime);
      }
    }
  }, {
    key: 'updateTime',
    value: function updateTime(e) {
      var _props7 = this.props,
          timeLength = _props7.timeLength,
          loopTime = _props7.loopTime,
          actions = _props7.actions;

      var value = e.target.value;
      var newtime = Math.floor(value);
      actions.setTime(newtime);
      actions.setTimeStamp(Date.now() - newtime / timeLength * loopTime);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props8 = this.props,
          selectTripData = _props8.selectTripData,
          settime = _props8.settime,
          timeLength = _props8.timeLength,
          secpermin = _props8.secpermin,
          cellSize = _props8.cellSize,
          selectedBusstop = _props8.selectedBusstop,
          selectedBus = _props8.selectedBus,
          answers = _props8.answers,
          date = _props8.date,
          answer = _props8.answer,
          animatePause = _props8.animatePause,
          animateReverse = _props8.animateReverse,
          xbandFname = _props8.xbandFname,
          delayrange = _props8.delayrange,
          busstops = _props8.busstops,
          busmoves = _props8.busmoves;


      var xBandViewLabel = getXbandLabelBySize(cellSize);

      var optionsTrip = answers.map(function (ans) {
        return _react2.default.createElement(
          'option',
          { value: ans, key: ans },
          ans
        );
      });

      return _react2.default.createElement(
        'div',
        { id: 'controller_area' },
        _react2.default.createElement(
          'ul',
          null,
          _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(
              'span',
              null,
              '\u904B\u884C\u30C7\u30FC\u30BF\u9078\u629E'
            ),
            _react2.default.createElement(
              'span',
              null,
              _react2.default.createElement(
                'select',
                {
                  id: 'trip_select', value: selectTripData,
                  onChange: this.onTripSelect.bind(this)
                },
                optionsTrip
              )
            )
          ),
          _react2.default.createElement(
            'li',
            null,
            animatePause ? _react2.default.createElement(
              'button',
              { onClick: this.start.bind(this) },
              '\uFF1E \u958B\u59CB'
            ) : _react2.default.createElement(
              'button',
              { onClick: this.pause.bind(this) },
              '|| \u4E00\u6642\u505C\u6B62'
            ),
            animateReverse ? _react2.default.createElement(
              'button',
              { onClick: this.play.bind(this, false) },
              '\u6B63\u518D\u751F'
            ) : _react2.default.createElement(
              'button',
              { onClick: this.play.bind(this, true) },
              '\u9006\u518D\u751F'
            )
          ),
          _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(
              'button',
              { onClick: this.addMinutes.bind(this, -10) },
              '<< 10\u5206'
            ),
            _react2.default.createElement(
              'button',
              { onClick: this.addMinutes.bind(this, -5) },
              '<<  5\u5206'
            ),
            _react2.default.createElement(
              'button',
              { onClick: this.addMinutes.bind(this, 5) },
              '5\u5206  >>'
            ),
            _react2.default.createElement(
              'button',
              { onClick: this.addMinutes.bind(this, 10) },
              '10\u5206 >>'
            )
          ),
          _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(
              'span',
              null,
              '\u7D4C\u904E\u6642\u9593'
            ),
            _react2.default.createElement('input', {
              type: 'range', value: Math.floor(settime),
              min: '-10', max: timeLength, step: '1',
              onChange: this.updateTime.bind(this)
            }),
            _react2.default.createElement(
              'span',
              null,
              Math.floor(settime),
              ' \u79D2'
            )
          ),
          _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(
              'span',
              null,
              '\u30B9\u30D4\u30FC\u30C9'
            ),
            _react2.default.createElement('input', {
              type: 'range', value: 11 - secpermin, min: '1', max: '10', step: '1',
              onChange: this.updateSpeed.bind(this)
            }),
            _react2.default.createElement(
              'span',
              null,
              secpermin,
              ' \u79D2/\u5206'
            )
          ),
          _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(
              'span',
              null,
              '\u9045\u5EF6\u5EA6LV'
            ),
            _react2.default.createElement('input', {
              type: 'range', value: delayrange, min: '1', max: '120', step: '1',
              onChange: this.setDelayRange.bind(this)
            }),
            _react2.default.createElement(
              'span',
              null,
              '0\uFF5E',
              delayrange,
              '\u5206'
            )
          ),
          _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(
              'button',
              { onClick: this.setCellSize.bind(this) },
              xBandViewLabel
            ),
            _react2.default.createElement(
              'span',
              null,
              cellSize ? xbandFname : ''
            )
          ),
          _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(
              'span',
              null,
              '\u30D0\u30B9\u505C\u691C\u7D22'
            ),
            _react2.default.createElement(
              'span',
              null,
              _react2.default.createElement(
                'select',
                {
                  id: 'busstop_select', value: selectedBusstop,
                  onChange: this.onBusstopSelect.bind(this)
                },
                _react2.default.createElement(
                  'option',
                  { value: '' },
                  '0000 \u30D0\u30B9\u505C\u3092\u9078\u629E'
                ),
                busstops.map(function (busstop) {
                  return _react2.default.createElement(
                    'option',
                    {
                      value: busstop.code, key: busstop.code
                    },
                    busstop.code,
                    ' ',
                    busstop.name
                  );
                })
              )
            )
          ),
          _react2.default.createElement(
            'li',
            null,
            _react2.default.createElement(_busstopInfo2.default, { selectedBusstop: selectedBusstop, date: date, busstops: busstops })
          ),
          _react2.default.createElement(
            'li',
            null,
            animatePause && busmoves.length > 0 && answer.split('.')[1] === 'csv' && _react2.default.createElement(
              'div',
              null,
              '\u904B\u884C\u4E2D\u30D0\u30B9\u9078\u629E',
              _react2.default.createElement(
                'select',
                { id: 'bus_select', value: selectedBus, onChange: this.onBusSelect.bind(this) },
                busmoves.map(function (bus) {
                  return _react2.default.createElement(
                    'option',
                    { value: bus.code, key: bus.code },
                    bus.code + ':' + bus.name.split(' ')[0] + ' ' + bus.name.split(' ')[1]
                  );
                })
              )
            )
          )
        )
      );
    }
  }]);
  return Controller;
}(_react.Component);

exports.default = Controller;