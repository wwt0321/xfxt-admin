import gql from 'nanographql';
import { mergeAll } from 'rambda';
import { simpleMutationTables } from '../../config';
import { pascalCase } from 'change-case';

const tables = simpleMutationTables;

const generate = (table) => {
  const name = table.name;
  const uname = pascalCase(name);
  const id = table.id;
  const idType = table.idType || 'UUID';

  const gqlCreate = gql(`
    mutation($input: ${uname}Input!) {
      create${uname}(input: {${name}: $input }) {
        ${name} {
          ${id}
        }
      }
    }
  `);

  const gqlUpdate = gql(`
    mutation($id: ${idType}!, $patch: ${uname}Patch!) {
      update${uname}(
        input: {
          ${id}: $id
          patch: $patch
        }
      ) {
        clientMutationId
      }
    }
  `);

  const gqlUpsert = gql(`
    mutation($input: ${uname}Input!, $where: Upsert${uname}Where!) {
      upsert${uname}(
        where: $where
        input: {
          ${name}: $input
        }
      ) {
        clientMutationId
      }
    }
  `);

  const gqlDelete = gql(`
    mutation($id: ${idType}!) {
      delete${uname}(input: { ${id}: $id }) {
        clientMutationId
      }
    }
  `);

  const gqlMnCreate = gql(`
    mutation($input: [${uname}Input!]) {
      mnCreate${uname} (
        input: {
          mn${uname}: $input
        }
      ) {
        clientMutationId
      }
    }
  `);

  const gqlMnUpdate = gql(`
    mutation($patch: [${uname}Patch!]) {
      mnUpdate${uname} (
        input: {
          mnPatch: $patch
        }
      ) {
        clientMutationId
      }
    }
  `);

  const gqlMnDelete = gql(`
    mutation($patch: [${uname}Patch!]) {
      mnDelete${uname} (
        input: {
          mnPatch: $patch
        }
      ) {
        clientMutationId
      }
    }
  `);

  return {
    [`${name}.create`]: gqlCreate,
    [`create${uname}`]: gqlCreate,
    [`${name}.update`]: gqlUpdate,
    [`update${uname}`]: gqlUpdate,
    [`${name}.delete`]: gqlDelete,
    [`delete${uname}`]: gqlDelete,
    [`mnCreate${uname}`]: gqlMnCreate,
    [`mnUpdate${uname}`]: gqlMnUpdate,
    [`mnDelete${uname}`]: gqlMnDelete,
    [`upsert${uname}`]: gqlUpsert,
  };
};

export default mergeAll(tables.map(generate));
