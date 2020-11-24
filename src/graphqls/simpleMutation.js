import gql from 'nanographql';
import { mergeAll } from 'rambda';
import { simpleMutationTables } from '../../config';

const tables = simpleMutationTables;

const firstUpperCase = ([first, ...rest]) => first.toUpperCase() + rest.join('');

const generate = (table) => {
  const name = table.name;
  const uname = firstUpperCase(name);
  const id = table.id;

  return {
    [`${name}.create`]: gql(`
      mutation($input: ${uname}Input!) {
        create${uname}(input: {${name}: $input }) {
          ${name} {
            ${id}
          }
        }
      }
    `),
    [`${name}.update`]: gql(`
      mutation($id: UUID!, $patch: ${uname}Patch!) {
        update{$uname}(
          input: {
            ${id}: $id
            patch: $patch
          }
        ) {
          clientMutationId
        }
      }
    `),
    [`${name}.delete`]: gql(`
      mutation($id: UUID!) {
        delete${uname}(input: { ${id}: $id }) {
          clientMutationId
        }
      }
    `),
  };
};

export default mergeAll(tables.map(generate));
