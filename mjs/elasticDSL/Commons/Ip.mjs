/* eslint-disable no-unused-vars */
import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, desc } from '../../utils';
export function getIpRangeTypeITC(opts) {
  const name = getTypeName('IpRangeType', opts);
  const description = desc(`Ip range where \`from\` value includes and \`to\` value excludes.`);
  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      from: 'String',
      to: 'String',
      mask: {
        type: 'String',
        description: 'IP ranges can also be defined as CIDR masks 10.0.0.127/25'
      }
    }
  }));
}