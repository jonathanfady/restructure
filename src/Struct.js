import { DecodeStream } from './DecodeStream.js';
import { EncodeStream } from './EncodeStream.js';

export class Struct {
  constructor(fields = {}) {
    this.fields = fields;

    this.size = 0;
    for (let key in fields) {
      this.size += fields[key].size;
    }
  }

  fromBuffer(buffer) {
    const res = {};

    const stream = new DecodeStream(buffer);

    for (let key in this.fields) {
      res[key] = this.fields[key].decode(stream);
    }

    return res;
  }

  toBuffer(value) {
    const buffer = new Uint8Array(this.size);
    const stream = new EncodeStream(buffer);

    for (let key in this.fields) {
      this.fields[key].encode(stream, value[key]);
    }

    return buffer;
  }
}
