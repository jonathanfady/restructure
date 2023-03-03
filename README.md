# Restructure

[![Build Status](https://travis-ci.org/devongovett/restructure.svg?branch=master)](https://travis-ci.org/devongovett/restructure)
[![Coverage Status](https://coveralls.io/repos/devongovett/restructure/badge.png?branch=master)](https://coveralls.io/r/devongovett/restructure?branch=master)

Restructure allows you to declaratively encode and decode binary data.
It supports a wide variety of types to enable you to express a multitude
of binary formats without writing any parsing code.

Some of the supported features are C-like structures, versioned structures,
pointers, arrays of any type, strings of a large number of encodings, enums,
bitfields, and more.  See the documentation below for more details.

## Example

This is just a small example of what Restructure can do. Check out the API documentation
below for more information.

```javascript
import * as r from 'restructure';

let Person = new r.Struct({
  name: new r.String(r.uint8, 'utf8'),
  age: r.uint8
});

// decode a person from a buffer
let value = Person.fromBuffer(new Uint8Array([/* ... */])); // returns an object with the fields defined above

// encode a person from an object
let buffer = Person.toBuffer({
  name: 'Devon',
  age: 21
});
```

## API

All of the following types support three standard methods:

* `fromBuffer(buffer)` - decodes an instance of the type from the given Uint8Array
* `size(value)` - returns the amount of space the value would take if encoded
* `toBuffer(value)` - encodes the given value into a Uint8Array

Restructure supports a wide variety of types, but if you need to write your own for
some custom use that cannot be represented by them, you can do so by just implementing
the above methods. Then you can use your type just as you would any other type, in structures
and whatnot.

### Number Types

The following built-in number types are available:

```javascript
uint8, uint16, uint24, uint32, int8, int16, int24, int32, float, double
```

Numbers are big-endian (network order) by default, but little-endian is supported, too:

```javascript
uint16le, uint24le, uint32le, int16le, int24le, int32le, floatle, doublele
```

To avoid ambiguity, big-endian may be used explicitly:

```javascript
uint16be, uint24be, uint32be, int16be, int24be, int32be, floatbe, doublebe
```

### Bitfield

The `Bitfield` type maps a number to an object with boolean keys mapping to each bit in that number,
as defined in an array.
You can also use an Array type with a fixed length to describe long bitfields that don't fit in a number type.

```javascript
var bitfield = new r.Bitfield(r.uint8, ['Jack', 'Kack', 'Lack', 'Mack', 'Nack', 'Oack', 'Pack', 'Quack']);
bitfield.decode(stream);

var result = {
  Jack: true,
  Kack: false,
  Lack: false,
  Mack: true,
  Nack: true,
  Oack: false,
  Pack: true,
  Quack: true
};

bitfield.encode(stream, result);
```

### String

A `String` maps a JavaScript string to and from binary encodings.  The length can be a constant, taken
from a previous field in the parent structure, or encoded using a number type immediately before the string.

Fully supported encodings include `'ascii'`, `'utf8'`, `'ucs2'`, `'utf16le'`, `'utf16be'`. Decoding is also possible
with any encoding supported by [TextDecoder](https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API/Encodings),
however encoding these is not supported.

```javascript
// fixed length, ascii encoding by default
var str = new r.String(2);
```

### Array

An `Array` maps to and from a JavaScript array containing instances of a sub-type. The length can be a constant,
taken from a previous field in the parent structure, encoded using a number type immediately
before the string, or computed by a function.

```javascript
// fixed length, containing numbers
var arr = new r.Array(r.uint16, 2);
```

### Struct

A `Struct` maps to and from JavaScript objects, containing keys of various previously discussed types. Sub structures,
arrays of structures, and pointers to other types (discussed below) are supported.

```javascript
var Person = new r.Struct({
  name: new r.String(r.uint8, 'utf8'),
  age: r.uint8
});
```

## License

MIT
