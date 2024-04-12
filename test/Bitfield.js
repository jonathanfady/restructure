import assert from 'assert';
import { Bitfield, uint8, uint16le, Array, Struct, uint32be } from '../src/index.js';

describe('Bitfield', function () {
  const JACK = 1 << 7;
  const KACK = 1 << 6;
  const LACK = 1 << 5;
  const MACK = 1 << 4;
  const NACK = 1 << 3;
  const OACK = 1 << 2;
  const PACK = 1 << 1;
  const QUACK = 1 << 0;

  const RACK = 1 << 7;
  const SACK = 1 << 6;
  const TACK = 1 << 5;
  const UACK = 1 << 4;
  const VACK = 1 << 3;
  const WACK = 1 << 2;
  const XACK = 1 << 1;
  const YACK = 1 << 0;

  const ZACK = 1 << 7;

  describe('bitfield1', function () {
    const bitfield1 = new Struct({ bitfield1: Bitfield(uint8, ['Jack', 'Kack', 'Lack', 'Mack', 'Nack', 'Oack', 'Pack', 'Quack']) });

    it('should have the right size', () => assert.equal(bitfield1.size, 1));

    it('should decode', function () {
      assert.deepEqual(
        bitfield1.fromBuffer(new Uint8Array([JACK | MACK | PACK | NACK | QUACK])),
        new Map(Object.entries({
          Jack: true, Kack: false, Lack: false, Mack: true, Nack: true, Oack: false, Pack: true, Quack: true
        })),
      );
    });

    it('should encode', function () {
      assert.deepEqual(
        bitfield1.toBuffer(new Map(Object.entries({
          Jack: true, Kack: false, Lack: false, Mack: true, Nack: true, Oack: false, Pack: true, Quack: true
        }))),
        Buffer.from([JACK | MACK | PACK | NACK | QUACK]));
    });
  })

  describe('bitfield2', function () {
    const bitfield2 = new Struct({ bitfield2: Bitfield(Array(uint8, 2), ['Jack', 'Kack', 'Lack', 'Mack', 'Nack', 'Oack', 'Pack', 'Quack', 'Rack', 'Sack', 'Tack', 'Uack', 'Vack', 'Wack', 'Xack', 'Yack']) });

    it('should have the right size', () => assert.equal(bitfield2.size, 2));

    it('should decode', function () {
      assert.deepEqual(
        bitfield2.fromBuffer(new Uint8Array([JACK | MACK | NACK | PACK | QUACK, RACK | SACK | UACK | VACK | XACK])),
        new Map(Object.entries({
          Jack: true, Kack: false, Lack: false, Mack: true, Nack: true, Oack: false, Pack: true, Quack: true,
          Rack: true, Sack: true, Tack: false, Uack: true, Vack: true, Wack: false, Xack: true, Yack: false
        })),
      );
    });

    it('should encode', function () {
      assert.deepEqual(bitfield2.toBuffer(new Map(Object.entries({
        Jack: true, Kack: false, Lack: false, Mack: true, Nack: true, Oack: false, Pack: true, Quack: true,
        Rack: true, Sack: true, Tack: false, Uack: true, Vack: true, Wack: false, Xack: true, Yack: false
      }))), new Uint8Array([JACK | MACK | NACK | PACK | QUACK, RACK | SACK | UACK | VACK | XACK]));
    });
  })

  describe('bitfield3', function () {
    const bitfield3 = new Struct({ bitfield3: Bitfield(Array(uint16le, 2), ['Jack', 'Kack', 'Lack', 'Mack', 'Nack', 'Oack', 'Pack', 'Quack', 'Rack', 'Sack', 'Tack', 'Uack', 'Vack', 'Wack', 'Xack', 'Yack', 'Zack']) });

    it('should have the right size', () => assert.equal(bitfield3.size, 4));

    it('should decode', function () {
      assert.deepEqual(
        bitfield3.fromBuffer(new Uint8Array([JACK | MACK | NACK | PACK | QUACK, UACK, ZACK, 0])),
        new Map(Object.entries({
          Jack: true, Kack: false, Lack: false, Mack: true, Nack: true, Oack: false, Pack: true, Quack: true,
          Rack: false, Sack: false, Tack: false, Uack: true, Vack: false, Wack: false, Xack: false, Yack: false,
          Zack: true,
        })),
      );
    });

    it('should encode', function () {
      assert.deepEqual(bitfield3.toBuffer(new Map(Object.entries({
        Jack: true, Kack: false, Lack: false, Mack: true, Nack: true, Oack: false, Pack: true, Quack: true,
        Rack: false, Sack: false, Tack: false, Uack: true, Vack: false, Wack: false, Xack: false, Yack: false,
        Zack: true,
      }))), new Uint8Array([JACK | MACK | NACK | PACK | QUACK, UACK, ZACK, 0]));
    });
  })

  describe('bitfield4', function () {
    const bitfield4 = new Struct({ bitfield4: Bitfield(uint32be, ['Jack', 'Kack', 'Lack', 'Mack', 'Nack', 'Oack', 'Pack', 'Quack', 'Rack', 'Sack', 'Tack', 'Uack', 'Vack', 'Wack', 'Xack', 'Yack', 'Zack']) });

    it('should have the right size', () => assert.equal(bitfield4.size, 4));

    it('should decode', function () {
      assert.deepEqual(
        bitfield4.fromBuffer(new Uint8Array([JACK | MACK | NACK | PACK | QUACK, UACK, ZACK, 0])),
        new Map(Object.entries({
          Jack: true, Kack: false, Lack: false, Mack: true, Nack: true, Oack: false, Pack: true, Quack: true,
          Rack: false, Sack: false, Tack: false, Uack: true, Vack: false, Wack: false, Xack: false, Yack: false,
          Zack: true,
        })),
      );
    });

    it('should encode', function () {
      assert.deepEqual(bitfield4.toBuffer(new Map(Object.entries({
        Jack: true, Kack: false, Lack: false, Mack: true, Nack: true, Oack: false, Pack: true, Quack: true,
        Rack: false, Sack: false, Tack: false, Uack: true, Vack: false, Wack: false, Xack: false, Yack: false,
        Zack: true,
      }))), new Uint8Array([JACK | MACK | NACK | PACK | QUACK, UACK, ZACK, 0]));
    });
  })
});
