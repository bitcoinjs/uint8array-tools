"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = exports.fromUtf8 = exports.fromHex = exports.toHex = exports.toUtf8 = void 0;
function toUtf8(bytes) {
    return Buffer.from(bytes || []).toString();
}
exports.toUtf8 = toUtf8;
function toHex(bytes) {
    return Buffer.from(bytes || []).toString("hex");
}
exports.toHex = toHex;
function fromHex(hexString) {
    return Uint8Array.from(Buffer.from(hexString || "", "hex"));
}
exports.fromHex = fromHex;
function fromUtf8(utf8String) {
    return Uint8Array.from(Buffer.from(utf8String || ""));
}
exports.fromUtf8 = fromUtf8;
function compare(v1, v2) {
    return Buffer.from(v1).compare(Buffer.from(v2));
}
exports.compare = compare;
