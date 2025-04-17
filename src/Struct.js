import { getNumberSize } from './Number.js';

/**
 * Create a structure to encode and decode a Uint8Array buffer into a JavaScript object.
 */
export class Struct {
  /**
   * Create a structure with a Uint8Array buffer, DataView, size and results Map from the fields object provided.
   * Calculates the total buffer size and stores default values for each data type in the results.
   * @param {{[k: string]: any}} fields - object with variable names as keys and data types (Array(), String(), Bitfield(), ...) as values
   */
  constructor(fields) {
    /**
     * Map with values defining data types
     * @type {Map<string, any>}
     */
    this.fields = new Map(Object.entries(fields));
    /**
     * Map with decoded values
     * @type {Map<string, any>}
     */
    this.results = new Map();

    /**
     * Total size of the buffer, determined from all the fields provided in the constructor
     * @type {number}
     */
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

    /**
     * Output buffer with encoded values from a given JavaScript Map
     * @type {Uint8Array}
     */
    this.buffer = new Uint8Array(this.size);

    /**
     * Data View from output buffer, to handle number encoding
     * @type {DataView}
     */
    this.view = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
  }

  /**
   * Decodes the buffer and stores the results in a JavaScript Map.
   * @param {Uint8Array} buffer - encoded buffer
   * @returns {Map<string, any>} - decoded Map
   */
  fromBuffer(buffer) {
    if (buffer.byteLength >= this.size) {
      /**
       * Data View from input buffer, to handle number decoding
       * @type {DataView}
       */
      this.view_1 = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
      /**
       * Current position in the input buffer, incremented after read operations
       * @type {number}
       */
      this.pos_1 = 0;

      for (const [k, v] of this.fields) {
        if (typeof v == 'string') { // Number
          this.results.set(k, this['read' + v]());
        } else if ("length" in v) { // Array
          this.results.set(k, this.readArray(v.type, v.length));
        } else if ("flags" in v) { // Bitfield
          this.readBitfield(v.flags, v.size);
        } else { // String
          this.results.set(k, this.readString(v.size));
        }
      }
    }

    return this.results;
  }

  /**
   * Encodes the values and stores them in a Uint8Array buffer
   * @param {Map<string, any>} values - Map with names and values
   * @returns {Uint8Array} encoded buffer
   */
  toBuffer(values) {
    /**
     * Current position in the output buffer, incremented after write operations
     * @type {number}
     */
    this.pos = 0;

    for (const [k, v] of this.fields) {
      if (typeof v == 'string') { // Number
        this['write' + v](values.get(k));
      } else if ("length" in v) { // Array
        this.writeArray(v.type, v.length, values.get(k));
      } else if ("flags" in v) { // Bitfield
        this.writeBitfield(v.flags, v.size, values);
      } else { // String
        this.writeString(v.size, values.get(k));
      }
    }

    return this.buffer;
  }

  // DecodeStream
  /**
   * @param {string} type
   * @param {number} length
   * @returns {number[]}
   */
  readArray(type, length) {
    const arr = new Array(length);
    for (let i = 0; i < length; ++i) {
      arr[i] = this['read' + type]();
    }
    return arr;
  }

  /**
   * @param {string[]} flags
   * @param {number} size
   */
  readBitfield(flags, size) {
    let flag_i = 0;

    for (let i = 0; i < size; ++i) {
      const value = this.readUint8();
      for (let j = 0; j < 8; ++j) {
        const flag = flags[flag_i++];
        if (flag != null) {
          this.results.set(flag, !!(value & (0x80 >> j)));
        }
      }
    }
  }

