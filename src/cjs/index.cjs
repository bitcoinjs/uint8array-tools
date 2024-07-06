"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUtf8 = exports.compare = exports.fromHex = exports.toHex = void 0;
function toHex(bytes) {
    return Buffer.from(bytes || []).toString("hex");
}
exports.toHex = toHex;
function fromHex(hexString) {
    return Uint8Array.from(Buffer.from(hexString || "", "hex"));
}
exports.fromHex = fromHex;
// Same behavior as Buffer.compare()
function compare(v1, v2) {
    const minLength = Math.min(v1.length, v2.length);
    for (let i = 0; i < minLength; ++i) {
        if (v1[i] !== v2[i]) {
            return v1[i] < v2[i] ? -1 : 1;
        }
    }
    return v1.length === v2.length ? 0 : v1.length > v2.length ? 1 : -1;
}
exports.compare = compare;
const DECODER = new TextDecoder();
function toUtf8(bytes) {
    return DECODER.decode(bytes);
}
exports.toUtf8 = toUtf8;
