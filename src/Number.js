
export class Uint8 {
  size = 1;
  decode() { return decode_stream.readUInt8(); }
  encode(val) { encode_stream.writeUInt8(val); }
}
export class Int8 {
  size = 1;
  decode() { return decode_stream.readInt8(); }
  encode(val) { encode_stream.writeInt8(val); }
}

export class UInt16BE {
  size = 2;
  decode() { return decode_stream.readUInt16BE(); }
  encode(val) { encode_stream.writeUInt16BE(val); }
}
export class UInt16LE {
  size = 2;
  decode() { return decode_stream.readUInt16LE(); }
  encode(val) { encode_stream.writeUInt16LE(val); }
}
export class Int16BE {
  size = 2;
  decode() { return decode_stream.readInt16BE(); }
  encode(val) { encode_stream.writeInt16BE(val); }
}
export class Int16LE {
  size = 2;
  decode() { return decode_stream.readInt16LE(); }
  encode(val) { encode_stream.writeInt16LE(val); }
}

export class UInt24BE {
  size = 3;
  decode() { return decode_stream.readUInt24BE(); }
  encode(val) { encode_stream.writeUInt24BE(val); }
}
export class UInt24LE {
  size = 3;
  decode() { return decode_stream.readUInt24LE(); }
  encode(val) { encode_stream.writeUInt24LE(val); }
}
export class Int24BE {
  size = 3;
  decode() { return decode_stream.readInt24BE(); }
  encode(val) { encode_stream.writeInt24BE(val); }
}
export class Int24LE {
  size = 3;
  decode() { return decode_stream.readInt24LE(); }
  encode(val) { encode_stream.writeInt24LE(val); }
}

export class UInt32BE {
  size = 4;
  decode() { return decode_stream.readUInt32BE(); }
  encode(val) { encode_stream.writeUInt32BE(val); }
}
export class UInt32LE {
  size = 4;
  decode() { return decode_stream.readUInt32LE(); }
  encode(val) { encode_stream.writeUInt32LE(val); }
}
export class Int32BE {
  size = 4;
  decode() { return decode_stream.readInt32BE(); }
  encode(val) { encode_stream.writeInt32BE(val); }
}
export class Int32LE {
  size = 4;
  decode() { return decode_stream.readInt32LE(); }
  encode(val) { encode_stream.writeInt32LE(val); }
}

export class FloatBE {
  size = 4;
  decode() { return decode_stream.readFloatBE(); }
  encode(val) { encode_stream.writeFloatBE(val); }
}
export class FloatLE {
  size = 4;
  decode() { return decode_stream.readFloatLE(); }
  encode(val) { encode_stream.writeFloatLE(val); }
}

export class DoubleBE {
  size = 8;
  decode() { return decode_stream.readDoubleBE(); }
  encode(val) { encode_stream.writeDoubleBE(val); }
}
export class DoubleLE {
  size = 8;
  decode() { return decode_stream.readDoubleLE(); }
  encode(val) { encode_stream.writeDoubleLE(val); }
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