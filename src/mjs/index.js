export function toUtf8(bytes) {
    return Buffer.from(bytes || []).toString();
}
export function toHex(bytes) {
    return Buffer.from(bytes || []).toString("hex");
}
export function fromHex(hexString) {
    return Uint8Array.from(Buffer.from(hexString || "", "hex"));
}
export function compare(v1, v2) {
    return Buffer.from(v1).compare(Buffer.from(v2));
}
export function writeUInt8(buffer, offset, value) {
    const buf = Buffer.from(buffer);
    buf.writeUInt8(Number(value), offset);
    buffer.set(Uint8Array.from(buf), offset);
}
export function writeUInt16(buffer, offset, value, littleEndian) {
    littleEndian = littleEndian.toUpperCase();
    const buf = Buffer.alloc(2);
    if (littleEndian === "LE") {
        buf.writeUInt16LE(Number(value), offset);
    }
    else {
        buf.writeUInt16BE(Number(value), offset);
    }
    buffer.set(Uint8Array.from(buf), offset);
}
export function writeUInt32(buffer, offset, value, littleEndian) {
    littleEndian = littleEndian.toUpperCase();
    const buf = Buffer.alloc(4);
    if (littleEndian === "LE") {
        buf.writeUInt32LE(Number(value), offset);
    }
    else {
        buf.writeUInt32BE(Number(value), offset);
    }
    buffer.set(Uint8Array.from(buf), offset);
}
export function writeUInt64(buffer, offset, value, littleEndian) {
    littleEndian = littleEndian.toUpperCase();
    const buf = Buffer.alloc(8);
    if (littleEndian === "LE") {
        buf.writeBigUInt64LE(value, offset);
    }
    else {
        buf.writeBigUInt64BE(value, offset);
    }
    buffer.set(Uint8Array.from(buf), offset);
}
