import assert from 'assert';
import { Bitfield, Struct, String as StringT, uint8, uint16le, uint32le } from '@jonathanfady/restructure';

describe('Struct', function () {
  describe('decode', function () {
    it('should decode into an object', function () {
      const struct = new Struct({
        name: StringT(6),
        age: uint8,
        true_age: uint8,
      });

      assert.deepEqual(struct.fromBuffer(Buffer.from('\x05devon\x15\x20')), new Map(Object.entries({
        name: '\x05devon',
        age: 21,
        true_age: 32,
      })));
    });

    it('should decode into an object (integers and bitfields)', function () {
      const struct = new Struct({
        age: uint8,
        height: uint16le,
        flags: Bitfield(uint16le, ["one", "two", null, "three", null, null, null, "four", null, null, "five", "six"]),
        length: uint32le,
      });

      assert.deepEqual(struct.fromBuffer(Buffer.from([21, 0x52, 0x22, 0x85, 0x77, 0x05, 0x12, 0x88, 0x63])), new Map(Object.entries({
        age: 21,
        height: 0x2252,
        "one": true, "two": false, "three": false, "four": true, "five": true, "six": false,
        length: 0x63881205
      })));
    });
  });

  describe('size', function () {
    it('should get the correct size when no value is given', function () {
      const struct = new Struct({
        name: StringT(4),
        age: uint8
      });

      assert.equal(struct.size, 5);
    });

    it('should get the correct size', function () {
      const struct = new Struct({
        name: StringT(6),
        age: uint8,
        true_age: uint8,
      });

      assert.equal(struct.size, 8);
    });

    it('should get the correct size (integers and bitfields)', function () {
      const struct = new Struct({
        age: uint8,
        height: uint16le,
        flags: Bitfield(uint16le, ["one", "two", null, "three", null, null, null, "four", null, null, "five", "six"]),
        length: uint32le,
      });

      assert.equal(struct.size, 9);
    });
  });

  describe('encode', function () {
    it('should encode objects to buffers', function () {
      const struct = new Struct({
        name: StringT(6),
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
        flags: Bitfield(uint16le, ["one", "two", null, "three", null, null, null, "four", null, null, "five", "six"]),
        length: uint32le,
      });

      const buf = struct.toBuffer({
        age: 21,
        height: 0x2252,
        "one": true, "two": false, "three": false, "four": true, "five": true, "six": false,
        length: 0x63881205
      });

      assert.deepEqual(buf, Buffer.from([21, 0x52, 0x22, 0x81, 0x04, 0x05, 0x12, 0x88, 0x63]));
    });
  });
});

