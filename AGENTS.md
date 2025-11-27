# Repository Guidelines

## Project Structure & Module Organization
Routes live under `src/app` (e.g., `layout.tsx`, `page.tsx`). Database utilities sit in `src/lib/db`, where `db.ts` wires the TiDB Serverless dialect and `schema.d.ts` keeps the `DB` type; add helpers under `src/lib/<feature>`. Static assets belong in `public/`; build and lint config stays at the root (`next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`).

## Build, Test, and Development Commands
- `npm run dev` – start the Next.js dev server with hot reload on `localhost:3000`.
- `npm run build` – generate the production bundle.
- `npm start` – serve that bundle locally to mimic production.
- `npm run lint` – run ESLint (core web vitals + TypeScript).

## Coding Style & Naming Conventions
Write TypeScript (`.tsx`) components with 2-space indentation, `const` declarations, and descriptive filenames. Prefer React Server Components; only add `"use client"` when hooks are required, and keep Tailwind classes inline with layout utilities before variants. Export named helpers from `src/lib` to keep imports explicit, and run `npm run lint` after edits so the shared config enforces best practices.

## Testing Guidelines
Automated tests are not preconfigured, so run `npm run lint` plus a manual smoke test through `npm run dev` before pushing. When adding a runner (Vitest, Playwright, etc.), keep specs alongside the code as `*.test.ts[x]` or in `src/__tests__/`, and document the command (`npm run test`) inside your PR. Focus early coverage on SQL builders by mocking the exported `DB` type from `src/lib/db` before asserting results.

## Commit & Pull Request Guidelines
Git history uses short, imperative subjects such as `first commit` and `add kysely codebase`; continue that pattern, starting with a verb and keeping subjects under 72 characters. Split schema, API, and UI changes into separate commits when possible. Pull requests should outline motivation, list env or schema changes, link TiDB Cloud issues, and attach screenshots for anything under `src/app/page.tsx`. Finish with explicit verification steps (for example, `npm run build && npm start`) so reviewers can reproduce your checks quickly.

## Security & Configuration Tips
`src/lib/db/db.ts` reads `process.env.DATABASE_URL`, so store credentials in `.env.local` (gitignored) and never hard-code them. Confirm the variable exists before running build or dev commands to avoid TiDB dialect initialization errors. Regenerate and commit `src/lib/db/schema.d.ts` whenever the database changes so contributors keep type-safe queries.
