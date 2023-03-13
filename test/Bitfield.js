import assert from 'assert';
import { Bitfield, uint8, uint16le, Array as ArrayT, DecodeStream, EncodeStream } from '@jonathanfady/restructure';

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
    const bitfield1 = new Bitfield(uint8, ['Jack', 'Kack', 'Lack', 'Mack', 'Nack', 'Oack', 'Pack', 'Quack']);
    it('should have the right size', () => assert.equal(bitfield1.size, 1));

    it('should decode', function () {
      global.decode_stream = new DecodeStream(new Uint8Array([JACK | MACK | PACK | NACK | QUACK]));
      assert.deepEqual(
        bitfield1.decode(),
        { Jack: true, Kack: false, Lack: false, Mack: true, Nack: true, Oack: false, Pack: true, Quack: true }
      );
    });

    it('should encode', function () {
      const buffer = new Uint8Array(bitfield1.size);
      global.encode_stream = new EncodeStream(buffer);
      bitfield1.encode({ Jack: true, Kack: false, Lack: false, Mack: true, Nack: true, Oack: false, Pack: true, Quack: true });
      assert.deepEqual(buffer, Buffer.from([JACK | MACK | PACK | NACK | QUACK]));
    });
  })

  describe('bitfield2', function () {
    const bitfield2 = new Bitfield(new ArrayT(uint8, 2), ['Jack', 'Kack', 'Lack', 'Mack', 'Nack', 'Oack', 'Pack', 'Quack', 'Rack', 'Sack', 'Tack', 'Uack', 'Vack', 'Wack', 'Xack', 'Yack']);

    it('should have the right size', () => assert.equal(bitfield2.size, 2));

    it('should decode', function () {
      global.decode_stream = new DecodeStream(new Uint8Array([JACK | MACK | NACK | PACK | QUACK, RACK | SACK | UACK | VACK | XACK]));
      assert.deepEqual(
        bitfield2.decode(),
        {
          Jack: true, Kack: false, Lack: false, Mack: true, Nack: true, Oack: false, Pack: true, Quack: true,
          Rack: true, Sack: true, Tack: false, Uack: true, Vack: true, Wack: false, Xack: true, Yack: false
        }
      );
    });

    it('should encode', function () {
      const buffer = new Uint8Array(bitfield2.size);
      global.encode_stream = new EncodeStream(buffer);
      bitfield2.encode({
        Jack: true, Kack: false, Lack: false, Mack: true, Nack: true, Oack: false, Pack: true, Quack: true,
        Rack: true, Sack: true, Tack: false, Uack: true, Vack: true, Wack: false, Xack: true, Yack: false
      });
      assert.deepEqual(buffer, new Uint8Array([JACK | MACK | NACK | PACK | QUACK, RACK | SACK | UACK | VACK | XACK]));
    });
  })

  describe('bitfield3', function () {
    const bitfield3 = new Bitfield(new ArrayT(uint16le, 2), ['Jack', 'Kack', 'Lack', 'Mack', 'Nack', 'Oack', 'Pack', 'Quack', 'Rack', 'Sack', 'Tack', 'Uack', 'Vack', 'Wack', 'Xack', 'Yack', 'Zack']);

    it('should have the right size', () => assert.equal(bitfield3.size, 4));

    it('should decode', function () {
      global.decode_stream = new DecodeStream(new Uint16Array([JACK | MACK | NACK | PACK | QUACK | (UACK << 8), ZACK]));
      assert.deepEqual(
        bitfield3.decode(),
        {
          Jack: true, Kack: false, Lack: false, Mack: true, Nack: true, Oack: false, Pack: true, Quack: true,
          Rack: false, Sack: false, Tack: false, Uack: true, Vack: false, Wack: false, Xack: false, Yack: false,
          Zack: true
        }
      );
    });

    it('should encode', function () {
      const buffer = new Uint8Array(bitfield3.size);
      global.encode_stream = new EncodeStream(buffer);
      bitfield3.encode({
        Jack: true, Kack: false, Lack: false, Mack: true, Nack: true, Oack: false, Pack: true, Quack: true,
        Rack: false, Sack: false, Tack: false, Uack: true, Vack: false, Wack: false, Xack: false, Yack: false,
        Zack: true
      });
      assert.deepEqual(buffer, new Uint8Array([JACK | MACK | NACK | PACK | QUACK, UACK, ZACK, 0]));
    });
  })
});
