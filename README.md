# Copy Check

Copy Check is a deterministic, private-by-default heuristic for reviewing AI-assisted writing. The public app runs entirely in the browser: no account, storage, model request, or workspace credential is involved.

It reports five pattern groups: AI-flavored vocabulary, template-like constructions, punctuation cadence, rule-of-three rhythm, and proof claims that need verification. It does **not** determine whether a person or model wrote text, and it never publishes or rewrites text automatically.

## Development

Run npm test and npm run check.

## Reuse

src/core.mjs is the shared deterministic engine. Consumers must pin a release and keep their own policy profile and regression examples. A score is review evidence, not permission to bypass human judgment.

## Attribution

The initial catalogue and deterministic-linter approach are adapted from SlopMonster (https://github.com/ItsssssJack/SlopMonster), licensed MIT. This repository retains the required license notice and adds its own tests and browser-only public interface.
