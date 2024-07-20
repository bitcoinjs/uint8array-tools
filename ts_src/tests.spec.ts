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
      it("should writeUint8", () => {
        const hexs = ["03", "fd"];

        for (const hex of hexs) {
          const actualArray = new Uint8Array(1);
          const expectedArray = Buffer.alloc(1);

          tools.writeUInt8(actualArray, 0, Number.parseInt(hex, 16));
          expectedArray.writeUInt8(Number.parseInt(hex, 16), 0);

          expect(expectedArray.toString("hex")).toEqual(
            tools.toHex(actualArray)
          );
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
              Number.parseInt(hex, 16),
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
              Number.parseInt(hex, 16),
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

      it("should throw an error when offset is out of bounds", () => {
        const bytes = new Uint8Array(100);

        expect(() =>
          tools.writeUInt8(bytes, bytes.length - 1 + 1, 1)
        ).toThrowError(new Error("Offset is outside the bounds of Uint8Array"));

        expect(() =>
          tools.writeUInt16(bytes, bytes.length - 2 + 1, 1, "LE")
        ).toThrowError(new Error("Offset is outside the bounds of Uint8Array"));

        expect(() =>
          tools.writeUInt32(bytes, bytes.length - 4 + 1, 1, "LE")
        ).toThrowError(new Error("Offset is outside the bounds of Uint8Array"));

        expect(() =>
          tools.writeUInt64(bytes, bytes.length - 8 + 1, 1n, "LE")
        ).toThrowError(new Error("Offset is outside the bounds of Uint8Array"));
      });

      it("should write at the correct offset", () => {
        const actualArray = new Uint8Array(100);
        const expectedArray = Buffer.alloc(100);
        let hex = "03";
        const offset = 50;

        tools.writeUInt8(actualArray, offset, Number.parseInt(hex, 16));
        expectedArray.writeUInt8(Number.parseInt(hex, 16), offset);

        expect(expectedArray.toString("hex")).toEqual(tools.toHex(actualArray));

        hex = "0300";

        tools.writeUInt16(actualArray, offset, Number.parseInt(hex, 16), "LE");
        expectedArray.writeUInt16LE(Number.parseInt(hex, 16), offset);

        expect(expectedArray.toString("hex")).toEqual(tools.toHex(actualArray));

        tools.writeUInt16(actualArray, offset, Number.parseInt(hex, 16), "BE");
        expectedArray.writeUInt16BE(Number.parseInt(hex, 16), offset);

        expect(expectedArray.toString("hex")).toEqual(tools.toHex(actualArray));

        hex = "03000000";

        tools.writeUInt32(actualArray, offset, Number.parseInt(hex, 16), "LE");
        expectedArray.writeUInt32LE(Number.parseInt(hex, 16), offset);

        expect(expectedArray.toString("hex")).toEqual(tools.toHex(actualArray));

        tools.writeUInt32(actualArray, offset, Number.parseInt(hex, 16), "BE");
        expectedArray.writeUInt32BE(Number.parseInt(hex, 16), offset);

        expect(expectedArray.toString("hex")).toEqual(tools.toHex(actualArray));

        hex = "0300000000000000";

        tools.writeUInt64(actualArray, offset, BigInt("0x" + hex), "LE");
        expectedArray.writeBigUInt64LE(BigInt("0x" + hex), offset);

        expect(expectedArray.toString("hex")).toEqual(tools.toHex(actualArray));

        tools.writeUInt64(actualArray, offset, BigInt("0x" + hex), "BE");
        expectedArray.writeBigUInt64BE(BigInt("0x" + hex), offset);

        expect(expectedArray.toString("hex")).toEqual(tools.toHex(actualArray));
      });
      it("should throw an error on overflow", () => {
        let bytes = new Uint8Array(1);

        let overflowVal = 0xffn + 1n;
        expect(() => tools.writeUInt8(bytes, 0, 0xff + 1)).toThrowError(
          `The value of "value" is out of range. It must be >= 0 and <= ${0xffn}. Received ${overflowVal}`
        );

        bytes = new Uint8Array(2);
        overflowVal = 0xffffn + 1n;

        expect(() =>
          tools.writeUInt16(bytes, 0, 0xffff + 1, "LE")
        ).toThrowError(
          `The value of "value" is out of range. It must be >= 0 and <= ${0xffffn}. Received ${overflowVal}`
        );

        bytes = new Uint8Array(4);
        overflowVal = 0xffffffffn + 1n;

        expect(() =>
          tools.writeUInt32(bytes, 0, 0xffffffff + 1, "LE")
        ).toThrowError(
          `The value of "value" is out of range. It must be >= 0 and <= ${0xffffffffn}. Received ${overflowVal}`
        );

        bytes = new Uint8Array(8);
        overflowVal = 0xffffffffffffffffn + 1n;

        expect(() =>
          tools.writeUInt64(bytes, 0, 0xffffffffffffffffn + 1n, "LE")
        ).toThrowError(
          `The value of "value" is out of range. It must be >= 0 and <= ${0xffffffffffffffffn.toString()}. Received ${overflowVal}`
        );
      });

      it("should read bytes at the correct offset", () => {
        const actualArray = new Uint8Array(200);
        const expectedArray = Buffer.alloc(200);

        let hex = "ff";
        tools.writeUInt8(actualArray, 0, Number.parseInt(hex, 16));
        expectedArray.writeUInt8(Number.parseInt(hex, 16), 0);

        expect(expectedArray.readUInt8(0)).toEqual(
          tools.readUInt8(actualArray, 0)
        );

        hex = "abcd";
        tools.writeUInt16(actualArray, 10, Number.parseInt(hex, 16), "LE");
        expectedArray.writeUInt16LE(Number.parseInt(hex, 16), 10);

        expect(expectedArray.readUInt16LE(10)).toEqual(
          tools.readUInt16(actualArray, 10, "LE")
        );

        tools.writeUInt16(actualArray, 20, Number.parseInt(hex, 16), "BE");
        expectedArray.writeUInt16BE(Number.parseInt(hex, 16), 20);

        expect(expectedArray.readUInt16BE(20)).toEqual(
          tools.readUInt16(actualArray, 20, "BE")
        );

        hex = "ffffabff";
        tools.writeUInt32(actualArray, 30, Number.parseInt(hex, 16), "LE");
        expectedArray.writeUInt32LE(Number.parseInt(hex, 16), 30);

        expect(expectedArray.readUInt32LE(30)).toEqual(
          tools.readUInt32(actualArray, 30, "LE")
        );

        tools.writeUInt32(actualArray, 50, Number.parseInt(hex, 16), "BE");
        expectedArray.writeUInt32BE(Number.parseInt(hex, 16), 50);

        expect(expectedArray.readUInt32BE(50)).toEqual(
          tools.readUInt32(actualArray, 50, "BE")
        );

        hex = "ffffffffffffabff";
        tools.writeUInt64(actualArray, 70, BigInt("0x" + hex), "LE");
        expectedArray.writeBigUInt64LE(BigInt("0x" + hex), 70);

        expect(expectedArray.readBigUInt64LE(70)).toEqual(
          tools.readUInt64(actualArray, 70, "LE")
        );

        tools.writeUInt64(actualArray, 110, BigInt("0x" + hex), "BE");
        expectedArray.writeBigUInt64BE(BigInt("0x" + hex), 110);

        expect(expectedArray.readBigUInt64BE(110)).toEqual(
          tools.readUInt64(actualArray, 110, "BE")
        );
      });

      it("should throw an error if the offset is out of bounds", () => {
        const arr = new Uint8Array(10);

        expect(() => tools.readUInt8(arr, 10)).toThrowError(
          new Error("Offset is outside the bounds of Uint8Array")
        );

        const fns = [tools.readUInt16, tools.readUInt32, tools.readUInt64];

        for (const fn of fns) {
          expect(() => fn(arr, 10, "LE")).toThrowError(
            new Error("Offset is outside the bounds of Uint8Array")
          );

          expect(() => fn(arr, 10, "BE")).toThrowError(
            new Error("Offset is outside the bounds of Uint8Array")
          );
        }
      });
    });
  }
});
