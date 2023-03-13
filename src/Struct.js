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
    global.decode_stream = new DecodeStream(buffer);

    const res = {};

    for (let key in this.fields) {
      res[key] = this.fields[key].decode();
    }

    return res;
  }

  toBuffer(value) {
    global.encode_stream = new EncodeStream(buffer);

    const buffer = new Uint8Array(this.size);

    for (let key in this.fields) {
      this.fields[key].encode(value[key]);
    }

    return buffer;
  }
}
