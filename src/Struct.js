import { DecodeStream } from './DecodeStream.js';
import { EncodeStream } from './EncodeStream.js';

export class Struct {
  constructor(fields = {}) {
    this.fields = fields;
  }

  fromBuffer(buffer) {
    const stream = new DecodeStream(buffer);
    return this.decode(stream);
  }

  toBuffer(value) {
    const buffer = new Uint8Array(this.size());
    const stream = new EncodeStream(buffer);
    this.encode(stream, value);
    return buffer;
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
