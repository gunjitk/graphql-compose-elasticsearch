function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Resolver, InputTypeComposer } from 'graphql-compose';
import ElasticApiParser from '../ElasticApiParser';
import { getUpdateByIdOutputTC } from '../types/UpdateByIdOutput';
import { getTypeName, desc } from '../utils';
export default function createUpdateByIdResolver(opts) {
  const {
    fieldMap,
    sourceTC,
    schemaComposer
  } = opts;

  if (!fieldMap || !fieldMap._all) {
    throw new Error('opts.fieldMap for Resolver updateById() should be fieldMap of FieldsMapByElasticType type.');
  }

  if (!sourceTC || sourceTC.constructor.name !== 'ObjectTypeComposer') {
    throw new Error('opts.sourceTC for Resolver updateById() should be instance of ObjectTypeComposer.');
  }

  const parser = new ElasticApiParser({
    elasticClient: opts.elasticClient,
    prefix: opts.prefix
  });
  const updateByIdFC = parser.generateFieldConfig('update', {
    index: opts.elasticIndex,
    type: opts.elasticType,
    _source: true
  });
  const argsConfigMap = {
    id: 'String!',
    record: getRecordITC(opts).getTypeNonNull()
  };
  const type = getUpdateByIdOutputTC(opts);
  return schemaComposer.createResolver({
    type,
    name: 'updateById',
    kind: 'mutation',
    args: argsConfigMap,
    resolve: async rp => {
      const {
        source,
        args,
        context,
        info
      } = rp;
      args.body = {
        doc: _objectSpread({}, args.record)
      };
      delete args.record;
      const res = await updateByIdFC.resolve(source, args, context, info);
      const {
        _index,
        _type,
        _id,
        _version,
        result,
        get
      } = res || {};
      const {
        _source
      } = get || {};
      return _objectSpread({
        _id,
        _index,
        _type,
        _version,
        result
      }, _source);
    }
  });
}
export function getRecordITC(opts) {
  const name = getTypeName('Record', {});
  const description = desc(`The record from Elastic Search`);
  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: _objectSpread({}, opts.fieldMap._all)
  }));
}