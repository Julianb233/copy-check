import test from "node:test";
import assert from "node:assert/strict";
import { analyze, normalize } from "../src/core.mjs";
test("normalizes smart punctuation", () => assert.equal(normalize("It’s ready"), "It's ready"));
test("empty copy fails closed", () => assert.equal(analyze("").status, "empty"));
test("vocabulary lowers score", () => assert.ok(analyze("Our seamless platform unlocks value.").score < 5));
test("construction lowers score", () => assert.ok(analyze("It is not just a tool, it is a journey.").groups.some((group) => group.id === "phrases")));
test("proof can become advisory", () => assert.equal(analyze("Trusted by 500 teams.", { allowProof: true }).score, 5));
test("plain specific copy passes", () => assert.equal(analyze("You get a written scope before anyone starts work.").score, 5));
