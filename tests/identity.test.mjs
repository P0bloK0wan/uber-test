import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

test("brand assets preserve the researched source bytes and provenance", () => {
  const manifest = JSON.parse(
    readFileSync(
      new URL("../dist/assets/identity/manifest.json", import.meta.url),
    ),
  );
  assert.ok(manifest.length >= 5);
  for (const entry of manifest) {
    const bytes = readFileSync(
      new URL(`../dist/${entry.path}`, import.meta.url),
    );
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      entry.sha256,
      entry.path,
    );
    assert.equal(bytes.length, entry.bytes, entry.path);
    assert.equal(new URL(entry.url).protocol, "https:");
    assert.ok(entry.source_kind);
  }
});
