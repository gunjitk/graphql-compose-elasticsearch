function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint-disable no-param-reassign */
import { ObjectTypeComposer, graphql } from 'graphql-compose';
import elasticsearch from 'elasticsearch';
import ElasticApiParser from './ElasticApiParser';
const DEFAULT_ELASTIC_API_VERSION = '_default';
const {
  GraphQLString
} = graphql;
export function elasticApiFieldConfig(esClientOrOpts) {
  if (!esClientOrOpts || typeof esClientOrOpts !== 'object') {
    throw new Error('You should provide ElasticClient instance or ElasticClientConfig in first argument.');
  }

  if (isElasticClient(esClientOrOpts)) {
    return instanceElasticClient(esClientOrOpts);
  } else {
    return contextElasticClient(esClientOrOpts);
  }
}

function instanceElasticClient(elasticClient) {
  const apiVersion = elasticClient.transport._config.apiVersion || DEFAULT_ELASTIC_API_VERSION;
  const prefix = `ElasticAPI${apiVersion.replace('.', '')}`;
  const apiParser = new ElasticApiParser({
    elasticClient,
    prefix
  });
  return {
    description: `Elastic API v${apiVersion}`,
    type: ObjectTypeComposer.createTemp({
      name: prefix,
      fields: apiParser.generateFieldMap()
    }).getType(),
    resolve: () => ({})
  };
}

function contextElasticClient(elasticConfig) {
  if (!elasticConfig.apiVersion) {
    elasticConfig.apiVersion = DEFAULT_ELASTIC_API_VERSION;
  }

  const {
    apiVersion
  } = elasticConfig;
  const prefix = `ElasticAPI${apiVersion.replace('.', '')}`;
  const apiParser = new ElasticApiParser({
    apiVersion,
    prefix
  });
  return {
    description: `Elastic API v${apiVersion}`,
    type: ObjectTypeComposer.createTemp({
      name: prefix,
      fields: apiParser.generateFieldMap()
    }).getType(),
    args: {
      host: {
        type: GraphQLString,
        defaultValue: elasticConfig.host || 'http://user:pass@localhost:9200'
      }
    },
    resolve: (src, args, context) => {
      if (typeof context === 'object') {
        const opts = args.host ? _objectSpread({}, elasticConfig, {
          host: args.host
        }) : elasticConfig;
        context.elasticClient = new elasticsearch.Client(opts);
      }

      return {};
    }
  };
}

function isElasticClient(obj) {
  if (obj instanceof elasticsearch.Client) {
    return true;
  }

  if (obj && obj.transport && obj.transport._config && obj.transport._config.__reused) {
    return true;
  }

  return false;
}