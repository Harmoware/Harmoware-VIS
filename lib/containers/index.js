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

var _library = require('../library');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Root = function (_Component) {
  (0, _inherits3.default)(Root, _Component);

  function Root(props) {
    (0, _classCallCheck3.default)(this, Root);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Root.__proto__ || (0, _getPrototypeOf2.default)(Root)).call(this, props));

    _this.animationFrame = window.requestAnimationFrame(_this.animate.bind(_this));
    return _this;
  }

  (0, _createClass3.default)(Root, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      window.addEventListener('resize', this.resize.bind(this));
      this.resize();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.animationFrame) {
        window.cancelAnimationFrame(this.animationFrame);
      }
    }
  }, {
    key: 'animate',
    value: function animate() {
      var _props = this.props,
          timeLength = _props.timeLength,
          animatePause = _props.animatePause,
          animateReverse = _props.animateReverse,
          actions = _props.actions,
          leading = _props.leading,
          secpermin = _props.secpermin;

      if (timeLength > 0) {
        if (!animatePause) {
          if (!animateReverse) {
            actions.increaseTime(this.props);
          } else {
            actions.decreaseTime(this.props);
          }
        } else {
          actions.setFrameTimestamp(this.props);
        }
      } else {
        actions.setTimeStamp(Date.now() + (0, _library.calcLoopTime)(leading, secpermin));
      }
      this.animationFrame = window.requestAnimationFrame(this.animate.bind(this));
    }
  }, {
    key: 'resize',
    value: function resize() {
      this.props.actions.setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
  }]);
  return Root;
}(_react.Component);

exports.default = Root;