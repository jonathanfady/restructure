# Restructure

[![Coverage Status](https://coveralls.io/repos/github/jonathanfady/restructure/badge.svg?branch=master)](https://coveralls.io/github/jonathanfady/restructure?branch=master)

Restructure allows you to declaratively encode and decode binary data.
It supports a wide variety of types to enable you to express a multitude
of binary formats without writing any parsing code.

Some of the supported features are C-like structures, arrays of numbers, strings, and bitfields.
See the documentation below for more details.

## Example

This is just a small example of what Restructure can do. Check out the API documentation
below for more information.

```javascript
import * as r from 'restructure';

let Person = new r.Struct({
  name: new r.String(r.uint8),
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

You need to define a Struct containing Arrays, Numbers, Strings or Bitfields and you can then call the following methods :

* `fromBuffer(buffer)` - decodes an instance of the type from the given Uint8Array
* `size(value)` - returns the amount of space the value would take if encoded
* `toBuffer(value)` - encodes the given value into a Uint8Array

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
When you define a bitfield in a Struct, the key provided will be ignored and the results Object will contain the flags as keys directly on the results Object.

```javascript
var buffer = new Uint8Array([0xD9 , 0x5B])

var bitfield1 = new r.Bitfield(r.uint8, ['Jack', 'Kack', 'Lack', 'Mack', 'Nack', 'Oack', 'Pack', 'Quack']);
var struct1 = new Struct({bitfield: bitfield1});

// struct1.fromBuffer(buffer)
var result1 = {
  Jack: true, Kack: false, Lack: false, Mack: true, Nack: true, Oack: false, Pack: true, Quack: true
};

var bitfield2 = new r.Bitfield(new Array(r.uint8, 2), ['Jack', 'Kack', 'Lack', 'Mack', 'Nack', 'Oack', 'Pack', 'Quack',
'Rack', 'Sack', 'Tack', 'Uack', 'Vack', 'Wack', 'Xack', 'Yack']);
var struct2 = new Struct({whateverKey: bitfield2});

// struct2.fromBuffer(buffer)
var result2 = {
  Jack: true, Kack: false, Lack: false, Mack: true, Nack: true, Oack: false, Pack: true, Quack: true,
  Rack: true, Sack: true, Tack: false, Uack: true, Vack: true, Wack: false, Xack: true, Yack: false
};

```

### String

A `String` maps a JavaScript string to and from binary encodings. The length can be a constant, taken
from a previous field in the parent structure, or encoded using a number type immediately before the string.

The encoding is `'utf8'`.

```javascript
// fixed length
var str = new r.String(2);
```

### Array

An `Array` maps to and from a JavaScript array containing instances of a sub-type, of a given length.

```javascript
// fixed length, containing numbers
var arr = new r.Array(r.uint16, 2);
```

### Struct

A `Struct` maps to and from JavaScript objects, containing keys of various previously discussed types.

```javascript
var Person = new r.Struct({
  name: new r.String(r.uint8),
  age: r.uint8
});
```

## License

MIT
