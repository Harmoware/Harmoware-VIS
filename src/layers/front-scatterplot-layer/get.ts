

// Copyright (c) 2015 - 2017 Uber Technologies, Inc.

/**
 * Checks if argument is an indexable object (not a primitive value, nor null)
 * @param {*} value - JavaScript value to be tested
 * @return {Boolean} - true if argument is a JavaScript object
 */
function isObject(value: Object): boolean {
  return value !== null && typeof value === 'object';
}

type keyType = (string|number);
// Default getter is container indexing
const squareBracketGetter: (Object, keyType) => any = (container, key) => container.key;
const getMethodGetter: (Object, keyType) => any = (obj, key) => obj.get(key);
// Cache key to key arrays for speed
const keyMap = {};

// Looks for a `get` function on the prototype
// TODO - follow prototype chain?
// @private
// @return {Function} - get function: (container, key) => value
function getGetter(container: Object): (Object, keyType) => any {
  // Check if container has a special get method
  const prototype = Object.getPrototypeOf(container);
  return prototype.get ? getMethodGetter : squareBracketGetter;
}

// Takes a string of '.' separated keys and returns an array of keys
// E.g. 'feature.geometry.type' => 'feature', 'geometry', 'type'
// @private
function getKeys(compositeKey: string|number|number[]): string[]|number[] {
  if (typeof compositeKey === 'string') {
    const stringkey = compositeKey as string;
    // else assume string and split around dots
    let keyList: (string[]|number[]) = keyMap[stringkey];
    if (!keyList) {
      keyList = stringkey.split('.');
      keyMap[compositeKey] = keyList;
    }
    return keyList;
  }else{
    // Wrap in array if needed
    return Array.isArray(compositeKey) ? compositeKey : [compositeKey as number];
  }
}

/**
 * Access properties of nested containers using dot-path notation
 * - Supports plain objects and arrays, as well as classes with `get` methods
 *   such as ES6 Maps, Immutable.js objects etc
 * - Returns undefined if any container is not valid, instead of throwing
 *
 * @param {Object} container - container that supports get
 * @param {string|*} compositeKey - key to access, can be '.'-separated string
 * @return {*} - value in the final key of the nested container
 */
export default
function get(container: Object, compositeKey: string|number|number[]): Object|typeof undefined {
  // Split the key into subkeys
  const keyList = getKeys(compositeKey);
  // Recursively get the value of each key;
  let value = container;
  for (let i = 0; i < keyList.length; i += 1) {
    const key: keyType = keyList[i];
    // If any intermediate subfield is not a container, return undefined
    if (!isObject(value)) {
      return undefined;
    }
    // Get the `getter` for this container
    const getter = getGetter(value);
    // Use the getter to get the value for the key
    value = getter(value, key);
  }
  return value;
}
