import { getNumberSize } from './Number.js';

/**
 * Create a Bitfield configuration with a type and an array of names for each bit variable.
 * @param {string | {type: string; length: number; size: number;}} type - number string (uint8, int16be, uint32le, ...) defined in Number.js
 * or configuration from the Array() function defined in Array.js
 * @param {(string | null)[]} flags - array of names for each bit variable (use null to ignore a bit)
 */
export function Bitfield(type, flags = []) {
  return {
    type,
    flags,
    size: (typeof type == 'string') ? getNumberSize(type) : type.size, // ? Number : Array
  }
}
