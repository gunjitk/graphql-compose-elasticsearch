function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, desc } from '../../../utils';
import { getGeoPointAsFieldConfigMap } from '../../Commons/FieldNames';
import { getGeoPointFC, getDistanceCalculationModeFC } from '../../Commons/Geo';
export function getGeoDistanceITC(opts) {
  const name = getTypeName('QueryGeoDistance', opts);
  const description = desc(`
    Filters documents that include only hits that exists within
    a specific distance from a geo point.
    Requires the geo_point Mapping.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-distance-query.html)
  `);
  const subName = getTypeName('QueryGeoDistanceSettings', opts);
  const fields = getGeoPointAsFieldConfigMap(opts, opts.getOrCreateITC(subName, () => ({
    name: subName,
    fields: {
      top_left: getGeoPointFC(opts),
      bottom_right: getGeoPointFC(opts)
    }
  })));

  if (typeof fields === 'object') {
    return opts.getOrCreateITC(name, () => ({
      name,
      description,
      fields: _objectSpread({
        distance: {
          type: 'String!',
          description: 'Eg. 12km'
        },
        distance_type: getDistanceCalculationModeFC(opts)
      }, fields, {
        validation_method: 'String'
      })
    }));
  }

  return {
    type: 'JSON',
    description
  };
}