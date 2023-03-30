import { getNumberSize } from './Number.js';

export class Struct {

  constructor(fields) {
    this.fields = fields;
    this.results = {};

    this.arrays = [];
    this.arrays_index = 0;

    this.size = Object.values(fields).reduce((prev, curr) => {
      if (typeof curr == 'number') { // Number
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

    for (const [k, v] of Object.entries(this.fields)) {
      if (typeof v == 'number') { // Number
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
      if (typeof v == 'number') { // Number
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
    if (typeof type == 'number') { // Number
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
        const value = this.read0();
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

  read0() {
    return this.view_1.getUint8(this.pos_1++);
  }
  read1() {
    return this.view_1.getInt8(this.pos_1++);
  }

  read2() {
    return this.view_1.getUint16((this.pos_1 += 2) - 2);
  }
  read3() {
    return this.view_1.getUint16((this.pos_1 += 2) - 2, true);
  }
  read4() {
    return this.view_1.getInt16((this.pos_1 += 2) - 2);
  }
  read5() {
    return this.view_1.getInt16((this.pos_1 += 2) - 2, true);
  }

  read6() {
    return (this.read2() << 8) + this.read0();
  }

  read7() {
    return this.read3() + (this.read0() << 16);
  }

  read8() {
    return (this.read4() << 8) + this.read0();
  }

  read9() {
    return this.read3() + (this.read1() << 16);
  }

  read10() {
    return this.view_1.getUint32((this.pos_1 += 4) - 4);
  }
  read11() {
    return this.view_1.getUint32((this.pos_1 += 4) - 4, true);
  }
  read12() {
    return this.view_1.getInt32((this.pos_1 += 4) - 4);
  }
  read13() {
    return this.view_1.getInt32((this.pos_1 += 4) - 4, true);
  }

  read14() {
    return this.view_1.getFloat32((this.pos_1 += 4) - 4);
  }
  read15() {
    return this.view_1.getFloat32((this.pos_1 += 4) - 4, true);
  }

  read16() {
    return this.view_1.getFloat64((this.pos_1 += 8) - 8);
  }
  read17() {
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
    if (typeof type == 'number') { // Number
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

  write0(value) {
    this.buffer[this.pos_2++] = value;
  }
  write1(value) {
    this.view_2.setInt8(this.pos_2++, value);
  }

  write2(value) {
    this.view_2.setUint16(this.pos_2, value);
    this.pos_2 += 2;
  }
  write3(value) {
    this.view_2.setUint16(this.pos_2, value, true);
    this.pos_2 += 2;
  }
  write4(value) {
    this.view_2.setInt16(this.pos_2, value);
    this.pos_2 += 2;
  }
  write5(value) {
    this.view_2.setInt16(this.pos_2, value, true);
    this.pos_2 += 2;
  }

  write6(value) {
    this.buffer[this.pos_2++] = (value >>> 16) & 0xff;
    this.buffer[this.pos_2++] = (value >>> 8) & 0xff;
    this.buffer[this.pos_2++] = value & 0xff;
  }

  write7(value) {
    this.buffer[this.pos_2++] = value & 0xff;
    this.buffer[this.pos_2++] = (value >>> 8) & 0xff;
    this.buffer[this.pos_2++] = (value >>> 16) & 0xff;
  }

  write8(value) {
    if (value >= 0) {
      this.write6(value);
    } else {
      this.write6(value + 0xffffff + 1);
    }
  }

  write9(value) {
    if (value >= 0) {
      this.write7(value);
    } else {
      this.write7(value + 0xffffff + 1);
    }
  }

  write10(value) {
    this.view_2.setUint32(this.pos_2, value);
    this.pos_2 += 4;
  }
  write11(value) {
    this.view_2.setUint32(this.pos_2, value, true);
    this.pos_2 += 4;
  }
  write12(value) {
    this.view_2.setInt32(this.pos_2, value);
    this.pos_2 += 4;
  }
  write13(value) {
    this.view_2.setInt32(this.pos_2, value, true);
    this.pos_2 += 4;
  }

  write14(value) {
    this.view_2.setFloat32(this.pos_2, value);
    this.pos_2 += 4;
  }
  write15(value) {
    this.view_2.setFloat32(this.pos_2, value, true);
    this.pos_2 += 4;
  }

  write16(value) {
    this.view_2.setFloat64(this.pos_2, value);
    this.pos_2 += 8;
  }
  write17(value) {
    this.view_2.setFloat64(this.pos_2, value, true);
    this.pos_2 += 8;
  }
}
