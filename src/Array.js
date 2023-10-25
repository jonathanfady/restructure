import { getNumberSize } from './Number.js';

export function Array(type, length) {
  return {
    type,
    length,
    size: getNumberSize(type) * length,
  }
}
