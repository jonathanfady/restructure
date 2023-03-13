import assert from 'assert';
import { String as StringT, uint8, DecodeStream, EncodeStream } from '@jonathanfady/restructure';

describe('String', function () {
  describe('decode', function () {
    it('should decode fixed length', function () {
      const string = new StringT(7);
      globalThis.decode_stream = new DecodeStream(Buffer.from('testing'));
      assert.equal(string.decode(), 'testing');
    });

    // it('should decode length from parent key', function() {
    //   globalThis.decode_stream = new DecodeStream(Buffer.from('testing'));
    //   const string = new StringT('len');
    //   assert.equal(string.decode(stream, {len: 7}), 'testing');
    // });

    // it('should decode length as number before string', function() {
    //   const string = new StringT(uint8);
    //   assert.equal(string.fromBuffer(Buffer.from('\x07testing')), 'testing');
    // });

    it('should decode utf8', function () {
      const string = new StringT(4, 'utf8');
      globalThis.decode_stream = new DecodeStream(Buffer.from('🍻'));
      assert.equal(string.decode(), '🍻');
    });

    // it('should decode encoding computed from function', function() {
    //   const string = new StringT(4, function() { return 'utf8'; });
    //   assert.equal(string.fromBuffer(Buffer.from('🍻')), '🍻');
    // });

    // it('should decode null-terminated string and read past terminator', function() {
    //   globalThis.decode_stream = new DecodeStream(Buffer.from('🍻\x00'));
    //   const string = new StringT(null, 'utf8');
    //   assert.equal(string.decode(), '🍻');
    //   assert.equal(stream.pos, 5);
    // });

    // it('should decode remainder of buffer when null-byte missing', function() {
    //   const string = new StringT(null, 'utf8');
    //   assert.equal(string.fromBuffer(Buffer.from('🍻')), '🍻');
    // });
  });

  describe('size', function () {
    // it('should use string length', function() {
    //   const string = new StringT(7);
    //   assert.equal(string.size('testing'), 7);
    // });

    // it('should use correct encoding', function() {
    //   const string = new StringT(10, 'utf8');
    //   assert.equal(string.size('🍻'), 4);
    // });

    // it('should use encoding from function', function() {
    //   const string = new StringT(10, function() { return 'utf8'; });
    //   assert.equal(string.size('🍻'), 4);
    // });

    // it('should add size of length field before string', function() {
    //   const string = new StringT(uint8, 'utf8');
    //   assert.equal(string.size('🍻'), 5);
    // });

    // it('should work with utf16be encoding', function() {
    //   const string = new StringT(10, 'utf16be');
    //   assert.equal(string.size('🍻'), 4);
    // });

    // it('should take null-byte into account', function() {
    //   const string = new StringT(null, 'utf8');
    //   assert.equal(string.size('🍻'), 5);
    // });

    it('should use defined length if no value given', function () {
      const array = new StringT(10);
      assert.equal(array.size, 10);
    });
  });

  describe('encode', function () {
    it('should encode using string length', function () {
      const string = new StringT(7);
      const buffer = new Uint8Array(string.size);
      globalThis.encode_stream = new EncodeStream(buffer);
      string.encode('testing');
      assert.deepEqual(buffer, Buffer.from('testing'));
    });

    // it('should encode length as number before string', function () {
    //   const string = new StringT(uint8);
    //   assert.deepEqual(string.toBuffer('testing'), Buffer.from('\x07testing'));
    // });

    // it('should encode length as number before string utf8', function () {
    //   const string = new StringT(uint8, 'utf8');
    //   assert.deepEqual(string.toBuffer('testing 😜'), Buffer.from('\x0ctesting 😜', 'utf8'));
    // });

    it('should encode utf8', function () {
      const string = new StringT(4, 'utf8');
      const buffer = new Uint8Array(string.size);
      globalThis.encode_stream = new EncodeStream(buffer);
      string.encode('🍻');
      assert.deepEqual(buffer, Buffer.from('🍻'));
    });

    // it('should encode encoding computed from function', function () {
    //   const string = new StringT(4, function () { return 'utf8'; });
    //   assert.deepEqual(string.toBuffer('🍻'), Buffer.from('🍻'));
    // });

    // it('should encode null-terminated string', function () {
    //   const string = new StringT(null, 'utf8');
    //   assert.deepEqual(string.toBuffer('🍻'), Buffer.from('🍻\x00'));
    // });
  });
});
