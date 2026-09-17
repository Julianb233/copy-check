const ROOT_WORDS = ["delve","leverage","seamless","elevate","robust","unlock","unleash","empower","streamline","cutting-edge","state-of-the-art","game-changing","revolutionize","transformative","transformation","innovate","holistic","synergy","paradigm","bespoke","meticulous","tapestry","testament","beacon","unparalleled","supercharge","turbocharge","effortless","next-level"];
const EXACT_WORDS = ["crafted","curated","harnessing","journey","realm","landscape","in today’s","in today's","ever-evolving","fast-paced","look no further","deep dive","embark","buckle up","the secret sauce","level up"];
const PHRASES = [
  [/(?:\bnot|n't)\s+(?:just|only|merely|simply)[^.!?]{0,80}\bbut\b/i, "not just X, but Y"],
  [/(?:\bnot|n't)\s+(?:just|only|merely|simply)[^!?]{0,80}[,.]\s*(?:it|this|that|they|we|you)\b/i, "not just X, it is Y"],
  [/\bwhether you(?:'re| are)\b[^.!?]{0,40}\bor\b/i, "whether you are X or Y"],
  [/\bmore than just\b/i, "more than just"], [/\b(?:that|this)(?:'s| is) where\b[^.!?]{0,30}\bcomes? in\b/i, "that is where X comes in"],
  [/\bsay goodbye to\b/i, "say goodbye to"], [/\bimagine (?:a|an|the)\b/i, "imagine a opener"],
  [/\bin conclusion\b|\bto sum up\b/i, "essay-summary phrasing"], [/\bwhen it comes to\b|\bat the end of the day\b/i, "filler opener"],
  [/\b(?:the key|the truth) is\b/i, "throat-clearing opener"], [/\b(?:may potentially|could potentially|might possibly)\b/i, "stacked hedge"],
  [/\b(?:ready to get started|let'?s get started)\b/i, "boilerplate CTA"]
];
const PROOF = /\b[\d][\d,]*(?:\.\d+)?\s*\+?\s*(?:(?:happy|early|active|satisfied|verified|trusted|delighted)\s+)?(?:\w+\s+){0,1}(?:users?|customers?|learners?|students?|teams?|members?|companies|businesses|homeowners?|subscribers?|clients?|patients?|readers?|sites?|projects?)\b/gi;
export function normalize(text = "") { return String(text).replace(/[’]/g, "'").replace(/[‐‑‒–]/g, "-").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim(); }
function escapeRegex(value) { return value.replace(/[\\^$.*+?()[\]{}|/-]/g, "\\$&"); }
function rootPattern(word) { if (word.includes("-")) return new RegExp("\\b" + escapeRegex(word) + "\\b", "gi"); const root = word.replace(/(ed|ing|ly|e)$/, ""); return new RegExp("\\b" + root + "(?:e|es|ed|ing|ion|ions|ional|ive|al|ally|s|ly|ness)?\\b", "gi"); }
function find(pattern, text, label) {
  const flags = pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g";
  return [...text.matchAll(new RegExp(pattern.source, flags))].map((match) => ({ text: match[0], label }));
}
export function analyze(input, options = {}) {
  const allowProof = options.allowProof === true; const profile = options.profile || "general"; const text = normalize(input);
  if (!text) return { score: 0, status: "empty", wordCount: 0, groups: [], profile };
  const groups = [], vocab = [];
  for (const word of ROOT_WORDS) vocab.push(...find(rootPattern(word), text, word));
  for (const word of EXACT_WORDS) vocab.push(...find(new RegExp("\\b" + escapeRegex(word) + "\\b", "gi"), text, word));
  if (vocab.length) groups.push({ id: "vocabulary", title: "AI-flavored vocabulary", hits: vocab });
  const phrases = PHRASES.flatMap(([pattern, label]) => find(pattern, text, label)); if (phrases.length) groups.push({ id: "phrases", title: "Template-like constructions", hits: phrases });
  const punctuation = []; for (const window of text.match(/[^.!?]{0,220}/g) || []) if ((window.match(/—/g) || []).length >= 2) punctuation.push({ text: window, label: "multiple em dashes" });
  const semicolonFloor = Math.max(3, Math.ceil(text.split(/\s+/).length / 100)); if ((text.match(/;/g) || []).length >= semicolonFloor) punctuation.push({ text: ";", label: "dense semicolon cadence" });
  if (punctuation.length) groups.push({ id: "punctuation", title: "Punctuation cadence", hits: punctuation });
  const rhythm = find(/\b\w+(?:,\s+\w+){1,2},?\s+(?:and|or)\s+\w+\b/gi, text, "three-item rhetorical list"); if (rhythm.length) groups.push({ id: "rhythm", title: "Rule-of-three rhythm", hits: rhythm });
  const proof = find(PROOF, text, "number near a people or customer noun"); if (proof.length) groups.push({ id: "proof", title: allowProof ? "Proof claim (review)" : "Unverified proof claim", hits: proof, advisory: allowProof });
  const penalized = groups.filter((group) => !group.advisory).length;
  return { score: Math.max(0, 5 - penalized), status: penalized ? "review" : "clean", wordCount: text.split(/\s+/).length, groups, profile };
}
export function summary(result) { if (result.status === "empty") return "Add some copy to review."; if (!result.groups.length) return "No configured copy-quality patterns were found."; return result.groups.map((group) => group.title + ": " + group.hits.slice(0, 3).map((hit) => hit.text).join(" · ")).join("\n"); }
