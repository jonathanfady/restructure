import { Array as ArrayT } from './Array.js';
import { Struct } from './Struct.js';

export class Bitfield {
  constructor(type, flags = []) {
    this.type = type;
    this.flags = flags;
    if (this.type instanceof ArrayT)
      this.size = type.size;
    else
      this.size = Struct[`size${type}`];
  }
}
