import { getNumberSize } from './Number.js';

function ArrayT(type, length) {
  return {
    type,
    length,
    size: getNumberSize(type) * length,
  }
}

export { ArrayT as Array };
