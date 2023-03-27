import assert from 'assert';
import { Bitfield, Struct, String as StringT, uint8, uint16le, uint32le } from '@jonathanfady/restructure';

describe('Struct', function () {
  describe('decode', function () {
    // it('should decode into an object', function () {
    //   const struct = new Struct({
    //     name: new StringT(uint8),
    //     age: uint8
    //   });

    //   assert.deepEqual(struct.fromBuffer(Buffer.from('\x05devon\x15')), {
    //     name: 'devon',
    //     age: 21
    //   });
    // });

    // it('should support process hook', function () {
    //   const struct = new Struct({
    //     name: new StringT(uint8),
    //     age: uint8
    //   });

    //   struct.process = function () {
    //     return this.canDrink = this.age >= 21;
    //   };

    //   assert.deepEqual(struct.fromBuffer(Buffer.from('\x05devon\x20')), {
    //     name: 'devon',
    //     age: 32,
    //     canDrink: true
    //   });
    // });

    // it('should support function keys', function () {
    //   const struct = new Struct({
    //     name: new StringT(uint8),
    //     age: uint8,
    //     canDrink() { return this.age >= 21; }
    //   });

    //   assert.deepEqual(struct.fromBuffer(Buffer.from('\x05devon\x20')), {
    //     name: 'devon',
    //     age: 32,
    //     canDrink: true
    //   });
    // });

    it('should decode into an object', function () {
      const struct = new Struct({
        name: new StringT(6),
        age: uint8,
        true_age: uint8,
      });

      assert.deepEqual(struct.fromBuffer(Buffer.from('\x05devon\x15\x20')), {
        name: '\x05devon',
        age: 21,
        true_age: 32,
      });
    });

    it('should decode into an object (integers and bitfields)', function () {
      const struct = new Struct({
        age: uint8,
        height: uint16le,
        flags: new Bitfield(uint16le, ["one", "two", null, "three", null, null, null, "four", null, null, "five", "six"]),
        length: uint32le,
      });

      assert.deepEqual(struct.fromBuffer(Buffer.from([21, 0x52, 0x22, 0x85, 0x77, 0x05, 0x12, 0x88, 0x63])), {
        age: 21,
        height: 0x2252,
        "one": true, "two": false, "three": false, "four": true, "five": true, "six": false,
        length: 0x63881205
      });
    });
  });

  describe('size', function () {
    // it('should compute the correct size', function () {
    //   const struct = new Struct({
    //     name: new StringT(uint8),
    //     age: uint8
    //   });

    //   assert.equal(struct.size({ name: 'devon', age: 21 }), 7);
    // });

    // it('should compute the correct size with pointers', function() {
    //   const struct = new Struct({
    //     name: new StringT(uint8),
    //     age: uint8,
    //     ptr: new Pointer(uint8, new StringT(uint8))
    //   });

    //   const size = struct.size({
    //     name: 'devon',
    //     age: 21,
    //     ptr: 'hello'
    //   });

    //   assert.equal(size, 14);
    // });

    it('should get the correct size when no value is given', function () {
      const struct = new Struct({
        name: new StringT(4),
        age: uint8
      });

      assert.equal(struct.size, 5);
    });

    it('should get the correct size', function () {
      const struct = new Struct({
        name: new StringT(6),
        age: uint8,
        true_age: uint8,
      });

      assert.equal(struct.size, 8);
    });

    it('should get the correct size (integers and bitfields)', function () {
      const struct = new Struct({
        age: uint8,
        height: uint16le,
        flags: new Bitfield(uint16le, ["one", "two", null, "three", null, null, null, "four", null, null, "five", "six"]),
        length: uint32le,
      });

      assert.equal(struct.size, 9);
    });

    // it('should throw when getting non-fixed length size and no value is given', function () {
    //   const struct = new Struct({
    //     name: new StringT(uint8),
    //     age: uint8
    //   });

    //   assert.throws(() => struct.size(), /not a fixed size/i);
    // });
  });

  describe('encode', function () {
    // it('should encode objects to buffers', function () {
    //   const struct = new Struct({
    //     name: new StringT(uint8),
    //     age: uint8
    //   });

    //   const buf = struct.toBuffer({
    //     name: 'devon',
    //     age: 21
    //   });

    //   assert.deepEqual(buf, Buffer.from('\x05devon\x15'));
    // });

    // it('should support preEncode hook', function () {
    //   const struct = new Struct({
    //     nameLength: uint8,
    //     name: new StringT('nameLength'),
    //     age: uint8
    //   });

    //   struct.preEncode = function () {
    //     return this.nameLength = this.name.length;
    //   };

    //   const buf = struct.toBuffer({
    //     name: 'devon',
    //     age: 21
    //   });

    //   assert.deepEqual(buf, Buffer.from('\x05devon\x15'));
    // });

    // it('should encode pointer data after structure', function() {
    //   const struct = new Struct({
    //     name: new StringT(uint8),
    //     age: uint8,
    //     ptr: new Pointer(uint8, new StringT(uint8))
    //   });

    //   const buf = struct.toBuffer({
    //     name: 'devon',
    //     age: 21,
    //     ptr: 'hello'
    //   });

    //   assert.deepEqual(buf, Buffer.from('\x05devon\x15\x08\x05hello'));
    // });

    it('should encode objects to buffers', function () {
      const struct = new Struct({
        name: new StringT(6),
        age: uint8
      });

      const buf = struct.toBuffer({
        name: '\x05devon',
        age: 21
      });

      assert.deepEqual(buf, Buffer.from('\x05devon\x15'));
    });

    it('should encode objects to buffers (integers and bitfields)', function () {
      const struct = new Struct({
        age: uint8,
        height: uint16le,
        flags: new Bitfield(uint16le, ["one", "two", null, "three", null, null, null, "four", null, null, "five", "six"]),
        length: uint32le,
      });

      const buf = struct.toBuffer({
        age: 21,
        height: 0x2252,
        flags: { "one": true, "two": false, "three": false, "four": true, "five": true, "six": false },
        length: 0x63881205
      });

      assert.deepEqual(buf, Buffer.from([21, 0x52, 0x22, 0x81, 0x04, 0x05, 0x12, 0x88, 0x63]));
    });
  });
});

