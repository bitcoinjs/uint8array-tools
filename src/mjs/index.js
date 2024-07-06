export function toHex(bytes) {
    return Buffer.from(bytes || []).toString("hex");
}
export function fromHex(hexString) {
    return Uint8Array.from(Buffer.from(hexString || "", "hex"));
}
// Same behavior as Buffer.compare()
export function compare(v1, v2) {
    const minLength = Math.min(v1.length, v2.length);
    for (let i = 0; i < minLength; ++i) {
        if (v1[i] !== v2[i]) {
            return v1[i] < v2[i] ? -1 : 1;
        }
    }
    return v1.length === v2.length ? 0 : v1.length > v2.length ? 1 : -1;
}
const DECODER = new TextDecoder();
export function toUtf8(bytes) {
    return DECODER.decode(bytes);
}
