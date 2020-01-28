function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { isFunction } from 'graphql-compose';
export function prepareCommonOpts(schemaComposer, opts = {}) {
  return _objectSpread({
    schemaComposer,
    getOrCreateOTC: (typeName, cfgOrThunk) => {
      return schemaComposer.getOrSet(typeName, () => {
        const tc = schemaComposer.createObjectTC(isFunction(cfgOrThunk) ? cfgOrThunk() : cfgOrThunk);
        return tc;
      });
    },
    getOrCreateITC: (typeName, cfgOrThunk) => {
      return schemaComposer.getOrSet(typeName, () => {
        const tc = schemaComposer.createInputTC(isFunction(cfgOrThunk) ? cfgOrThunk() : cfgOrThunk);
        return tc;
      });
    },
    getOrCreateETC: (typeName, cfgOrThunk) => {
      return schemaComposer.getOrSet(typeName, () => {
        const tc = schemaComposer.createEnumTC(isFunction(cfgOrThunk) ? cfgOrThunk() : cfgOrThunk);
        return tc;
      });
    }
  }, opts);
}
export function getTypeName(name, opts) {
  return `${opts && opts.prefix || 'Elastic'}${name}${opts && opts.postfix || ''}`;
} // Remove newline multiline in descriptions

export function desc(str) {
  return str.replace(/\n\s+/gi, ' ').replace(/^\s+/, '');
}
export function reorderKeys(obj, names) {
  const orderedFields = {};

  const fields = _objectSpread({}, obj);

  names.forEach(name => {
    if (fields[name]) {
      orderedFields[name] = fields[name];
      delete fields[name];
    }
  });
  return _objectSpread({}, orderedFields, {}, fields);
}
export async function fetchElasticMapping(opts) {
  if (!opts.elasticIndex || typeof opts.elasticIndex !== 'string') {
    throw new Error('Must provide `elasticIndex` string parameter from your Elastic server.');
  }

  if (!opts.elasticType || typeof opts.elasticType !== 'string') {
    throw new Error('Must provide `elasticType` string parameter from your Elastic server.');
  }

  if (!opts.elasticClient) {
    throw new Error('Must provide `elasticClient` Object parameter connected to your Elastic server.');
  }

  const elasticMapping = (await opts.elasticClient.indices.getMapping({
    index: opts.elasticIndex,
    type: opts.elasticType
  }))[opts.elasticIndex].mappings[opts.elasticType];
  return elasticMapping;
}