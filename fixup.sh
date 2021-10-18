#!/usr/bin/env bash
cat >src/cjs/package.json <<!EOF
{
    "type": "commonjs",
    "main": "index.js",
    "browser": "browser.js"
}
!EOF

cat >src/mjs/package.json <<!EOF
{
    "type": "module",
    "main": "index.js",
    "browser": "browser.js"
}
!EOF
