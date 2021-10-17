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
  }
});
