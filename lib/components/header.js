'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

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

var _canvasComponent = require('./canvas-component');

var _canvasComponent2 = _interopRequireDefault(_canvasComponent);

var _lib = require('../lib/');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var weekDayList = ['日', '月', '火', '水', '木', '金', '土'];
var CANVAS_WIDTH = 240;
var CANVAS_HEIGHT = 20;

var Header = function (_Component) {
  (0, _inherits3.default)(Header, _Component);

  function Header() {
    (0, _classCallCheck3.default)(this, Header);
    return (0, _possibleConstructorReturn3.default)(this, (Header.__proto__ || (0, _getPrototypeOf2.default)(Header)).apply(this, arguments));
  }

  (0, _createClass3.default)(Header, [{
    key: 'onBusReleaseClick',


    /*  constructor(props) {
        super(props);
      } */

    value: function onBusReleaseClick() {
      var actions = this.props.actions;

      actions.setClicked(null);
      actions.setRoutePaths([]);
    }
  }, {
    key: 'setDelayHeight',
    value: function setDelayHeight(e) {
      var _props = this.props,
          actions = _props.actions,
          clicked = _props.clicked;

      actions.setDelayHeight(e.target.value);
      actions.updateRoute(clicked, false);
    }
  }, {
    key: 'setScaleElevation',
    value: function setScaleElevation(e) {
      this.props.actions.setScaleElevation(e.target.value);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          date = _props2.date,
          busmoves = _props2.busmoves,
          busstopsoption = _props2.busstopsoption,
          bsoptFname = _props2.bsoptFname,
          elevationScale = _props2.elevationScale,
          clicked = _props2.clicked,
          delayrange = _props2.delayrange,
          delayheight = _props2.delayheight;

      var d = new Date(date);
      var year = d.getFullYear();
      var month = d.getMonth() + 1;
      var day = d.getDate();
      var wday = weekDayList[d.getDay()];
      var hour = d.getHours();
      var min = d.getMinutes();
      var sec = d.getSeconds();
      var flg = clicked ? clicked.object.name.match(/^\d+-[12]/) : null;
      var canvasProps = {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        updateCanvas: function updateCanvas(context) {
          var cont = context;
          var hMin = 0;
          var hMax = 120;
          var unit = CANVAS_WIDTH / hMax;
          for (var h = hMin; h <= hMax; h += 1) {
            cont.fillStyle = 'rgb(' + (0, _lib.hsvToRgb)(h, 1, 1).join(',') + ')';
            cont.fillRect((hMax - h) * unit, 0, unit, CANVAS_HEIGHT);
          }
        }
      };
      return _react2.default.createElement(
        'div',
        { id: 'header' },
        _react2.default.createElement(
          'span',
          null,
          year + '/' + (0, _lib.p02d)(month) + '/' + (0, _lib.p02d)(day) + '(' + wday + ')' + (0, _lib.p02d)(hour) + ':' + (0, _lib.p02d)(min) + ':' + (0, _lib.p02d)(sec)
        ),
        _react2.default.createElement(
          'span',
          { id: 'bus_count' },
          busmoves.length,
          ' \u53F0\u904B\u884C\u4E2D'
        ),
        (0, _keys2.default)(busstopsoption).length <= 0 ? _react2.default.createElement(
          'span',
          null,
          '\u30D0\u30B9\u62E1\u5F35\u60C5\u5831\u306A\u3057'
        ) : _react2.default.createElement(
          'span',
          null,
          '\u30D0\u30B9\u62E1\u5F35\u60C5\u5831\uFF1A' + bsoptFname
        ),
        (0, _keys2.default)(busstopsoption).length > 0 && _react2.default.createElement('input', {
          type: 'range', value: elevationScale, min: '1', max: '20', step: '1',
          onChange: this.setScaleElevation.bind(this)
        }),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          'span',
          null,
          '\u9045\u5EF6 0\u5206'
        ),
        _react2.default.createElement(_canvasComponent2.default, canvasProps),
        _react2.default.createElement(
          'span',
          null,
          '\uFF5E',
          delayrange,
          '\u5206'
        ),
        flg && clicked && _react2.default.createElement(
          'span',
          null,
          '\uFF13\uFF24\u8868\u793A'
        ),
        flg && clicked && _react2.default.createElement(
          'span',
          null,
          _react2.default.createElement('input', {
            type: 'range', value: delayheight, min: '0', max: '10', step: '1',
            onChange: this.setDelayHeight.bind(this)
          })
        ),
        clicked && _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'span',
            null,
            '\u9078\u629E\u30D0\u30B9\u60C5\u5831',
            _react2.default.createElement(
              'button',
              { onClick: this.onBusReleaseClick.bind(this) },
              '\u89E3\u9664'
            )
          ),
          _react2.default.createElement(
            'span',
            null,
            clicked.object.code,
            ' ',
            clicked.object.name,
            ' ',
            clicked.object.memo
          )
        )
      );
    }
  }]);
  return Header;
}(_react.Component);

exports.default = Header;