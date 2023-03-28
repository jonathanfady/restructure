import { Struct } from './Struct.js';

export class Bitfield {
  constructor(type, flags = []) {
    this.type = type;
    this.flags = flags;
    if (typeof type == 'string') // Number
      this.size = Struct[`size${type}`];
    else // Array
      this.size = type.size;
  }
}
