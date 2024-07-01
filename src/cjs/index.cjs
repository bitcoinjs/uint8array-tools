"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeUInt64 = exports.writeUInt32 = exports.writeUInt16 = exports.writeUInt8 = exports.compare = exports.fromHex = exports.toHex = exports.toUtf8 = void 0;
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
function compare(v1, v2) {
    return Buffer.from(v1).compare(Buffer.from(v2));
}
exports.compare = compare;
function writeUInt8(buffer, offset, value) {
    const buf = Buffer.alloc(1);
    buf.writeUInt8(Number(value), 0);
    buffer.set(Uint8Array.from(buf), offset);
}
exports.writeUInt8 = writeUInt8;
function writeUInt16(buffer, offset, value, littleEndian) {
    littleEndian = littleEndian.toUpperCase();
    const buf = Buffer.alloc(2);
    if (littleEndian === "LE") {
        buf.writeUInt16LE(Number(value), 0);
    }
    else {
        buf.writeUInt16BE(Number(value), 0);
    }
    buffer.set(Uint8Array.from(buf), offset);
}
exports.writeUInt16 = writeUInt16;
function writeUInt32(buffer, offset, value, littleEndian) {
    littleEndian = littleEndian.toUpperCase();
    const buf = Buffer.alloc(4);
    if (littleEndian === "LE") {
        buf.writeUInt32LE(Number(value), 0);
    }
    else {
        buf.writeUInt32BE(Number(value), 0);
    }
    buffer.set(Uint8Array.from(buf), offset);
}
exports.writeUInt32 = writeUInt32;
function writeUInt64(buffer, offset, value, littleEndian) {
    littleEndian = littleEndian.toUpperCase();
    const buf = Buffer.alloc(8);
    if (littleEndian === "LE") {
        buf.writeBigUInt64LE(value, 0);
    }
    else {
        buf.writeBigUInt64BE(value, 0);
    }
    buffer.set(Uint8Array.from(buf), offset);
}
exports.writeUInt64 = writeUInt64;
