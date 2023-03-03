import { Base } from './Base.js';

export class Struct extends Base {
  constructor(fields = {}) {
    super();
    this.fields = fields;
  }

  decode(stream) {
    const res = {};

    for (let key in this.fields) {
      res[key] = this.fields[key].decode(stream);
    }

    return res;
  }

  size() {
    let size = 0;

    for (let key in this.fields) {
      size += this.fields[key].size();
    }

    return size;
  }

  encode(stream, val) {
    for (let key in this.fields) {
      this.fields[key].encode(stream, val[key]);
    }
  }
}
