export const uint8 = 'Uint8';
export const int8 = 'Int8';
export const uint16be = 'Uint16BE';
export const uint16 = uint16be;
export const uint16le = 'Uint16LE';
export const int16be = 'Int16BE';
export const int16 = int16be;
export const int16le = 'Int16LE';
export const uint24be = 'Uint24BE';
export const uint24 = uint24be;
export const uint24le = 'Uint24LE';
export const int24be = 'Int24BE';
export const int24 = int24be;
export const int24le = 'Int24LE';
export const uint32be = 'Uint32BE';
export const uint32 = uint32be;
export const uint32le = 'Uint32LE';
export const int32be = 'Int32BE';
export const int32 = int32be;
export const int32le = 'Int32LE';
export const floatbe = 'FloatBE';
export const float = floatbe;
export const floatle = 'FloatLE';
export const doublebe = 'DoubleBE';
export const double = doublebe;
export const doublele = 'DoubleLE';

export function getNumberSize(type) {
  switch (type) {
    case uint8:
    case int8:
      return 1;
    case uint16be:
    case uint16le:
    case int16be:
    case int16le:
      return 2;
    case uint24be:
    case uint24le:
    case int24be:
    case int24le:
      return 3;
    case uint32be:
    case uint32le:
    case int32be:
    case int32le:
    case floatbe:
    case floatle:
      return 4;
    case doublebe:
    case doublele:
      return 8;
    default:
      return 0;
  }
}