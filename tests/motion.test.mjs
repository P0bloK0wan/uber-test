import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const manifest = JSON.parse(
  readFileSync(new URL("../dist/assets/motion/manifest.json", import.meta.url)),
);
test("recovered animation bytes, frame rates and timelines match the provenance manifest", () => {
  assert.ok(manifest.length >= 6);
  for (const entry of manifest) {
    const bytes = readFileSync(
      new URL(`../dist/${entry.path}`, import.meta.url),
    );
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      entry.sha256,
      entry.name,
    );
    const data = JSON.parse(bytes);
    assert.equal(data.fr, entry.fps);
    assert.equal(data.op - data.ip, entry.end - entry.start);
    assert.equal((data.op - data.ip) / data.fr, entry.duration);
    assert.equal(data.w, entry.width);
    assert.equal(data.h, entry.height);
  }
});
