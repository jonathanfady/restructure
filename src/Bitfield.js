import { getNumberSize } from './Number.js';

export function Bitfield(type, flags = []) {
  return {
    type,
    flags,
    size: (typeof type == 'string') ? getNumberSize(type) : type.size, // ? Number : Array
  }
}
