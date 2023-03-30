import { getNumberSize } from './Number.js';

class ArrayT {
  constructor(type, length) {
    this.type = type;
    this.length = length;
    this.size = getNumberSize(type) * length;
  }
}

export { ArrayT as Array };
