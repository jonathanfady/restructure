import { Array as ArrayT } from './Array.js';
import { Bitfield } from './Bitfield.js';
import { String as StringT } from './String.js';

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

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
      if (curr instanceof ArrayT) {
        return prev += curr.size;
      } else if (curr instanceof Bitfield) {
        return prev += curr.size;
      } else if (curr instanceof StringT) {
        return prev += curr.size;
      } else {
        return prev += Struct[`size${curr}`];
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

    Object.entries(this.fields).forEach(([k, v]) => {
      if (v instanceof ArrayT) {
        this.readArray(v.type, v.length, k);
      } else if (v instanceof Bitfield) {
        this.readBitfield(v.type, v.flags);
      } else if (v instanceof StringT) {
        this.readString(v.size, k);
      } else {
        this.res[k] = this[`read${v}`]();
      }
    });

    return this.res;
  }

  toBuffer(value) {
    this.pos_2 = 0;

    Object.entries(this.fields).forEach(([k, v]) => {
      if (v instanceof ArrayT) {
        this.writeArray(v.type, value[k]);
      } else if (v instanceof Bitfield) {
        this.writeBitfield(v.type, v.flags, value);
      } else if (v instanceof StringT) {
        this.writeString(value[k]);
      } else {
        this[`write${v}`](value[k]);
      }
    });

    return this.buffer;
  }

  // DecodeStream
  readArray(type, length, key) {
    this.res[key] = Array.from({ length: length }, () => this[`read${type}`]());
  }

  readBitfield(type, flags) {
    if (type instanceof ArrayT) {
      const value = Array.from({ length: type.length }, () => this[`read${type.type}`]());
      const bitlength = Struct[`size${type.type}`] * 8;

      let flag_i = 0;

      value.forEach((value) => {
        for (let i = 0; i < bitlength; i++) {
          if (flags[flag_i] != null) {
            this.res[flags[flag_i]] = !!(value & (1 << i));
          }
          flag_i++;
        }
      });
    } else {
      const value = this[`read${type}`]();

      flags.forEach((flag, i) => {
        if (flag != null) {
          this.res[flag] = !!(value & (1 << i));
        }
      });
    }
  }

  readString(length, key) {
    this.res[key] = textDecoder.decode(this.view_1.buffer.slice(this.byteOffset + this.pos_1, this.byteOffset + this.pos_1 + length));
    this.pos_1 += length;
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
    array.forEach((v) => {
      this[`write${type}`](v);
    })
  }

  writeBitfield(type, flags, keys) {
    if (type instanceof ArrayT) {
      const values = [];
      const bitlength = Struct[`size${type.type}`] * 8;
      let value = 0;

      flags.forEach((flag, i) => {
        const j = i % bitlength;
        if (flag != null) {
          if (keys[flag]) { value |= (1 << j); }
        }
        if (j == (bitlength - 1)) {
          values.push(value);
          value = 0;
        }
      });

      if ((flags.length % bitlength) != 0) {
        values.push(value);
      }

      this.writeArray(type.type, values);
    } else {
      let value = 0;

      flags.forEach((flag, i) => {
        if (flag != null) {
          if (keys[flag]) { value |= (1 << i); }
        }
      });

      this[`write${type}`](value);
    }
  }

  writeString(string) {
    // let buf;
    // switch (encoding) {
    //   case 'ascii':
    //     buf = stringToAscii(string);
    //     break;

    //   case 'utf16le':
    //   case 'utf16-le':
    //   case 'ucs2': // node treats this the same as utf16.
    //     buf = stringToUtf16(string, isBigEndian);
    //     break;

    //   case 'utf16be':
    //   case 'utf16-be':
    //     buf = stringToUtf16(string, !isBigEndian);
    //     break;

    //   case 'utf8':
    //     buf = textEncoder.encode(string);
    //     break;

    //   default:
    //     throw new Error(`Unsupported encoding: ${encoding}`);
    // }

    this.writeBuffer(textEncoder.encode(string));
  }

  writeBuffer(buffer) {
    this.buffer.set(buffer, this.pos_2);
    this.pos_2 += buffer.length;
  }

  writeUInt8(value) {
    this.view_2.setUint8(this.pos_2, value);
    this.pos_2 += 1;
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
