import { getNumberSize } from './Number.js';

export class Struct {
  /**
   * @param {Record<string,any>} fields
   */
  constructor(fields) {
    this.fields = new Map(Object.entries(fields));
    this.results = new Map();

    this.size = 0;
    for (const [k, value] of this.fields) {
      if (typeof value == 'string') { // Number
        this.results.set(k, 0);
        this.size += getNumberSize(value);
      } else if ("length" in value) { // Array
        this.results.set(k, new Array(value.length).fill(0));
        this.size += value.size;
      } else if ("flags" in value) { // Bitfield
        for (const flag of value.flags) {
          if (flag) {
            this.results.set(flag, false);
          }
        }
        this.size += value.size;
      } else { // String
        this.results.set(k, '');
        this.size += value.size;
      }
    }

    this.buffer = new Uint8Array(this.size);
    this.view = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
  }

  /**
   * @param {Uint8Array} buffer
   */
  fromBuffer(buffer) {
    if (buffer.byteLength >= this.size) {
      this.view_1 = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
      this.pos_1 = 0;

      for (const [k, v] of this.fields) {
        if (typeof v == 'string') { // Number
          this.results.set(k, this['read' + v]());
        } else if ("length" in v) { // Array
          this.results.set(k, this.readArray(v.type, v.length));
        } else if ("flags" in v) { // Bitfield
          this.readBitfield(v.type, v.flags);
        } else { // String
          this.results.set(k, this.readString(v.size));
        }
      }
    }

    return this.results;
  }

  /**
   * @param {Map<string, any>} values
   */
  toBuffer(values) {
    this.pos = 0;

    for (const [k, v] of this.fields) {
      if (typeof v == 'string') { // Number
        this['write' + v](values.get(k));
      } else if ("length" in v) { // Array
        this.writeArray(v.type, v.length, values.get(k));
      } else if ("flags" in v) { // Bitfield
        this.writeBitfield(v.type, v.flags, values);
      } else { // String
        this.writeString(v.size, values.get(k));
      }
    }

    return this.buffer;
  }

  // DecodeStream
  readArray(type, length) {
    const arr = new Array(length);
    for (let i = 0; i < length; ++i) {
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
          this.results.set(flag, !!(value & (1 << i)));
        }
      }
    } else { // Array
      let flag_i = 0;
      for (let i = 0; i < type.size; ++i) {
        const value = this.readUint8();
        for (let j = 0; j < 8; ++j) {
          const flag = flags[flag_i];
          if (flag != null) {
            this.results.set(flag, !!(value & (1 << j)));
          }
          flag_i++;
        }
      }
    }
  }

  readString(length) {
    let string = '';
    for (let i = 0; i < length; ++i) {
      const value = this.view_1.getUint8(this.pos_1++);
      if (value) {
        string += String.fromCharCode(value);
      }
    }
    return string;
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
  writeArray(type, length, array) {
    for (let i = 0; i < length; ++i) {
      this['write' + type](array[i] ?? 0);
    }
  }

  writeBitfield(type, flags, values) {
    if (typeof type == 'string') { // Number
      let value = 0;
      for (let i = 0; i < flags.length; ++i) {
        const flag = flags[i];
        if ((flag != null) && (values.get(flag))) {
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
          if ((flag != null) && (values.get(flag))) {
            value |= (1 << j);
          }
          flag_i++;
        }
        this.buffer[this.pos++] = value;
      }
    }
  }

  writeString(length, string) {
    for (let i = 0; i < length; ++i) {
      this.buffer[this.pos++] = string.charCodeAt(i);
    }
  }

  writeUint8(value) {
    this.buffer[this.pos++] = value;
  }
  writeInt8(value) {
    this.view.setInt8(this.pos++, value);
  }

  writeUint16BE(value) {
    this.view.setUint16(this.pos, value);
    this.pos += 2;
  }
  writeUint16LE(value) {
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

  writeUint24BE(value) {
    this.buffer[this.pos++] = (value >>> 16) & 0xff;
    this.buffer[this.pos++] = (value >>> 8) & 0xff;
    this.buffer[this.pos++] = value & 0xff;
  }

  writeUint24LE(value) {
    this.buffer[this.pos++] = value & 0xff;
    this.buffer[this.pos++] = (value >>> 8) & 0xff;
    this.buffer[this.pos++] = (value >>> 16) & 0xff;
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
    this.view.setUint32(this.pos, value);
    this.pos += 4;
  }
  writeUint32LE(value) {
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
