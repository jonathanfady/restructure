import { getNumberSize } from './Number.js';

export class Struct {

  constructor(fields) {
    this.fields = fields;
    this.results = {};

    this.arrays = [];
    this.arrays_index = 0;

    this.size = Object.values(fields).reduce((prev, curr) => {
      if (typeof curr == 'string') { // Number
        return prev += getNumberSize(curr);
      } else if ("length" in curr) { // Array
        this.arrays.push(new Array(curr.length));
        return prev += curr.size;
      } else if ("flags" in curr) { // Bitfield
        return prev += curr.size;
      } else { // String
        this.arrays.push(new Array(curr.size));
        return prev += curr.size;
      }
    }, 0)

    this.buffer = new Uint8Array(this.size);
    this.view_1 = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
    this.view_2 = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
    this.pos_1 = 0;
    this.pos_2 = 0;
  }

  fromBuffer(buffer) {
    this.view_1 = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    this.pos_1 = 0;
    this.arrays_index = 0;

    for (const k of Object.keys(this.fields)) {
      // console.time(k);
      const v = this.fields[k];
      if (typeof v == 'string') { // Number
        // console.time('Number')
        this.results[k] = this['read' + v]();
        // console.timeEnd('Number')
      } else if ("length" in v) { // Array
        // console.time('Array')
        this.results[k] = this.readArray(v.type);
        // console.timeEnd('Array')
      } else if ("flags" in v) { // Bitfield
        // console.time('Bitfield')
        this.readBitfield(v.type, v.flags);
        // console.timeEnd('Bitfield')
      } else { // String
        // console.time('String')
        this.results[k] = this.readString();
        // console.timeEnd('String')
      }
      // console.timeEnd(k);
    }

    return this.results;
  }

  toBuffer(values) {
    this.pos_2 = 0;

    for (const k of Object.keys(this.fields)) {
      // console.time(k);
      const v = this.fields[k];
      if (typeof v == 'string') { // Number
        // console.time('Number')
        this['write' + v](values[k]);
        // console.timeEnd('Number')
      } else if ("length" in v) { // Array
        // console.time('Array')
        this.writeArray(v.type, values[k]);
        // console.timeEnd('Array')
      } else if ("flags" in v) { // Bitfield
        // console.time('Bitfield')
        this.writeBitfield(v.type, v.flags, values);
        // console.timeEnd('Bitfield')
      } else { // String
        // console.time('String')
        this.writeString(values[k]);
        // console.timeEnd('String')
      }
      // console.timeEnd(k);
    }

    return this.buffer;
  }

  // DecodeStream
  readArray(type) {
    const arr = this.arrays[this.arrays_index++];
    for (let i = 0; i < arr.length; ++i) {
      arr[i] = this['read' + type]();
    }
    return arr;
  }

  readBitfield(type, flags) {
    if (typeof type == 'string') { // Number
      const value = this['read' + type]();

      for (let i = 0; i < flags.length; ++i) {
        const flag = flags[i];
        if (flag != null) {
          this.results[flag] = !!(value & (1 << i));
        }
      }
    } else { // Array
      let flag_i = 0;
      for (let i = 0; i < type.size; ++i) {
        const value = this.readUint8();
        for (let j = 0; j < 8; ++j) {
          const flag = flags[flag_i];
          if (flag != null) {
            this.results[flag] = !!(value & (1 << j));
          }
          flag_i++;
        }
      }
    }
  }

  readString() {
    const chars = this.arrays[this.arrays_index++];
    for (let i = 0; i < chars.length; ++i) {
      chars[i] = String.fromCharCode(this.view_1.getUint8(this.pos_1++));
    }
    return chars.join('');
  }

  readUint8() {
    return this.view_1.getUint8(this.pos_1++);
  }
  readInt8() {
    return this.view_1.getInt8(this.pos_1++);
  }

  readUint16BE() {
    return this.view_1.getUint16((this.pos_1 += 2) - 2);
  }
  readUint16LE() {
    return this.view_1.getUint16((this.pos_1 += 2) - 2, true);
  }
  readInt16BE() {
    return this.view_1.getInt16((this.pos_1 += 2) - 2);
  }
  readInt16LE() {
    return this.view_1.getInt16((this.pos_1 += 2) - 2, true);
  }

  readUint24BE() {
    return (this.readUint16BE() << 8) + this.readUint8();
  }

  readUint24LE() {
    return this.readUint16LE() + (this.readUint8() << 16);
  }

  readInt24BE() {
    return (this.readInt16BE() << 8) + this.readUint8();
  }

  readInt24LE() {
    return this.readUint16LE() + (this.readInt8() << 16);
  }

