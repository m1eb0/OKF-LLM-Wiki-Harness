# Task Routes

Use after classifying the task. Start with 2–4 pages; expand only when the question requires it.

| Task | Read first | Read next |
|---|---|---|
| First time / unclear | `AGENTS.md`/`AGENT.md`, `wiki/index.md`, `wiki/start-here/agent-onboarding.md` if present | `project-overview`, `system-map` |
| Frontend page/UI | `frontend/route-map`, `frontend/page-patterns`, `architecture/frontend-ssr-ppr` | `design-system`, `accessibility`, `caching` |
| PPR/cache behavior | `architecture/frontend-ssr-ppr`, `architecture/caching` | `platform/cloudflare`, `frontend/route-map` |
| API contract | `backend/api-contract`, `backend/write-path` | `architecture/auth-and-sessions`, `data/schema` |
| DB schema/migration | `data/schema`, `data/migrations` | `architecture/request-path`, `data/search` |
| Search | `data/search`, `data/schema` | `backend/write-path`, `architecture/caching` |
| Auth/session | `architecture/auth-and-sessions`, `frontend/route-map` | `backend/api-contract`, `platform/cloudflare` |
| Deploy | `platform/deployment-topology`, `platform/ci-cd` | `operations/runbooks/deploy`, `platform/cloudflare` |
| Incident | `operations/incidents`, `platform/observability` | `operations/runbooks/deploy`, `operations/slo` |
| Backup/restore | `operations/runbooks/backup-restore`, `data/migrations` | `operations/runbooks/rollback` |
| Product behavior | `product/product-intent`, `product/content-lifecycle` | `product/moderation`, `product/notifications` |
| Design system | `frontend/design-system` | `frontend/accessibility`, `frontend/page-patterns` |
| Admin | `platform/admin-control-plane`, `decisions/0001-admin-isolation` | `platform/cloudflare`, `deployment-topology` |
| Tests | `testing/strategy`, `platform/ci-cd` | `backend/api-contract`, `frontend/route-map` |
| Wiki only | `schema/wiki-schema`, `start-here/wiki-coverage`, `start-here/wiki-backlog` | `sources/source-register`, `templates/` |

## Unknown Task

If no route fits:

```text
wiki/index.md
-> start-here/wiki-coverage.md
-> architecture/system-map.md
-> architecture/request-path.md
```

Then search for the concept with `grep`/`rg`; do not read every page.

## Wiki Page Paths

Domain indices are under `wiki/<domain>/index.md`. Canonical pages are linked from those indices. Lifecycle views are navigation only; do not treat them as canonical content.