  /**
   * @param {number} size
   * @returns {string}
   */
  readString(size) {
    let string = '';
    for (let i = 0; i < size; ++i) {
      const value = this.view_1.getUint8(this.pos_1++);
      // ignore \x00 characters
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
  /**
   * @param {string} type
   * @param {number} length
   * @param {number[]} array
   */
  writeArray(type, length, array) {
    for (let i = 0; i < length; ++i) {
      this['write' + type](array[i]);
    }
  }

  /**
   * @param {string[]} flags
   * @param {number} size
   * @param {Map<string, any>} values
   */
  writeBitfield(flags, size, values) {
    let flag_i = 0;
    for (let i = 0; i < size; ++i) {
      let value = 0;
      for (let j = 0; j < 8; ++j) {
        const flag = flags[flag_i];
        if ((flag != null) && (values.get(flag))) {
          value |= (0x80 >> j);
        }
        flag_i++;
      }
      this.buffer[this.pos++] = value;
    }
  }

  /**
   * @param {number} size
   * @param {string} string
   */
  writeString(size, string) {
    for (let i = 0; i < size; ++i) {
      this.buffer[this.pos++] = string.charCodeAt(i);
    }
  }

  /**
   * @param {number} value
   */
  writeUint8(value) {
    this.buffer[this.pos++] = value;
  }

  /**
   * @param {number} value
   */
  writeInt8(value) {
    this.view.setInt8(this.pos++, value);
  }

  /**
   * @param {number} value
   */
  writeUint16BE(value) {
    this.view.setUint16(this.pos, value);
    this.pos += 2;
  }

  /**
   * @param {number} value
   */
  writeUint16LE(value) {
    this.view.setUint16(this.pos, value, true);
    this.pos += 2;
  }

  /**
   * @param {number} value
   */
  writeInt16BE(value) {
    this.view.setInt16(this.pos, value);
    this.pos += 2;
  }

  /**
   * @param {number} value
   */
  writeInt16LE(value) {
    this.view.setInt16(this.pos, value, true);
    this.pos += 2;
  }

  /**
   * @param {number} value
   */
  writeUint24BE(value) {
    this.buffer[this.pos++] = (value >>> 16) & 0xff;
    this.buffer[this.pos++] = (value >>> 8) & 0xff;
    this.buffer[this.pos++] = value & 0xff;
  }

  /**
   * @param {number} value
   */
  writeUint24LE(value) {
    this.buffer[this.pos++] = value & 0xff;
    this.buffer[this.pos++] = (value >>> 8) & 0xff;
    this.buffer[this.pos++] = (value >>> 16) & 0xff;
  }

  /**
   * @param {number} value
   */
  writeInt24BE(value) {
    if (value >= 0) {
      this.writeUint24BE(value);
    } else {
      this.writeUint24BE(value + 0xffffff + 1);
    }
  }

  /**
   * @param {number} value
   */
  writeInt24LE(value) {
    if (value >= 0) {
      this.writeUint24LE(value);
    } else {
      this.writeUint24LE(value + 0xffffff + 1);
    }
  }

  /**
   * @param {number} value
   */
  writeUint32BE(value) {
    this.view.setUint32(this.pos, value);
    this.pos += 4;
  }

  /**
   * @param {number} value
   */
  writeUint32LE(value) {
    this.view.setUint32(this.pos, value, true);
    this.pos += 4;
  }

  /**
   * @param {number} value
   */
  writeInt32BE(value) {
    this.view.setInt32(this.pos, value);
    this.pos += 4;
  }

  /**
   * @param {number} value
   */
  writeInt32LE(value) {
    this.view.setInt32(this.pos, value, true);
    this.pos += 4;
  }

  /**
   * @param {number} value
   */
  writeFloatBE(value) {
    this.view.setFloat32(this.pos, value);
    this.pos += 4;
  }

  /**
   * @param {number} value
   */
  writeFloatLE(value) {
    this.view.setFloat32(this.pos, value, true);
    this.pos += 4;
  }

  /**
   * @param {number} value
   */
  writeDoubleBE(value) {
    this.view.setFloat64(this.pos, value);
    this.pos += 8;
  }

  /**
   * @param {number} value
   */
  writeDoubleLE(value) {
    this.view.setFloat64(this.pos, value, true);
    this.pos += 8;
  }
}