  readUint32BE() {
    return this.view_1.getUint32((this.pos_1 += 4) - 4);
  }
  readUint32LE() {
    return this.view_1.getUint32((this.pos_1 += 4) - 4, true);
  }
  readInt32BE() {
    return this.view_1.getInt32((this.pos_1 += 4) - 4);
  }
  readInt32LE() {
    return this.view_1.getInt32((this.pos_1 += 4) - 4, true);
  }

  readFloatBE() {
    return this.view_1.getFloat32((this.pos_1 += 4) - 4);
  }
  readFloatLE() {
    return this.view_1.getFloat32((this.pos_1 += 4) - 4, true);
  }

  readDoubleBE() {
    return this.view_1.getFloat64((this.pos_1 += 8) - 8);
  }
  readDoubleLE() {
    return this.view_1.getFloat64((this.pos_1 += 8) - 8, true);
  }

  // EncodeStream
  writeArray(type, array) {
    for (let i = 0; i < array.length; ++i) {
      const value = array[i];
      this['write' + type](value);
    }
  }

  writeBitfield(type, flags, keys) {
    if (typeof type == 'string') { // Number
      let value = 0;
      for (let i = 0; i < flags.length; ++i) {
        const flag = flags[i];
        if ((flag != null) && (keys[flag])) {
          value |= (1 << i);
        }
      }

      this['write' + type](value);
    } else { // Array
      let flag_i = 0;
      for (let i = 0; i < type.size; ++i) {
        let value = 0;
        for (let j = 0; j < 8; ++j) {
          const flag = flags[flag_i];
          if ((flag != null) && (keys[flag])) {
            value |= (1 << j);
          }
          flag_i++;
        }
        this.buffer[this.pos_2++] = value;
      }
    }
  }

  writeString(string) {
    for (let i = 0; i < string.length; ++i) {
      this.buffer[this.pos_2++] = string.charCodeAt(i);
    }
  }

  writeUint8(value) {
    this.buffer[this.pos_2++] = value;
  }
  writeInt8(value) {
    this.view_2.setInt8(this.pos_2++, value);
  }

  writeUint16BE(value) {
    this.view_2.setUint16(this.pos_2, value);
    this.pos_2 += 2;
  }
  writeUint16LE(value) {
    this.view_2.setUint16(this.pos_2, value, true);
    this.pos_2 += 2;
  }
  writeInt16BE(value) {
    this.view_2.setInt16(this.pos_2, value);
    this.pos_2 += 2;
  }
  writeInt16LE(value) {
    this.view_2.setInt16(this.pos_2, value, true);
    this.pos_2 += 2;
  }

  writeUint24BE(value) {
    this.buffer[this.pos_2++] = (value >>> 16) & 0xff;
    this.buffer[this.pos_2++] = (value >>> 8) & 0xff;
    this.buffer[this.pos_2++] = value & 0xff;
  }

  writeUint24LE(value) {
    this.buffer[this.pos_2++] = value & 0xff;
    this.buffer[this.pos_2++] = (value >>> 8) & 0xff;
    this.buffer[this.pos_2++] = (value >>> 16) & 0xff;
  }

  writeInt24BE(value) {
    if (value >= 0) {
      this.writeUint24BE(value);
    } else {
      this.writeUint24BE(value + 0xffffff + 1);
    }
  }

  writeInt24LE(value) {
    if (value >= 0) {
      this.writeUint24LE(value);
    } else {
      this.writeUint24LE(value + 0xffffff + 1);
    }
  }

  writeUint32BE(value) {
    this.view_2.setUint32(this.pos_2, value);
    this.pos_2 += 4;
  }
  writeUint32LE(value) {
    this.view_2.setUint32(this.pos_2, value, true);
    this.pos_2 += 4;
  }
  writeInt32BE(value) {
    this.view_2.setInt32(this.pos_2, value);
    this.pos_2 += 4;
  }
  writeInt32LE(value) {
    this.view_2.setInt32(this.pos_2, value, true);
    this.pos_2 += 4;
  }

  writeFloatBE(value) {
    this.view_2.setFloat32(this.pos_2, value);
    this.pos_2 += 4;
  }
  writeFloatLE(value) {
    this.view_2.setFloat32(this.pos_2, value, true);
    this.pos_2 += 4;
  }

  writeDoubleBE(value) {
    this.view_2.setFloat64(this.pos_2, value);
    this.pos_2 += 8;
  }
  writeDoubleLE(value) {
    this.view_2.setFloat64(this.pos_2, value, true);
    this.pos_2 += 8;
  }
}
