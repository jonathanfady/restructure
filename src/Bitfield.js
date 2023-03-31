import { getNumberSize } from './Number.js';

export class Bitfield {
  constructor(type, flags = []) {
    this.type = type;
    this.flags = flags;
    if (typeof type == 'string') // Number
      this.size = getNumberSize(type);
    else // Array
      this.size = type.size;
  }
}
