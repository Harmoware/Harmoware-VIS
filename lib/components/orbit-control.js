'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _deck = require('deck.gl');

var _glMatrix = require('gl-matrix');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Utils */

// constrain number between bounds
function clamp(x, min, max) {
  if (x < min) {
    return min;
  }
  if (x > max) {
    return max;
  }
  return x;
} /* global window */


var ua = typeof window.navigator !== 'undefined' ? window.navigator.userAgent.toLowerCase() : '';
var firefox = ua.indexOf('firefox') !== -1;

/* Interaction */

var OrbitController = function (_React$Component) {
  (0, _inherits3.default)(OrbitController, _React$Component);
  (0, _createClass3.default)(OrbitController, null, [{
    key: 'getViewport',
    value: function getViewport(_ref) {
      var width = _ref.width,
          height = _ref.height,
          lookAt = _ref.lookAt,
          distance = _ref.distance,
          rotationX = _ref.rotationX,
          rotationY = _ref.rotationY,
          fov = _ref.fov;

      var cameraPos = _glMatrix.vec3.add([], lookAt, [0, 0, distance]);
      _glMatrix.vec3.rotateX(cameraPos, cameraPos, lookAt, rotationX / 180 * Math.PI);
      _glMatrix.vec3.rotateY(cameraPos, cameraPos, lookAt, rotationY / 180 * Math.PI);

      return new _deck.PerspectiveViewport({
        width: width,
        height: height,
        lookAt: lookAt,
        far: 1000,
        near: 0.1,
        fovy: fov,
        eye: cameraPos
      });
    }
  }]);

  function OrbitController(props) {
    (0, _classCallCheck3.default)(this, OrbitController);

    var _this = (0, _possibleConstructorReturn3.default)(this, (OrbitController.__proto__ || (0, _getPrototypeOf2.default)(OrbitController)).call(this, props));

    _this.dragStartPos = null;
    return _this;
  }

  (0, _createClass3.default)(OrbitController, [{
    key: 'onDragStart',
    value: function onDragStart(evt) {
      var pageX = evt.pageX,
          pageY = evt.pageY;

      this.dragStartPos = [pageX, pageY];
      this.props.onViewportChange({ isDragging: true });
    }
  }, {
    key: 'onDrag',
    value: function onDrag(evt) {
      if (this.dragStartPos) {
        var pageX = evt.pageX,
            pageY = evt.pageY;
        var _props = this.props,
            width = _props.width,
            height = _props.height;

        var dx = (pageX - this.dragStartPos[0]) / width;
        var dy = (pageY - this.dragStartPos[1]) / height;

        if (evt.shiftKey || evt.ctrlKey || evt.altKey || evt.metaKey) {
          // rotate
          var rotationX = this.props.rotationX;

          var newRotationX = clamp(rotationX - dy * 180, 0, 90);

          this.props.onViewportChange({
            rotationX: newRotationX
          });
        } else {
          // pan
          var _props2 = this.props,
              lookAt = _props2.lookAt,
              distance = _props2.distance,
              fov = _props2.fov;


          var unitsPerPixel = distance / Math.tan(fov / 180 * Math.PI / 2) / 2;

          var newLookAt = _glMatrix.vec3.add([], lookAt, [-unitsPerPixel * dx, unitsPerPixel * dy, 0]);

          this.props.onViewportChange({
            lookAt: newLookAt
          });
        }

        this.dragStartPos = [pageX, pageY];
      }
    }
  }, {
    key: 'onDragEnd',
    value: function onDragEnd() {
      this.dragStartPos = null;
      this.props.onViewportChange({ isDragging: false });
    }
  }, {
    key: 'onWheel',
    value: function onWheel(evt) {
      evt.preventDefault();
      var value = evt.deltaY;
      // Firefox doubles the values on retina screens...
      if (firefox && evt.deltaMode === window.WheelEvent.DOM_DELTA_PIXEL) {
        value /= window.devicePixelRatio;
      }
      if (evt.deltaMode === window.WheelEvent.DOM_DELTA_LINE) {
        value *= 40;
      }
      if (value !== 0 && value % 4.000244140625 === 0) {
        // This one is definitely a mouse wheel event.
        // Normalize this value to match trackpad.
        value = Math.floor(value / 4);
      }

      var _props3 = this.props,
          distance = _props3.distance,
          minDistance = _props3.minDistance,
          maxDistance = _props3.maxDistance;

      var newDistance = clamp(distance * Math.pow(1.001, value), minDistance, maxDistance);

      this.props.onViewportChange({
        distance: newDistance
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        {
          style: { position: 'relative', userSelect: 'none' },
          onMouseDown: this.onDragStart.bind(this),
          onMouseMove: this.onDrag.bind(this),
          onMouseLeave: this.onDragEnd.bind(this),
          onMouseUp: this.onDragEnd.bind(this),
          onWheel: this.onWheel.bind(this)
        },
        this.props.children
      );
    }
  }]);
  return OrbitController;
}(_react2.default.Component);

exports.default = OrbitController;


OrbitController.propTypes = {
  // target position
  lookAt: _react.PropTypes.arrayOf(_react.PropTypes.number),
  // camera distance
  distance: _react.PropTypes.number.isRequired,
  minDistance: _react.PropTypes.number,
  maxDistance: _react.PropTypes.number,
  // rotation
  rotationX: _react.PropTypes.number,
  // field of view
  fov: _react.PropTypes.number,
  // viewport width in pixels
  width: _react.PropTypes.number.isRequired,
  // viewport height in pixels
  height: _react.PropTypes.number.isRequired,
  // callback
  onViewportChange: _react.PropTypes.func.isRequired
};

OrbitController.defaultProps = {
  lookAt: [0, 0, 0],
  rotationX: 0,
  rotationY: 0,
  minDistance: 0,
  maxDistance: Infinity,
  fov: 50
};