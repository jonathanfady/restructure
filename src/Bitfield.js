import { Base } from './Base.js';
import { Array as ArrayT } from './Array.js';
import { Number as NumberT } from './Number.js';

export class Bitfield extends Base {
  constructor(type, flags = []) {
    super();
    this.type = type;
    this.flags = flags;
  }

  decode(stream) {
    const val = this.type.decode(stream);

    if ((this.type instanceof ArrayT) && (this.type.type instanceof NumberT)) {
      const res = {};
      const bitlength = this.type.type.size() * 8;
      for (let i = 0; i < this.flags.length; i++) {
        const j = i % bitlength;
        const flag = this.flags[i];
        if (flag != null) {
          res[flag] = !!(val[0] & (1 << j));
        }
        if (j == (bitlength - 1)) {
          val.shift()
        }
      }

      return res;
    }

    const res = {};
    for (let i = 0; i < this.flags.length; i++) {
      const flag = this.flags[i];
      if (flag != null) {
        res[flag] = !!(val & (1 << i));
      }
    }

    return res;
  }

  size() {
    return this.type.size();
  }

  encode(stream, keys) {
    if ((this.type instanceof ArrayT) && (this.type.type instanceof NumberT)) {
      const vals = [];
      const bitlength = this.type.type.size() * 8;
      let val = 0;
      for (let i = 0; i < this.flags.length; i++) {
        const j = i % bitlength;
        const flag = this.flags[i];
        if (flag != null) {
          if (keys[flag]) { val |= (1 << j); }
        }
        if (j == (bitlength - 1)) {
          vals.push(val);
          val = 0;
        }
      }
      if ((this.flags.length % bitlength) != 0) {
        vals.push(val);
      }

      return this.type.encode(stream, vals);
    }

    let val = 0;
    for (let i = 0; i < this.flags.length; i++) {
      const flag = this.flags[i];
      if (flag != null) {
        if (keys[flag]) { val |= (1 << i); }
      }
    }

    return this.type.encode(stream, val);
  }
}
