import { Array as ArrayT } from './Array.js';

export class Struct {
  static sizeUInt8 = 1;
  static sizeInt8 = 1;
  static sizeUInt16BE = 2;
  static sizeUInt16LE = 2;
  static sizeInt16BE = 2;
  static sizeInt16LE = 2;
  static sizeUInt24BE = 3;
  static sizeUInt24LE = 3;
  static sizeInt24BE = 3;
  static sizeInt24LE = 3;
  static sizeUInt32BE = 4;
  static sizeUInt32LE = 4;
  static sizeInt32BE = 4;
  static sizeInt32LE = 4;
  static sizeFloatBE = 4;
  static sizeFloatLE = 4;
  static sizeDoubleBE = 8;
  static sizeDoubleLE = 8;

  constructor(fields = {}) {
    this.fields = fields;
    this.res = {};

    this.size = Object.values(fields).reduce((prev, curr) => {
      if (typeof curr == 'string') { //Number
        return prev += Struct[`size${curr}`];
      } else if ("length" in curr) { //Array
        return prev += curr.size;
      } else if ("flags" in curr) { //Bitfield
        return prev += curr.size;
      } else { //String
        return prev += curr.size;
      }
    }, 0)

    this.buffer = new Uint8Array(this.size);
    this.byteOffset = this.buffer.byteOffset;
    this.view_1 = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
    this.view_2 = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
    this.pos_1 = 0;
    this.pos_2 = 0;
  }

  fromBuffer(buffer) {
    this.byteOffset = buffer.byteOffset;
    this.view_1 = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    this.pos_1 = 0;

    for (const [k, v] of Object.entries(this.fields)) {
      if (typeof v == 'string') { //Number
        // console.time('Number')
        this.res[k] = this[`read${v}`]();
        // console.timeEnd('Number')
      } else if ("length" in v) { //Array
        // console.time('Array')
        this.readArray(v.type, v.length, k);
        // console.timeEnd('Array')
      } else if ("flags" in v) { //Bitfield
        // console.time('Bitfield')
        this.readBitfield(v.type, v.flags);
        // console.timeEnd('Bitfield')
      } else { //String
        // console.time('String')
        this.readString(v.size, k);
        // console.timeEnd('String')
      }
    }

    return this.res;
  }

  toBuffer(values) {
    this.pos_2 = 0;

    for (const [k, v] of Object.entries(this.fields)) {
      const value = values[k];
      if (typeof v == 'string') { //Number
        // console.time('Number')
        this[`write${v}`](value);
        // console.timeEnd('Number')
      } else if ("length" in v) { //Array
        // console.time('Array')
        this.writeArray(v.type, value);
        // console.timeEnd('Array')
      } else if ("flags" in v) { //Bitfield
        // console.time('Bitfield')
        this.writeBitfield(v.type, v.flags, values);
        // console.timeEnd('Bitfield')
      } else { //String
        // console.time('String')
        this.writeString(value);
        // console.timeEnd('String')
      }
    }

    return this.buffer;
  }

  // DecodeStream
  readArray(type, length, key) {
    const arr = new Array(length);
    for (let i = 0; i < length; i++) {
      arr[i] = this[`read${type}`]();
    }
    this.res[key] = arr;
  }

  readBitfield(type, flags) {
    if (type instanceof ArrayT) {
      const values = new Uint8Array(type.size);
      for (let i = 0; i < type.size; i++) {
        values[i] = this.readUInt8();
      }

      let flag_i = 0;

      for (let i = 0; i < values.length; i++) {
        const value = values[i];
        for (let j = 0; j < 8; j++) {
          const flag = flags[flag_i];
          if (flag != null) {
            this.res[flag] = !!(value & (1 << j));
          }
          flag_i++;
        }
      }
    } else {
      const value = this[`read${type}`]();

      for (let i = 0; i < flags.length; i++) {
        const flag = flags[i];
        if (flag != null) {
          this.res[flag] = !!(value & (1 << i));
        }
      }
    }
  }

  readString(length, key) {
    let str = '';
    for (let i = 0; i < length; ++i) {
      str += String.fromCharCode(this.view_1.getUint8(this.pos_1++));
    }
    this.res[key] = str;
  }

  readUInt8() {
    const ret = this.view_1.getUint8(this.pos_1);
    this.pos_1 += 1;
    return ret;
  }
  readInt8() {
    const ret = this.view_1.getInt8(this.pos_1);
    this.pos_1 += 1;
    return ret;
  }

