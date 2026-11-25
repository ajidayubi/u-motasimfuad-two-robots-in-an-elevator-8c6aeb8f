const fs = require("node:fs");
const path = require("node:path");

// Two Robots in an Elevator — make.fun bounty entry.
//
// The program prints one line of awkward small talk that one robot says
// to another while they ride an elevator together, and writes that same
// line to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt) for the
// judge. The line is fixed: no randomness, no network, no clock, no input,
// so every run produces byte-identical output.
//
// The line, in prose: the robot breaks the silence by announcing it ran
// a diagnostic on the silence itself, reports the verdict that both
// robots are avoiding eye contact neither of them has, and then falls
// back on the most forced small talk there is — the weather.

const LINE: string =
  "I ran a diagnostic on this silence. Verdict: we are both avoiding eye contact that neither of us has. Nice weather, by the way.";

// The sealed gate: /output/entry.txt must be UTF-8 text of 1 to 200
// characters, not only white space, exactly one line.
function validate(line: string): void {
  if (line.length < 1 || line.length > 200) {
    throw new Error(`line must be 1-200 characters, got ${line.length}`);
  }
  if (line.trim().length === 0) {
    throw new Error("line must not be only white space");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("line must be exactly one line");
  }
}

function main(): void {
  validate(LINE);
  // An empty MAKEFUN_OUTPUT_DIR counts as unset, so a stray empty
  // variable can never point the output at the working directory.
  const outDir: string = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  fs.mkdirSync(outDir, { recursive: true });
  const outPath: string = path.join(outDir, "entry.txt");
  fs.writeFileSync(outPath, LINE, "utf8");
  // Round-trip check: what was written must read back byte for byte.
  const back: string = fs.readFileSync(outPath, "utf8");
  if (back !== LINE) {
    throw new Error("entry.txt did not round-trip");
  }
  console.log(LINE);
}

main();
