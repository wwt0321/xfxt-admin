import { forEach } from 'rambda';

export function set(state, payload) {
  forEach((v, k) => {
    state[k] = v;
  })(payload);
}
