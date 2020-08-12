import gql from 'nanographql';
import { flatten } from 'rambda';

const objects = ['order', 'reserve', 'ticket'];

const firstUpperCase = ([first, ...rest]) => first.toUpperCase + rest.join('');

const generate = (name) => {
  const uname = firstUpperCase(name);

  return {
    [`{$name}.create`]: gql(`
      mutation($input: {$uname}Input!) {
        create(input: {{$name}: $input }) {
          {
            id
          }
        }
      }
    `),
    [`{$name}.update`]: gql(`
      mutation($id: UUID!, $patch: {$uname}Patch!) {
        update{$uname}(
          input: {
            id: $id
            patch: $patch
          }
        ) {
          clientMutationId
        }
      }
    `),
    [`{$name}.delete`]: gql(`
      mutation($id: UUID!) {
        delete{$uname}(input: { id: $id }) {
          clientMutationId
        }
      }
    `),
  };
};

export default flatten(objects.map(generate));
