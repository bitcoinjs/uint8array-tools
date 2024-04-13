export function toUtf8(bytes) {
    return Buffer.from(bytes || []).toString();
}
export function toHex(bytes) {
    return Buffer.from(bytes || []).toString("hex");
}
export function fromHex(hexString) {
    return Uint8Array.from(Buffer.from(hexString || "", "hex"));
}
export function fromUtf8(utf8String) {
    return Uint8Array.from(Buffer.from(utf8String || ""));
}
export function compare(v1, v2) {
    return Buffer.from(v1).compare(Buffer.from(v2));
}
