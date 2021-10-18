#!/usr/bin/env bash
cat >src/cjs/package.json <<!EOF
{
    "type": "commonjs"
}
!EOF

cat >src/mjs/package.json <<!EOF
{
    "type": "module"
}
!EOF
