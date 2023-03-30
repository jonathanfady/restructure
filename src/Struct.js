export class Struct {
  /** static properties */
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

  constructor(fields) {
    this.fields = fields;
    this.results = {};

    this.arrays = [];
    this.arrays_index = 0;

    this.size = Object.values(fields).reduce((prev, curr) => {
      if (typeof curr == 'string') { // Number
        return prev += Struct[`size${curr}`];
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

    for (const [k, v] of Object.entries(this.fields)) {
      if (typeof v == 'string') { // Number
        // console.time('Number')
        this.results[k] = this[`read${v}`]();
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
    }

    return this.results;
  }

  toBuffer(values) {
    this.pos_2 = 0;

    for (const [k, v] of Object.entries(this.fields)) {
      if (typeof v == 'string') { // Number
        // console.time('Number')
        this[`write${v}`](values[k]);
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
    }

    return this.buffer;
  }

  // DecodeStream
  readArray(type) {
    const arr = this.arrays[this.arrays_index++];
    for (let i = 0; i < arr.length; ++i) {
      arr[i] = this[`read${type}`]();
    }
    return arr;
  }

  readBitfield(type, flags) {
    if (typeof type == 'string') { // Number
      const value = this[`read${type}`]();

      for (let i = 0; i < flags.length; ++i) {
        const flag = flags[i];
        if (flag != null) {
          this.results[flag] = !!(value & (1 << i));
        }
      }
    } else { // Array
      let flag_i = 0;
      for (let i = 0; i < type.size; ++i) {
        const value = this.readUInt8();
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

  readUInt8() {
    return this.view_1.getUint8(this.pos_1++);
  }
  readInt8() {
    return this.view_1.getInt8(this.pos_1++);
  }

  readUInt16BE() {
    return this.view_1.getUint16((this.pos_1 += 2) - 2);
  }
  readUInt16LE() {
    return this.view_1.getUint16((this.pos_1 += 2) - 2, true);
  }
  readInt16BE() {
    return this.view_1.getInt16((this.pos_1 += 2) - 2);
  }
  readInt16LE() {
    return this.view_1.getInt16((this.pos_1 += 2) - 2, true);
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
    return this.view_1.getUint32((this.pos_1 += 4) - 4);
  }
  readUInt32LE() {
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
      this[`write${type}`](value);
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

      this[`write${type}`](value);
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
