import * as browser from "./browser";
import * as node from "./index";

const modules = [
  ["browser", browser],
  ["node", node],
] as [string, typeof browser][];

const f = (d: number[]) => Uint8Array.from(d);
const hex = "ff00";
const bytes = f([0xff, 0x00]);
const bytes2 = f([0xff, 0x01]);
const bytes2Larger = f([0xff, 0x01, 0x00]);
const bytes2LargerLeft = f([0x00, 0xff, 0x01]);
const longBytes = new Uint8Array(513).fill(0xfa);
const longHex = "fa".repeat(513);
const bytes3 = f([0x21, 0x7e]);
const utf8 = "!~";
const longBytes2 = new Uint8Array(513).fill(0x61);
const longUtf8 = "a".repeat(513);
const testBytes = f([
  227, 129, 147, 227, 130, 147, 227, 129, 171, 227, 129, 161, 227, 129, 175,
]);
const str = "こんにちは";

const brokenHexes = [
  [" ff00", f([]), "leading space"],
  ["ffa bcdef", f([0xff]), "middle space"],
  ["ffba34aQcdef", f([0xff, 0xba, 0x34]), "invalid char"],
  ["Qfba34abcdef", f([]), "invalid char"],
] as [string, Uint8Array, string][];

describe(`Uint8Array tools`, () => {
  for (const [name, tools] of modules) {
    describe(name, () => {
      it(`should parse hex with fromHex`, () => {
        expect(tools.fromHex(hex)).toEqual(bytes);
        expect((tools.fromHex as any)()).toEqual(f([]));
      });
      for (const [bhex, result, reason] of brokenHexes) {
        it(`should abort parsing hex ${bhex} because of ${reason}`, () => {
          expect(tools.fromHex(bhex)).toEqual(result);
        });
      }
      it(`should output hex with toHex`, () => {
        expect(tools.toHex(bytes)).toEqual(hex);
        expect(tools.toHex(longBytes)).toEqual(longHex);
        expect((tools.toHex as any)()).toEqual("");
      });
      it(`should output utf8 with toUtf8`, () => {
        expect(tools.toUtf8(bytes3)).toEqual(utf8);
        expect(tools.toUtf8(testBytes)).toEqual(str);
        expect(tools.toUtf8(longBytes2)).toEqual(longUtf8);
        expect((tools.toUtf8 as any)()).toEqual("");
      });
      it(`should compare Uint8Arrays`, () => {
        expect(tools.compare(bytes, bytes2)).toBe(-1);
        expect(tools.compare(bytes, bytes)).toBe(0);
        expect(tools.compare(bytes2, bytes)).toBe(1);
        expect(tools.compare(bytes2, bytes2Larger)).toBe(-1);
        expect(tools.compare(bytes2Larger, bytes2)).toBe(1);
        expect(tools.compare(bytes2, bytes2LargerLeft)).toBe(1);
        expect(tools.compare(bytes2LargerLeft, bytes2)).toBe(-1);
      });
    });

    it("should writeUint8", () => {
      const hexs = ["03", "fd"];

      for (const hex of hexs) {
        const actualArray = new Uint8Array(1);
        const expectedArray = Buffer.alloc(1);

        tools.writeUInt8(actualArray, 0, BigInt("0x" + hex));
        expectedArray.writeUInt8(Number.parseInt(hex, 16), 0);

        expect(expectedArray.toString("hex")).toEqual(tools.toHex(actualArray));
      }
    });

    it("should writeUint16", () => {
      const hexs = ["0300", "0003", "fdff", "fffd"];

      for (const hex of hexs) {
        const actualArray = new Uint8Array(2);
        const expectedArray = Buffer.alloc(2);

        for (const endian of ["BE", "LE"]) {
          tools.writeUInt16(
            actualArray,
            0,
            BigInt("0x" + hex),
            endian as browser.endian
          );
          expectedArray[
            ("writeUInt16" + endian) as "writeUInt16LE" | "writeUInt16BE"
          ](Number.parseInt(hex, 16), 0);

          expect(expectedArray.toString("hex")).toEqual(
            tools.toHex(actualArray)
          );
        }
      }
    });

    it("should writeUint32", () => {
      const hexs = ["03000000", "00000003", "fdffffff", "fffffffd"];

      for (const hex of hexs) {
        const actualArray = new Uint8Array(4);
        const expectedArray = Buffer.alloc(4);

        for (const endian of ["BE", "LE"]) {
          tools.writeUInt32(
            actualArray,
            0,
            BigInt("0x" + hex),
            endian as browser.endian
          );
          expectedArray[
            ("writeUInt32" + endian) as "writeUInt32LE" | "writeUInt32BE"
          ](Number.parseInt(hex, 16), 0);

          expect(expectedArray.toString("hex")).toEqual(
            tools.toHex(actualArray)
          );
        }
      }
    });

    it("should writeUint64", () => {
      const hexs = [
        "0300000000000000",
        "0000000000000003",
        "fdffffffffffffff",
        "fffffffffffffffd",
      ];

      for (const hex of hexs) {
        const actualArray = new Uint8Array(8);
        const expectedArray = Buffer.alloc(8);

        for (const endian of ["BE", "LE"]) {
          tools.writeUInt64(
            actualArray,
            0,
            BigInt("0x" + hex),
            endian as browser.endian
          );
          expectedArray[
            ("writeBigUInt64" + endian) as
              | "writeBigUInt64LE"
              | "writeBigUInt64BE"
          ](BigInt("0x" + hex), 0);

          expect(expectedArray.toString("hex")).toEqual(
            tools.toHex(actualArray)
          );
        }
      }
    });
  }
});
