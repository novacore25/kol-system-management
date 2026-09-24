# Graph Report - kol-system  (2026-09-24)

## Corpus Check
- 73 files · ~75,998 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 380 nodes · 486 edges · 33 communities (24 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `054d0c00`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TikTok API & Ecosystem Integration Guide
- What You Must Do When Invoked
- ApplicationReviewTable.tsx
- graphify reference: extra exports and benchmark
- graphify reference: query, path, explain
- User Flows, Role Permissions, and Business Rules
- System Architecture & Product Decisions
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- Tech Stack, Database, UI Engine, and SEO Architecture
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- rules/graphify.md
- extraction-spec.md
- workflows/graphify.md
- TikTok App Review & Sandbox Strategy
- Product Requirements, Unique UX & Brand Identity
- schema.ts
- package.json
- auth.ts
- types/index.ts
- compilerOptions
- dependencies
- devDependencies
- postcss.config.mjs
- wilayah.ts
- README.md
- react
- CreatorRegistrationForm.tsx

## God Nodes (most connected - your core abstractions)
1. `react` - 26 edges
2. `lucide-react` - 23 edges
3. `@heroui/react` - 16 edges
4. `compilerOptions` - 16 edges
5. `CreatorTaskItem` - 12 edges
6. `What You Must Do When Invoked` - 12 edges
7. `clsx` - 10 edges
8. `/graphify` - 10 edges
9. `scripts` - 9 edges
10. `graphify reference: extra exports and benchmark` - 8 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `createSessionToken()`  [EXTRACTED]
  src/app/api/auth/google/callback/route.ts → src/lib/auth.ts
- `GET()` --calls--> `isAdminEmail()`  [EXTRACTED]
  src/app/api/auth/google/callback/route.ts → src/lib/auth.ts
- `GET()` --calls--> `getCurrentSession()`  [EXTRACTED]
  src/app/api/auth/me/route.ts → src/lib/auth.ts
- `GET()` --calls--> `getDistricts()`  [EXTRACTED]
  src/app/api/wilayah/route.ts → src/lib/wilayah.ts
- `GET()` --calls--> `getProvinces()`  [EXTRACTED]
  src/app/api/wilayah/route.ts → src/lib/wilayah.ts

## Import Cycles
- None detected.

## Communities (33 total, 6 thin omitted)

### Community 0 - "TikTok API & Ecosystem Integration Guide"
Cohesion: 0.17
Nodes (11): 1. Arsitektur Dua Pilar Ekosistem TikTok, 2. Rincian API: TikTok for Developers (Open API), 3. Rincian API: TikTok Shop Partner Center (TAP / Partner API), 4. Keamanan & Compliance, A. Login Kit (OAuth 2.0), A. Target Collaboration & Exclusive Product Link, B. Display API / Video List API, B. Sample Management API (Opsi Integrasi Otomatis) (+3 more)

### Community 1 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 2 - "ApplicationReviewTable.tsx"
Cohesion: 0.23
Nodes (6): ApplicationReviewTable(), REJECTION_REASONS, COURIERS, SampleLogisticsTable(), AdminApplicationItem, initialApplications

### Community 3 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 4 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 5 - "User Flows, Role Permissions, and Business Rules"
Cohesion: 0.40
Nodes (4): 1. Actor Persona & Roles, 2. End-to-End Workflow Diagram, 3. Database Schema Blueprint (Draft), User Flows, Role Permissions, and Business Rules

### Community 6 - "System Architecture & Product Decisions"
Cohesion: 0.40
Nodes (4): 1. Project Background & Vision, 2. Key Decisions & Agreements, 3. High-Level System Architecture, System Architecture & Product Decisions

### Community 7 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 8 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 9 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 10 - "Tech Stack, Database, UI Engine, and SEO Architecture"
Cohesion: 0.40
Nodes (4): 1. Core Stack Overview, 2. Pilihan UI Engine: Perbandingan & Kombinasi Terbaik, 3. SEO & Link Sharing Architecture, Tech Stack, Database, UI Engine, and SEO Architecture

### Community 16 - "TikTok App Review & Sandbox Strategy"
Cohesion: 0.33
Nodes (5): 1. Mekanisme Sandbox vs Live (Production), 2. Analisis Aturan Review: Apakah Ribet?, 3. Strategi Pengembangan Agency (Zero-Downtime Timeline), Checklist Wajib Lolos Review:, TikTok App Review & Sandbox Strategy

### Community 17 - "Product Requirements, Unique UX & Brand Identity"
Cohesion: 0.40
Nodes (4): 1. Perbedaan Utama: Versi Kita vs Gro Creator, 2. Struktur Modul Aplikasi, 3. Alur Status Komprehensif, Product Requirements, Unique UX & Brand Identity

### Community 18 - "schema.ts"
Cohesion: 0.05
Nodes (41): drizzle-orm, pg, GET(), GoogleUserInfo, db, pool, applicationStatusEnum, auditLogs (+33 more)

### Community 19 - "package.json"
Cohesion: 0.07
Nodes (26): name, private, scripts, build, db:generate, db:migrate, db:push, db:studio (+18 more)

### Community 20 - "auth.ts"
Cohesion: 0.24
Nodes (7): jose, GET(), getCurrentSession(), JWT_SECRET, verifySessionToken(), config, JWT_SECRET

### Community 21 - "types/index.ts"
Cohesion: 0.09
Nodes (27): CreatorTaskItem, initialCreatorTasks, ApplicationStatus, CampaignPlatformType, CampaignSalesAwarenessSummary, CampaignStatus, CommissionType, CreatorTier (+19 more)

### Community 22 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 23 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, clsx, dotenv, drizzle-orm, framer-motion, @heroui/react, jose, lucide-react (+5 more)

### Community 24 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, drizzle-kit, postcss, tailwindcss, @types/node, @types/pg, @types/react (+2 more)

### Community 27 - "wilayah.ts"
Cohesion: 0.44
Nodes (7): GET(), cache, getDistricts(), getProvinces(), getRegencies(), getVillages(), WilayahItem

### Community 28 - "README.md"
Cohesion: 0.22
Nodes (8): 1. Clone repository, 1. Portal Kreator, 2. Install dependencies, 2. Panel Admin Agensi, 3. Jalankan development server, 🛠️ Cara Menjalankan Secara Lokal, 📱 Panduan Review UI (Fitur & Halaman), 💻 Tech Stack

### Community 29 - "react"
Cohesion: 0.06
Nodes (23): nextConfig, clsx, @heroui/react, lucide-react, next, react, CampaignAdminItem, initialCampaigns (+15 more)

### Community 31 - "CreatorRegistrationForm.tsx"
Cohesion: 0.12
Nodes (9): OnboardingPage(), POPULAR_BANKS, CreatorRegistrationForm(), NICHES, POPULAR_BANKS, SelectedWilayah, WilayahOption, WilayahSelect() (+1 more)

## Knowledge Gaps
- **199 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+194 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 251 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ApplicationReviewTable.tsx`, `package.json`, `types/index.ts`, `CreatorRegistrationForm.tsx`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Why does `drizzle-orm` connect `schema.ts` to `package.json`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `ApplicationReviewTable.tsx`, `package.json`, `types/index.ts`, `CreatorRegistrationForm.tsx`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _199 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `What You Must Do When Invoked` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `schema.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05496828752642706 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._