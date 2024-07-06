import { Suite } from "bench-node";
import * as nodeTools from "../src/mjs/index.js";
import * as browserTools from "../src/mjs/browser.js";

const DUMMY_BUFFER = Uint8Array.from([
  0xde, 0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef, 0xde,
  0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef, 0xde, 0xad,
  0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe,
  0xef, 0xde, 0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef,
  0xde, 0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef, 0xde,
  0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef, 0xde, 0xad, 0xbe, 0xef, 0xde, 0xad,
  0xbe, 0xef,
]);
const DUMMY_HEX =
  "deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef";

// Note: only include benchmarks for functions with differing implementations for Node and Browser
const BENCHMARKS = [
  [
    `fromHex`,
    (library) => () => {
      library.fromHex(DUMMY_HEX);
    },
  ],
  [
    `toHex`,
    (library) => () => {
      library.toHex(DUMMY_BUFFER);
    },
  ],
];

const LIBRARIES = [
  ["Node   ", nodeTools],
  ["Browser", browserTools],
];

function setUpSuite(suite, platform, library, funcName, func) {
  suite.add(`${platform} ${funcName}`, func(library));
}

async function main() {
  const suite = new Suite();
  for (const [funcName, func] of BENCHMARKS) {
    for (const [name, library] of LIBRARIES) {
      setUpSuite(suite, name, library, funcName, func);
    }
  }
  const results = await suite.run();

  const nodeSlower = [];

  for (let i = 0; i < results.length; i += 2) {
    const nodeResult = results[i];
    const browserResult = results[i + 1];
    if (nodeResult.opsSec < browserResult.opsSec) {
      nodeSlower.push(BENCHMARKS[i / 2][0]);
    }
  }
  if (nodeSlower.length > 0) {
    throw new Error(
      `\n*** Node was slower in the following:\n    *** ${nodeSlower.join(
        "\n    *** "
      )}`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
