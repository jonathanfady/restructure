export const uint8 = 0;
export const int8 = 1;
export const uint16be = 2;
export const uint16 = uint16be;
export const uint16le = 3;
export const int16be = 4;
export const int16 = int16be;
export const int16le = 5;
export const uint24be = 6;
export const uint24 = uint24be;
export const uint24le = 7;
export const int24be = 8;
export const int24 = int24be;
export const int24le = 9;
export const uint32be = 10;
export const uint32 = uint32be;
export const uint32le = 11;
export const int32be = 12;
export const int32 = int32be;
export const int32le = 13;
export const floatbe = 14;
export const float = floatbe;
export const floatle = 15;
export const doublebe = 16;
export const double = doublebe;
export const doublele = 17;

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