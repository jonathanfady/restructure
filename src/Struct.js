import { Array as ArrayT } from './Array.js';
import { Bitfield } from './Bitfield.js';
import { String as StringT } from './String.js';

// Node back-compat.
const ENCODING_MAPPING = {
  utf16le: 'utf-16le',
  ucs2: 'utf-16le',
  utf16be: 'utf-16be'
}
const textEncoder = new TextEncoder();
const isBigEndian = new Uint8Array(new Uint16Array([0x1234]).buffer)[0] == 0x12;

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
    this.view = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
    this.pos_1 = 0;
    this.pos_2 = 0;
  }

  fromBuffer(buffer) {
    this.byteOffset = buffer.byteOffset;
    this.view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    this.pos_1 = 0;

    const res = {};

    // for (let key in this.fields) {
    //   res[key] = this.decode(this.fields[key]);
    //   // res[key] = this.fields[key].decode();
    // }
    Object.entries(this.fields).forEach(([k, v]) => {
      res[k] = this.decode(v);
    })

    return res;
  }

  toBuffer(value) {
    this.view = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
    this.pos_2 = 0;

    // for (let key in this.fields) {
    //   this.encode(this.fields[key], value[key]);
    //   // this.fields[key].encode(value[key]);
    // }
    Object.entries(this.fields).forEach(([k, v]) => {
      this.encode(v, value[k]);
    })

    return this.buffer;
  }

  decode(type) {
    if (type instanceof ArrayT) {
      return this.readArray(type.type, type.length)
    } else if (type instanceof Bitfield) {
      return this.readBitfield(type.type, type.flags)
    } else if (type instanceof StringT) {
      return this.readString(type.length, type.encoding)
    } else {
      return this[`read${type}`]()
    }
  }

  encode(type, value) {
    if (type instanceof ArrayT) {
      this.writeArray(type.type, value)
    } else if (type instanceof Bitfield) {
      this.writeBitfield(type.type, type.flags, value)
    } else if (type instanceof StringT) {
      this.writeString(value, type.encoding)
    } else {
      this[`write${type}`](value)
    }
  }

  // DecodeStream
  readArray(type, length) {
    return Array.from({ length: length }, () => this[`read${type}`]())
  }

  readBitfield(type, flags) {
    if (type instanceof ArrayT) {
      const value = this.readArray(type.type, type.length);
      const bitlength = Struct[`size${type.type}`] * 8;

      return flags.reduce((prev, curr, i) => {
        const j = i % bitlength;
        if (curr != null) {
          prev[curr] = !!(value[0] & (1 << j));
        }
        if (j == (bitlength - 1)) {
          value.shift()
        }
        return prev;
      }, {})
    } else {
      const value = this[`read${type}`]();

      return flags.reduce((prev, curr, i) => {
        if (curr != null) {
          prev[curr] = !!(value & (1 << i));
        }
        return prev;
      }, {})
    }
  }

  readString(length, encoding = 'ascii') {
    encoding = ENCODING_MAPPING[encoding] || encoding;

    const buf = this.readBuffer(length);
    try {
      const decoder = new TextDecoder(encoding);
      return decoder.decode(buf);
    } catch (err) {
      return buf;
    }
  }

  readBuffer(length) {
    const buf = this.view.buffer.slice(this.byteOffset + this.pos_1, this.byteOffset + this.pos_1 + length);
    this.pos_1 += length;
    return buf;
  }

  readUInt8() {
    const ret = this.view.getUint8(this.pos_1);
    this.pos_1 += 1;
    return ret;
  }
  readInt8() {
    const ret = this.view.getInt8(this.pos_1);
    this.pos_1 += 1;
    return ret;
  }

  readUInt16BE() {
    const ret = this.view.getUint16(this.pos_1);
    this.pos_1 += 2;
    return ret;
  }
  readUInt16LE() {
    const ret = this.view.getUint16(this.pos_1, true);
    this.pos_1 += 2;
    return ret;
  }
  readInt16BE() {
    const ret = this.view.getInt16(this.pos_1);
    this.pos_1 += 2;
    return ret;
  }
  readInt16LE() {
    const ret = this.view.getInt16(this.pos_1, true);
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
    const ret = this.view.getUint32(this.pos_1);
    this.pos_1 += 4;
    return ret;
  }
  readUInt32LE() {
    const ret = this.view.getUint32(this.pos_1, true);
    this.pos_1 += 4;
    return ret;
  }
  readInt32BE() {
    const ret = this.view.getInt32(this.pos_1);
    this.pos_1 += 4;
    return ret;
  }
  readInt32LE() {
    const ret = this.view.getInt32(this.pos_1, true);
    this.pos_1 += 4;
    return ret;
  }

  readFloatBE() {
    const ret = this.view.getFloat32(this.pos_1);
    this.pos_1 += 4;
    return ret;
  }
  readFloatLE() {
    const ret = this.view.getFloat32(this.pos_1, true);
    this.pos_1 += 4;
    return ret;
  }

  readDoubleBE() {
    const ret = this.view.getFloat64(this.pos_1);
    this.pos_1 += 8;
    return ret;
  }
  readDoubleLE() {
    const ret = this.view.getFloat64(this.pos_1, true);
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
      })
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
      })

      this[`write${type}`](value);
    }
  }

  writeString(string, encoding = 'ascii') {
    let buf;
    switch (encoding) {
      case 'ascii':
        buf = stringToAscii(string);
        break;

      case 'utf16le':
      case 'utf16-le':
      case 'ucs2': // node treats this the same as utf16.
        buf = stringToUtf16(string, isBigEndian);
        break;

      case 'utf16be':
      case 'utf16-be':
        buf = stringToUtf16(string, !isBigEndian);
        break;

      case 'utf8':
        buf = textEncoder.encode(string);
        break;

      default:
        throw new Error(`Unsupported encoding: ${encoding}`);
    }

    this.writeBuffer(buf);
  }

  writeBuffer(buffer) {
    this.buffer.set(buffer, this.pos_2);
    this.pos_2 += buffer.length;
  }

  writeUInt8(value) {
    this.view.setUint8(this.pos_2, value);
    this.pos_2 += 1;
  }
  writeInt8(value) {
    this.view.setInt8(this.pos_2, value);
    this.pos_2 += 1;
  }

  writeUInt16BE(value) {
    this.view.setUint16(this.pos_2, value);
    this.pos_2 += 2;
  }
  writeUInt16LE(value) {
    this.view.setUint16(this.pos_2, value, true);
    this.pos_2 += 2;
  }
  writeInt16BE(value) {
    this.view.setInt16(this.pos_2, value);
    this.pos_2 += 2;
  }
  writeInt16LE(value) {
    this.view.setInt16(this.pos_2, value, true);
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
    this.view.setUint32(this.pos_2, value);
    this.pos_2 += 4;
  }
  writeUInt32LE(value) {
    this.view.setUint32(this.pos_2, value, true);
    this.pos_2 += 4;
  }
  writeInt32BE(value) {
    this.view.setInt32(this.pos_2, value);
    this.pos_2 += 4;
  }
  writeInt32LE(value) {
    this.view.setInt32(this.pos_2, value, true);
    this.pos_2 += 4;
  }

  writeFloatBE(value) {
    this.view.setFloat32(this.pos_2, value);
    this.pos_2 += 4;
  }
  writeFloatLE(value) {
    this.view.setFloat32(this.pos_2, value, true);
    this.pos_2 += 4;
  }

  writeDoubleBE(value) {
    this.view.setFloat64(this.pos_2, value);
    this.pos_2 += 8;
  }
  writeDoubleLE(value) {
    this.view.setFloat64(this.pos_2, value, true);
    this.pos_2 += 8;
  }
}

function stringToUtf16(string, swap) {
  let buf = new Uint16Array(string.length);
  for (let i = 0; i < string.length; i++) {
    let code = string.charCodeAt(i);
    if (swap) {
      code = (code >> 8) | ((code & 0xff) << 8);
    }
    buf[i] = code;
  }
  return new Uint8Array(buf.buffer);
}

function stringToAscii(string) {
  let buf = new Uint8Array(string.length);
  for (let i = 0; i < string.length; i++) {
    // Match node.js behavior - encoding allows 8-bit rather than 7-bit.
    buf[i] = string.charCodeAt(i);
  }
  return buf;
}