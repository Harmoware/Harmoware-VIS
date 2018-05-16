'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var viewport = _ref.viewport,
      hovered = _ref.hovered,
      clicked = _ref.clicked;

  // set flags used below to determine if SVG highlight elements should be rendered.
  // if truthy, each flag is replaced with the corresponding element to render.
  /*  const elements = {
      hovered: hovered && hovered.object,
      clicked: clicked && clicked.object
    };  */
  var elementInfo = {
    hovered: hovered && hovered.object,
    clicked: clicked && clicked.object
  };

  /*  Object.keys(elements).forEach((k) => {
      const el = elements[k];
    }); */

  // render additional info about the focused elements (only nodes, not links)
  (0, _keys2.default)(elementInfo).forEach(function (k) {
    var el = elementInfo[k];
    if (el && el.code && k === 'hovered') {
      elementInfo[k] = _react2.default.createElement(
        'text',
        {
          x: hovered.x + 10,
          y: hovered.y + 0
        },
        el.code,
        ':',
        el.name,
        ' ',
        el.memo
      );
    } else {
      elementInfo[k] = null;
    }
  });

  // Note: node.x/y, calculated by d3 layout,
  // is measured from the center of the layout (of the viewport).
  // Therefore, we offset the <g> container to align.
  return _react2.default.createElement(
    'svg',
    { width: viewport.width, height: viewport.height, className: 'interaction-overlay' },
    _react2.default.createElement(
      'g',
      { fill: 'white', fontSize: '12' },
      elementInfo.hovered,
      elementInfo.clicked
    )
  );
};