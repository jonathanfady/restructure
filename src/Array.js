import { getNumberSize } from './Number.js';

/**
 * Create an array configuration with a type and length.
 * @param {string} type - number string (uint8, int16be, uint32le, ...) defined in Number.js
 * @param {number} length - total length of the array
 */
export function Array(type, length) {
  return {
    type,
    length,
    size: getNumberSize(type) * length,
  }
}
