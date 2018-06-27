'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.default = get;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright (c) 2015 - 2017 Uber Technologies, Inc.

/**
 * Checks if argument is an indexable object (not a primitive value, nor null)
 * @param {*} value - JavaScript value to be tested
 * @return {Boolean} - true if argument is a JavaScript object
 */
function isObject(value) {
  return value !== null && (typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) === 'object';
}

// Default getter is container indexing
var squareBracketGetter = function squareBracketGetter(container, key) {
  return container[key];
};
var getMethodGetter = function getMethodGetter(obj, key) {
  return obj.get(key);
};
// Cache key to key arrays for speed
var keyMap = {};

// Looks for a `get` function on the prototype
// TODO - follow prototype chain?
// @private
// @return {Function} - get function: (container, key) => value
function getGetter(container) {
  // Check if container has a special get method
  var prototype = (0, _getPrototypeOf2.default)(container);
  return prototype.get ? getMethodGetter : squareBracketGetter;
}

// Takes a string of '.' separated keys and returns an array of keys
// E.g. 'feature.geometry.type' => 'feature', 'geometry', 'type'
// @private
function getKeys(compositeKey) {
  if (typeof compositeKey === 'string') {
    // else assume string and split around dots
    var keyList = keyMap[compositeKey];
    if (!keyList) {
      keyList = compositeKey.split('.');
      keyMap[compositeKey] = keyList;
    }
    return keyList;
  }
  // Wrap in array if needed
  return Array.isArray(compositeKey) ? compositeKey : [compositeKey];
}

/**
 * Access properties of nested containers using dot-path notation
 * - Supports plain objects and arrays, as well as classes with `get` methods
 *   such as ES6 Maps, Immutable.js objects etc
 * - Returns undefined if any container is not valid, instead of throwing
 *
 * @param {Object} container - container that supports get
 * @param {String|*} compositeKey - key to access, can be '.'-separated string
 * @return {*} - value in the final key of the nested container
 */
function get(container, compositeKey) {
  // Split the key into subkeys
  var keyList = getKeys(compositeKey);
  // Recursively get the value of each key;
  var value = container;
  for (var i = 0; i < keyList.length; i += 1) {
    var key = keyList[i];
    // If any intermediate subfield is not a container, return undefined
    if (!isObject(value)) {
      return undefined;
    }
    // Get the `getter` for this container
    var getter = getGetter(value);
    // Use the getter to get the value for the key
    value = getter(value, key);
  }
  return value;
}