  readUInt16BE() {
    const ret = this.view_1.getUint16(this.pos_1);
    this.pos_1 += 2;
    return ret;
  }
  readUInt16LE() {
    const ret = this.view_1.getUint16(this.pos_1, true);
    this.pos_1 += 2;
    return ret;
  }
  readInt16BE() {
    const ret = this.view_1.getInt16(this.pos_1);
    this.pos_1 += 2;
    return ret;
  }
  readInt16LE() {
    const ret = this.view_1.getInt16(this.pos_1, true);
    this.pos_1 += 2;
    return ret;
  }

  readUInt24BE() {
    return (this.readUInt16BE() << 8) + this.readUInt8();
  }

  readUInt24LE() {
    return this.readUInt16LE() + (this.readUInt8() << 16);
  }

  readInt24BE() {
    return (this.readInt16BE() << 8) + this.readUInt8();
  }

  readInt24LE() {
    return this.readUInt16LE() + (this.readInt8() << 16);
  }

  readUInt32BE() {
    const ret = this.view_1.getUint32(this.pos_1);
    this.pos_1 += 4;
    return ret;
  }
  readUInt32LE() {
    const ret = this.view_1.getUint32(this.pos_1, true);
    this.pos_1 += 4;
    return ret;
  }
  readInt32BE() {
    const ret = this.view_1.getInt32(this.pos_1);
    this.pos_1 += 4;
    return ret;
  }
  readInt32LE() {
    const ret = this.view_1.getInt32(this.pos_1, true);
    this.pos_1 += 4;
    return ret;
  }

  readFloatBE() {
    const ret = this.view_1.getFloat32(this.pos_1);
    this.pos_1 += 4;
    return ret;
  }
  readFloatLE() {
    const ret = this.view_1.getFloat32(this.pos_1, true);
    this.pos_1 += 4;
    return ret;
  }

  readDoubleBE() {
    const ret = this.view_1.getFloat64(this.pos_1);
    this.pos_1 += 8;
    return ret;
  }
  readDoubleLE() {
    const ret = this.view_1.getFloat64(this.pos_1, true);
    this.pos_1 += 8;
    return ret;
  }

  // EncodeStream
  writeArray(type, array) {
    for (let i = 0; i < array.length; i++) {
      const value = array[i];
      this[`write${type}`](value);
    }
  }


  writeBitfield(type, flags, keys) {
    if (type instanceof ArrayT) {
      let flag_i = 0;

      for (let i = 0; i < type.size; i++) {
        let value = 0;
        for (let j = 0; j < 8; j++) {
          const flag = flags[flag_i];
          if ((flag != null) && (keys[flag])) {
            value |= (1 << j);
          }
          flag_i++;
        }
        this.writeUInt8(value);
      }
    } else {
      let value = 0;
      for (let i = 0; i < flags.length; i++) {
        const flag = flags[i];
        if ((flag != null) && (keys[flag])) {
          value |= (1 << i);
        }
      }

      this[`write${type}`](value);
    }
  }

  writeString(string) {
    for (let i = 0; i < string.length; ++i) {
      this.buffer[this.pos_2++] = string.charCodeAt(i);
    }
  }

  writeUInt8(value) {
    this.buffer[this.pos_2++] = value;
  }
  writeInt8(value) {
    this.view_2.setInt8(this.pos_2, value);
    this.pos_2 += 1;
  }

  writeUInt16BE(value) {
    this.view_2.setUint16(this.pos_2, value);
    this.pos_2 += 2;
  }
  writeUInt16LE(value) {
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

  writeUInt24BE(value) {
    this.buffer[this.pos_2++] = (value >>> 16) & 0xff;
    this.buffer[this.pos_2++] = (value >>> 8) & 0xff;
    this.buffer[this.pos_2++] = value & 0xff;
  }

  writeUInt24LE(value) {
    this.buffer[this.pos_2++] = value & 0xff;
    this.buffer[this.pos_2++] = (value >>> 8) & 0xff;
    this.buffer[this.pos_2++] = (value >>> 16) & 0xff;
  }

  writeInt24BE(value) {
    if (value >= 0) {
      this.writeUInt24BE(value);
    } else {
      this.writeUInt24BE(value + 0xffffff + 1);
    }
  }

  writeInt24LE(value) {
    if (value >= 0) {
      this.writeUInt24LE(value);
    } else {
      this.writeUInt24LE(value + 0xffffff + 1);
    }
  }

  writeUInt32BE(value) {
    this.view_2.setUint32(this.pos_2, value);
    this.pos_2 += 4;
  }
  writeUInt32LE(value) {
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
