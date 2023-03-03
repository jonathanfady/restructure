// import { Base } from './Base.js';

class Uint8 /*extends Base*/ {
  size() { return 1; }
  decode(stream) { return stream.readUInt8(); }
  encode(stream, val) { stream.writeUInt8(val); }
}
class Int8 /*extends Base*/ {
  size() { return 1; }
  decode(stream) { return stream.readInt8(); }
  encode(stream, val) { stream.writeInt8(val); }
}

class UInt16BE /*extends Base*/ {
  size() { return 2; }
  decode(stream) { return stream.readUInt16BE(); }
  encode(stream, val) { stream.writeUInt16BE(val); }
}
class UInt16LE /*extends Base*/ {
  size() { return 2; }
  decode(stream) { return stream.readUInt16LE(); }
  encode(stream, val) { stream.writeUInt16LE(val); }
}
class Int16BE /*extends Base*/ {
  size() { return 2; }
  decode(stream) { return stream.readInt16BE(); }
  encode(stream, val) { stream.writeInt16BE(val); }
}
class Int16LE /*extends Base*/ {
  size() { return 2; }
  decode(stream) { return stream.readInt16LE(); }
  encode(stream, val) { stream.writeInt16LE(val); }
}

class UInt24BE /*extends Base*/ {
  size() { return 3; }
  decode(stream) { return stream.readUInt24BE(); }
  encode(stream, val) { stream.writeUInt24BE(val); }
}
class UInt24LE /*extends Base*/ {
  size() { return 3; }
  decode(stream) { return stream.readUInt24LE(); }
  encode(stream, val) { stream.writeUInt24LE(val); }
}
class Int24BE /*extends Base*/ {
  size() { return 3; }
  decode(stream) { return stream.readInt24BE(); }
  encode(stream, val) { stream.writeInt24BE(val); }
}
class Int24LE /*extends Base*/ {
  size() { return 3; }
  decode(stream) { return stream.readInt24LE(); }
  encode(stream, val) { stream.writeInt24LE(val); }
}

class UInt32BE /*extends Base*/ {
  size() { return 4; }
  decode(stream) { return stream.readUInt32BE(); }
  encode(stream, val) { stream.writeUInt32BE(val); }
}
class UInt32LE /*extends Base*/ {
  size() { return 4; }
  decode(stream) { return stream.readUInt32LE(); }
  encode(stream, val) { stream.writeUInt32LE(val); }
}
class Int32BE /*extends Base*/ {
  size() { return 4; }
  decode(stream) { return stream.readInt32BE(); }
  encode(stream, val) { stream.writeInt32BE(val); }
}
class Int32LE /*extends Base*/ {
  size() { return 4; }
  decode(stream) { return stream.readInt32LE(); }
  encode(stream, val) { stream.writeInt32LE(val); }
}

class FloatBE /*extends Base*/ {
  size() { return 4; }
  decode(stream) { return stream.readFloatBE(); }
  encode(stream, val) { stream.writeFloatBE(val); }
}
class FloatLE /*extends Base*/ {
  size() { return 4; }
  decode(stream) { return stream.readFloatLE(); }
  encode(stream, val) { stream.writeFloatLE(val); }
}

class DoubleBE /*extends Base*/ {
  size() { return 8; }
  decode(stream) { return stream.readDoubleBE(); }
  encode(stream, val) { stream.writeDoubleBE(val); }
}
class DoubleLE /*extends Base*/ {
  size() { return 8; }
  decode(stream) { return stream.readDoubleLE(); }
  encode(stream, val) { stream.writeDoubleLE(val); }
}

export const uint8 = new Uint8();
export const uint16be = new UInt16BE();
export const uint16 = uint16be;
export const uint16le = new UInt16LE();
export const uint24be = new UInt24BE();
export const uint24 = uint24be;
export const uint24le = new UInt24LE();
export const uint32be = new UInt32BE();
export const uint32 = uint32be;
export const uint32le = new UInt32LE();
export const int8 = new Int8();
export const int16be = new Int16BE();
export const int16 = int16be;
export const int16le = new Int16LE();
export const int24be = new Int24BE();
export const int24 = int24be;
export const int24le = new Int24LE();
export const int32be = new Int32BE();
export const int32 = int32be;
export const int32le = new Int32LE();
export const floatbe = new FloatBE();
export const float = floatbe;
export const floatle = new FloatLE();
export const doublebe = new DoubleBE();
export const double = doublebe;
export const doublele = new DoubleLE();