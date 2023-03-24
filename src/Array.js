import { Struct } from './Struct.js';

class ArrayT {
  constructor(type, length) {
    this.type = type;
    this.length = length;
    this.size = Struct[`size${type}`] * length;
  }
}

export { ArrayT as Array };
