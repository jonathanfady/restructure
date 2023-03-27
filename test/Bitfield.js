import assert from 'assert';
import { Bitfield, uint8, uint16le, Array as ArrayT, Struct } from '@jonathanfady/restructure';

describe('Bitfield', function () {
  const JACK = 1 << 0;
  const KACK = 1 << 1;
  const LACK = 1 << 2;
  const MACK = 1 << 3;
  const NACK = 1 << 4;
  const OACK = 1 << 5;
  const PACK = 1 << 6;
  const QUACK = 1 << 7;

  const RACK = 1 << 0;
  const SACK = 1 << 1;
  const TACK = 1 << 2;
  const UACK = 1 << 3;
  const VACK = 1 << 4;
  const WACK = 1 << 5;
  const XACK = 1 << 6;
  const YACK = 1 << 7;

  const ZACK = 1 << 0;
  describe('bitfield1', function () {
    const bitfield1 = new Struct({ bitfield1: new Bitfield(uint8, ['Jack', 'Kack', 'Lack', 'Mack', 'Nack', 'Oack', 'Pack', 'Quack']) });

    it('should have the right size', () => assert.equal(bitfield1.size, 1));

    it('should decode', function () {
      assert.deepEqual(
        bitfield1.fromBuffer(new Uint8Array([JACK | MACK | PACK | NACK | QUACK])),
        { Jack: true, Kack: false, Lack: false, Mack: true, Nack: true, Oack: false, Pack: true, Quack: true }
      );
    });

    it('should encode', function () {
      assert.deepEqual(
        bitfield1.toBuffer({ bitfield1: { Jack: true, Kack: false, Lack: false, Mack: true, Nack: true, Oack: false, Pack: true, Quack: true } }),
        Buffer.from([JACK | MACK | PACK | NACK | QUACK]));
    });
  })

  describe('bitfield2', function () {
    const bitfield2 = new Struct({ bitfield2: new Bitfield(new ArrayT(uint8, 2), ['Jack', 'Kack', 'Lack', 'Mack', 'Nack', 'Oack', 'Pack', 'Quack', 'Rack', 'Sack', 'Tack', 'Uack', 'Vack', 'Wack', 'Xack', 'Yack']) });

    it('should have the right size', () => assert.equal(bitfield2.size, 2));

    it('should decode', function () {
      assert.deepEqual(
        bitfield2.fromBuffer(new Uint8Array([JACK | MACK | NACK | PACK | QUACK, RACK | SACK | UACK | VACK | XACK])),
        {
          Jack: true, Kack: false, Lack: false, Mack: true, Nack: true, Oack: false, Pack: true, Quack: true,
          Rack: true, Sack: true, Tack: false, Uack: true, Vack: true, Wack: false, Xack: true, Yack: false
        }
      );
    });

    it('should encode', function () {
      assert.deepEqual(bitfield2.toBuffer({
        bitfield2:
        {
          Jack: true, Kack: false, Lack: false, Mack: true, Nack: true, Oack: false, Pack: true, Quack: true,
          Rack: true, Sack: true, Tack: false, Uack: true, Vack: true, Wack: false, Xack: true, Yack: false
        }
      }), new Uint8Array([JACK | MACK | NACK | PACK | QUACK, RACK | SACK | UACK | VACK | XACK]));
    });
  })

  describe('bitfield3', function () {
    const bitfield3 = new Struct({ bitfield3: new Bitfield(new ArrayT(uint16le, 2), ['Jack', 'Kack', 'Lack', 'Mack', 'Nack', 'Oack', 'Pack', 'Quack', 'Rack', 'Sack', 'Tack', 'Uack', 'Vack', 'Wack', 'Xack', 'Yack', 'Zack']) });

    it('should have the right size', () => assert.equal(bitfield3.size, 4));

    it('should decode', function () {
      assert.deepEqual(
        bitfield3.fromBuffer(new Uint16Array([JACK | MACK | NACK | PACK | QUACK | (UACK << 8), ZACK])),
        {
          Jack: true, Kack: false, Lack: false, Mack: true, Nack: true, Oack: false, Pack: true, Quack: true,
          Rack: false, Sack: false, Tack: false, Uack: true, Vack: false, Wack: false, Xack: false, Yack: false,
          Zack: true
        }
      );
    });

    it('should encode', function () {
      assert.deepEqual(bitfield3.toBuffer({
        bitfield3: {
          Jack: true, Kack: false, Lack: false, Mack: true, Nack: true, Oack: false, Pack: true, Quack: true,
          Rack: false, Sack: false, Tack: false, Uack: true, Vack: false, Wack: false, Xack: false, Yack: false,
          Zack: true
        }
      }), new Uint8Array([JACK | MACK | NACK | PACK | QUACK, UACK, ZACK, 0]));
    });
  })
});
