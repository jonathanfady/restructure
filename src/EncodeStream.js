const textEncoder = new TextEncoder();
const isBigEndian = new Uint8Array(new Uint16Array([0x1234]).buffer)[0] == 0x12;

export class EncodeStream {
  constructor(buffer) {
    this.buffer = buffer;
    this.view = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
    this.pos = 0;
  }

  writeBuffer(buffer) {
    this.buffer.set(buffer, this.pos);
    this.pos += buffer.length;
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