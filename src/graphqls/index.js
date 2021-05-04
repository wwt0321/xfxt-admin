import simpleMutation from './simpleMutation.js';
import queries from './queries.js';
import mutations from './mutations.js';

export default {
  ...simpleMutation,
  ...queries,
  ...mutations,
};
