import { Array as ArrayT } from './Array.js';
import { Bitfield } from './Bitfield.js';
import * as n from './Number.js';
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
  constructor(fields = {}) {
    this.fields = fields;

    this.size = 0;
    for (let key in fields) {
      this.size += fields[key].size;
    }

    this.decode_buffer = new Uint8Array(this.size);
    this.buffer = new Uint8Array(this.size);
    this.view = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
    this.pos = 0;
  }

  fromBuffer(buffer) {
    this.decode_buffer = buffer;
    this.view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    this.pos = 0;

    const res = {};

    for (let key in this.fields) {
      res[key] = this.decode(this.fields[key]);
      // res[key] = this.fields[key].decode();
    }

    return res;
  }

  toBuffer(value) {
    this.view = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
    this.pos = 0;

    for (let key in this.fields) {
      this.encode(this.fields[key], value[key]);
      // this.fields[key].encode(value[key]);
    }

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
      return this.readNumber(type)
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
      this.writeNumber(type, value)
    }
  }

  // DecodeStream
  readArray(type, length) {
    const res = [];

    for (let i = 0; i < length; i++) {
      res.push(this.readNumber(type));
    }

    return res;
  }

  readBitfield(type, flags) {
    if (type instanceof ArrayT) {
      const val = this.readArray(type.type, type.length);
      const res = {};
      const bitlength = type.type.size * 8;
      for (let i = 0; i < flags.length; i++) {
        const j = i % bitlength;
        const flag = flags[i];
        if (flag !== null) {
          res[flag] = !!(val[0] & (1 << j));
        }
        if (j === (bitlength - 1)) {
          val.shift()
        }
      }

      return res;
    } else {
      const val = this.readNumber(type);
      const res = {};
      for (let i = 0; i < flags.length; i++) {
        const flag = flags[i];
        if (flag != null) {
          res[flag] = !!(val & (1 << i));
        }
      }

      return res;
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
    return this.decode_buffer.slice(this.pos, (this.pos += length));
  }

  readNumber(type) {
    if (type instanceof n.Uint8) {
      return this.readUInt8()
    } else if (type instanceof n.Int8) {
      return this.readInt8()
    } else if (type instanceof n.UInt16BE) {
      return this.readUInt16BE()
    } else if (type instanceof n.UInt16LE) {
      return this.readUInt16LE()
    } else if (type instanceof n.Int16BE) {
      return this.readInt16BE()
    } else if (type instanceof n.Int16LE) {
      return this.readInt16LE()
    } else if (type instanceof n.UInt24BE) {
      return this.readUInt24BE()
    } else if (type instanceof n.UInt24LE) {
      return this.readUInt24LE()
    } else if (type instanceof n.Int24BE) {
      return this.readInt24BE()
    } else if (type instanceof n.Int24LE) {
      return this.readInt24LE()
    } else if (type instanceof n.UInt32BE) {
      return this.readUInt32BE()
    } else if (type instanceof n.UInt32LE) {
      return this.readUInt32LE()
    } else if (type instanceof n.Int32BE) {
      return this.readInt32BE()
    } else if (type instanceof n.Int32LE) {
      return this.readInt32LE()
    } else if (type instanceof n.FloatBE) {
      return this.readFloatBE()
    } else if (type instanceof n.FloatLE) {
      return this.readFloatLE()
    } else if (type instanceof n.DoubleBE) {
      return this.readDoubleBE()
    } else if (type instanceof n.DoubleLE) {
      return this.readDoubleLE()
    } else {
      throw new Error(`readNumber: unknown type ${type}`)
    }
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

  readUInt8() {
    const ret = this.view.getUint8(this.pos);
    this.pos += 1;
    return ret;
  }
  readInt8() {
    const ret = this.view.getInt8(this.pos);
    this.pos += 1;
    return ret;
  }

  readUInt16BE() {
    const ret = this.view.getUint16(this.pos);
    this.pos += 2;
    return ret;
  }
  readUInt16LE() {
    const ret = this.view.getUint16(this.pos, true);
    this.pos += 2;
    return ret;
  }
  readInt16BE() {
    const ret = this.view.getInt16(this.pos);
    this.pos += 2;
    return ret;
  }
  readInt16LE() {
    const ret = this.view.getInt16(this.pos, true);
    this.pos += 2;
    return ret;
  }

  readUInt32BE() {
    const ret = this.view.getUint32(this.pos);
    this.pos += 4;
    return ret;
  }
  readUInt32LE() {
    const ret = this.view.getUint32(this.pos, true);
    this.pos += 4;
    return ret;
  }
  readInt32BE() {
    const ret = this.view.getInt32(this.pos);
    this.pos += 4;
    return ret;
  }
  readInt32LE() {
    const ret = this.view.getInt32(this.pos, true);
    this.pos += 4;
    return ret;
  }

  readFloatBE() {
    const ret = this.view.getFloat32(this.pos);
    this.pos += 4;
    return ret;
  }
  readFloatLE() {
    const ret = this.view.getFloat32(this.pos, true);
    this.pos += 4;
    return ret;
  }

  readDoubleBE() {
    const ret = this.view.getFloat64(this.pos);
    this.pos += 8;
    return ret;
  }
  readDoubleLE() {
    const ret = this.view.getFloat64(this.pos, true);
    this.pos += 8;
    return ret;
  }

  // EncodeStream
  writeArray(type, val) {
    for (let item of val) {
      this.writeNumber(type, item);
    }
  }

  writeBitfield(type, flags, keys) {
    if (type instanceof ArrayT) {
      const vals = [];
      const bitlength = type.type.size * 8;
      let val = 0;
      for (let i = 0; i < flags.length; i++) {
        const j = i % bitlength;
        const flag = flags[i];
        if (flag != null) {
          if (keys[flag]) { val |= (1 << j); }
        }
        if (j == (bitlength - 1)) {
          vals.push(val);
          val = 0;
        }
      }
      if ((flags.length % bitlength) != 0) {
        vals.push(val);
      }

      this.writeArray(type.type, vals);
    } else {
      let val = 0;
      for (let i = 0; i < flags.length; i++) {
        const flag = flags[i];
        if (flag != null) {
          if (keys[flag]) { val |= (1 << i); }
        }
      }

      this.writeNumber(type, val);
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
    this.buffer.set(buffer, this.pos);
    this.pos += buffer.length;
  }

  writeNumber(type, val) {
    if (type instanceof n.Uint8) {
      this.writeUInt8(val)
    } else if (type instanceof n.Int8) {
      this.writeInt8(val)
    } else if (type instanceof n.UInt16BE) {
      this.writeUInt16BE(val)
    } else if (type instanceof n.UInt16LE) {
      this.writeUInt16LE(val)
    } else if (type instanceof n.Int16BE) {
      this.writeInt16BE(val)
    } else if (type instanceof n.Int16LE) {
      this.writeInt16LE(val)
    } else if (type instanceof n.UInt24BE) {
      this.writeUInt24BE(val)
    } else if (type instanceof n.UInt24LE) {
      this.writeUInt24LE(val)
    } else if (type instanceof n.Int24BE) {
      this.writeInt24BE(val)
    } else if (type instanceof n.Int24LE) {
      this.writeInt24LE(val)
    } else if (type instanceof n.UInt32BE) {
      this.writeUInt32BE(val)
    } else if (type instanceof n.UInt32LE) {
      this.writeUInt32LE(val)
    } else if (type instanceof n.Int32BE) {
      this.writeInt32BE(val)
    } else if (type instanceof n.Int32LE) {
      this.writeInt32LE(val)
    } else if (type instanceof n.FloatBE) {
      this.writeFloatBE(val)
    } else if (type instanceof n.FloatLE) {
      this.writeFloatLE(val)
    } else if (type instanceof n.DoubleBE) {
      this.writeDoubleBE(val)
    } else if (type instanceof n.DoubleLE) {
      this.writeDoubleLE(val)
    } else {
      throw new Error(`writeNumber: unknown type ${type}`)
    }
  }

  writeUInt24BE(val) {
    this.buffer[this.pos++] = (val >>> 16) & 0xff;
    this.buffer[this.pos++] = (val >>> 8) & 0xff;
    this.buffer[this.pos++] = val & 0xff;
  }

  writeUInt24LE(val) {
    this.buffer[this.pos++] = val & 0xff;
    this.buffer[this.pos++] = (val >>> 8) & 0xff;
    this.buffer[this.pos++] = (val >>> 16) & 0xff;
  }

  writeInt24BE(val) {
    if (val >= 0) {
      this.writeUInt24BE(val);
    } else {
      this.writeUInt24BE(val + 0xffffff + 1);
    }
  }

  writeInt24LE(val) {
    if (val >= 0) {
      this.writeUInt24LE(val);
    } else {
      this.writeUInt24LE(val + 0xffffff + 1);
    }
  }

  writeUInt8(value) {
    this.view.setUint8(this.pos, value);
    this.pos += 1;
  }
  writeInt8(value) {
    this.view.setInt8(this.pos, value);
    this.pos += 1;
  }

  writeUInt16BE(value) {
    this.view.setUint16(this.pos, value);
    this.pos += 2;
  }
  writeUInt16LE(value) {
    this.view.setUint16(this.pos, value, true);
    this.pos += 2;
  }
  writeInt16BE(value) {
    this.view.setInt16(this.pos, value);
    this.pos += 2;
  }
  writeInt16LE(value) {
    this.view.setInt16(this.pos, value, true);
    this.pos += 2;
  }

  writeUInt32BE(value) {
    this.view.setUint32(this.pos, value);
    this.pos += 4;
  }
  writeUInt32LE(value) {
    this.view.setUint32(this.pos, value, true);
    this.pos += 4;
  }
  writeInt32BE(value) {
    this.view.setInt32(this.pos, value);
    this.pos += 4;
  }
  writeInt32LE(value) {
    this.view.setInt32(this.pos, value, true);
    this.pos += 4;
  }

  writeFloatBE(value) {
    this.view.setFloat32(this.pos, value);
    this.pos += 4;
  }
  writeFloatLE(value) {
    this.view.setFloat32(this.pos, value, true);
    this.pos += 4;
  }

  writeDoubleBE(value) {
    this.view.setFloat64(this.pos, value);
    this.pos += 8;
  }
  writeDoubleLE(value) {
    this.view.setFloat64(this.pos, value, true);
    this.pos += 8;
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