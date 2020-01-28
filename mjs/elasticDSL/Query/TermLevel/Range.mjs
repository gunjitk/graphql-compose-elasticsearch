import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, desc } from '../../../utils';
import { getAllAsFieldConfigMap } from '../../Commons/FieldNames';
export function getRangeITC(opts) {
  const name = getTypeName('QueryRange', opts);
  const description = desc(`
    Matches documents with fields that have terms within a certain range.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-range-query.html)
  `);
  const subName = getTypeName('QueryRangeSettings', opts);
  const fields = getAllAsFieldConfigMap(opts, opts.getOrCreateITC(subName, () => ({
    name: subName,
    fields: {
      gt: 'JSON',
      gte: 'JSON',
      lt: 'JSON',
      lte: 'JSON',
      boost: 'Float',
      relation: 'String'
    }
  })));

  if (typeof fields === 'object') {
    return opts.getOrCreateITC(name, () => ({
      name,
      description,
      fields
    }));
  }

  return {
    type: 'JSON',
    description
  };
}