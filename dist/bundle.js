/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ var __webpack_modules__ = ({

/***/ "./src/mjs/browser.js":
/*!****************************!*\
  !*** ./src/mjs/browser.js ***!
  \****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"toHex\": () => (/* binding */ toHex),\n/* harmony export */   \"fromHex\": () => (/* binding */ fromHex),\n/* harmony export */   \"compare\": () => (/* binding */ compare)\n/* harmony export */ });\nconst HEX_STRINGS = \"0123456789abcdefABCDEF\";\nconst HEX_CODES = HEX_STRINGS.split(\"\").map((c) => c.codePointAt(0));\nconst HEX_CODEPOINTS = Array(256)\n    .fill(true)\n    .map((_, i) => {\n    const s = String.fromCodePoint(i);\n    const index = HEX_STRINGS.indexOf(s);\n    // ABCDEF will use 10 - 15\n    return index < 0 ? undefined : index < 16 ? index : index - 6;\n});\nconst ENCODER = new TextEncoder();\nconst DECODER = new TextDecoder(\"ascii\");\n// There are two implementations.\n// One optimizes for length of the bytes, and uses TextDecoder.\n// One optimizes for iteration count, and appends strings.\n// This removes the overhead of TextDecoder.\nfunction toHex(bytes) {\n    const b = bytes || new Uint8Array();\n    return b.length > 512 ? _toHexLengthPerf(b) : _toHexIterPerf(b);\n}\nfunction _toHexIterPerf(bytes) {\n    let s = \"\";\n    for (let i = 0; i < bytes.length; ++i) {\n        s += HEX_STRINGS[HEX_CODEPOINTS[HEX_CODES[bytes[i] >> 4]]];\n        s += HEX_STRINGS[HEX_CODEPOINTS[HEX_CODES[bytes[i] & 15]]];\n    }\n    return s;\n}\nfunction _toHexLengthPerf(bytes) {\n    const hexBytes = new Uint8Array(bytes.length * 2);\n    for (let i = 0; i < bytes.length; ++i) {\n        hexBytes[i * 2] = HEX_CODES[bytes[i] >> 4];\n        hexBytes[i * 2 + 1] = HEX_CODES[bytes[i] & 15];\n    }\n    return DECODER.decode(hexBytes);\n}\n// Mimics Buffer.from(x, 'hex') logic\n// Stops on first non-hex string and returns\n// https://github.com/nodejs/node/blob/v14.18.1/src/string_bytes.cc#L246-L261\nfunction fromHex(hexString) {\n    const hexBytes = ENCODER.encode(hexString || \"\");\n    const resultBytes = new Uint8Array(Math.floor(hexBytes.length / 2));\n    let i;\n    for (i = 0; i < resultBytes.length; i++) {\n        const a = HEX_CODEPOINTS[hexBytes[i * 2]];\n        const b = HEX_CODEPOINTS[hexBytes[i * 2 + 1]];\n        if (a === undefined || b === undefined) {\n            break;\n        }\n        resultBytes[i] = (a << 4) | b;\n    }\n    return i === resultBytes.length ? resultBytes : resultBytes.slice(0, i);\n}\n// Same behavior as Buffer.compare()\nfunction compare(v1, v2) {\n    const minLength = Math.min(v1.length, v2.length);\n    for (let i = 0; i < minLength; ++i) {\n        if (v1[i] !== v2[i]) {\n            return v1[i] < v2[i] ? -1 : 1;\n        }\n    }\n    return v1.length === v2.length ? 0 : v1.length > v2.length ? 1 : -1;\n}\n\n\n//# sourceURL=webpack://uint8array-tools/./src/mjs/browser.js?");

/***/ })

/******/ });
/************************************************************************/
/******/ // The require scope
/******/ var __webpack_require__ = {};
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module can't be inlined because the eval devtool is used.
/******/ var __webpack_exports__ = {};
/******/ __webpack_modules__["./src/mjs/browser.js"](0, __webpack_exports__, __webpack_require__);
/******/ var __webpack_exports__compare = __webpack_exports__.compare;
/******/ var __webpack_exports__fromHex = __webpack_exports__.fromHex;
/******/ var __webpack_exports__toHex = __webpack_exports__.toHex;
/******/ export { __webpack_exports__compare as compare, __webpack_exports__fromHex as fromHex, __webpack_exports__toHex as toHex };
/******/ 
