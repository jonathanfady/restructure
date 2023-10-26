import { getNumberSize } from './Number.js';

/**
 * @param {string} type
 * @param {number} length
 */
export function Array(type, length) {
  return {
    type,
    length,
    size: getNumberSize(type) * length,
  }
}
