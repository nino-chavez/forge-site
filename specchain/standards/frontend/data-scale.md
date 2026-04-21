# Data-Scale Standards

Framework: any dynamic surface must hold at 10× and 100× content without redesign.

Applies to: dashboards, feeds, admin panels, list views, coordination tools, search results, tables with more than 20 rows. Does not apply to: marketing pages, landing pages, static docs, auth flows.

Rationale: static UX audits (Nielsen, WCAG, gestalt, spacing) measure what a surface looks like at current content. They miss failures that manifest only at volume — fresh signal buried under stale content, 8-second paint on overloaded DOM, silent row drop-off in client-filtered lists. Data-scale is an IA concern, not an engineering concern.

## 1. Default-view logic

- Lists default to "newest N, all types, highest-signal first"
- Never rank-by-type before rank-by-recency
- First item a cold user sees must be defensible: document it
- Failure example: "syntheses first, proposals second" buries new signal behind approved-but-stale items

## 2. Filter + sort affordances

- Filter chips + sort controls visible above the fold, not hidden in menus
- User narrows the set without leaving the page and without learning URL params
- Active filter visibly highlighted
- Failure example: filter only accessible via `...` overflow menu; sort only via URL param

## 3. Freshness contract

- Every dynamic surface documents its rate-of-change (seconds / minutes / hours / days / never)
- UI signal matches the model:
  - Fast-changing (seconds): unread indicator, "N new since you last viewed" banner, live updates
  - Medium (minutes/hours): timestamp of last sync, manual refresh button
  - Slow (days): no surfacing required
- Failure example: activity feed updates silently; user can't tell if data is fresh or stale

## 4. Scale budget

- Every list declares its rendering ceiling:
  - Default: paginate at **50 items**
  - Virtualize at **500 items**
- Declared budget visible in code comments + design docs
- Failure example: unbounded feed, append-forever columns, "load more" absent

## 5. Server-side filter/sort

- Client never receives rows it will not render
- Filter/sort state = URL/query param state (`?cursor=`, `?limit=`, `?type=`, `?status=`, `?sort=`)
- Server responds with paginated + filtered + sorted payload
- Failure example: `array.filter()` on a 1000-row client payload; response contains rows the user cannot see

## 6. Pagination UX

- Prefer cursor-based pagination over offset (stable under concurrent writes)
- Default page size: 50; max: 200
- "Load more" button on sentinel, or IntersectionObserver-triggered auto-fetch on scroll-near-bottom
- Skeleton cards render during fetch to prevent layout shift
- Loading states are localized (spinner on sentinel, not full-page reload)

## 7. Volume walkthrough (audit methodology)

For any new or modified list view, before ship:

1. Seed dev DB at 10× and 100× synthetic content
2. Capture Lighthouse + DevTools performance traces per viewport at each tier
3. Measure: LCP, TTI, CLS, DOM node count, network payload size, scroll-depth-to-new-signal
4. Evaluate against budgets below
5. Document pass/fail per heuristic

## 8. Performance budgets at scale

| Metric          | 1× data | 10× data | 100× data | Hard budget |
|-----------------|---------|----------|-----------|-------------|
| LCP             | <1s     | <1.5s    | <2s       | 2.5s        |
| TTI             | <1.5s   | <2.5s    | <3s       | 3.8s        |
| CLS             | 0       | <0.05    | <0.1      | 0.1         |
| DOM nodes       | <500    | <1000    | <1500     | 1500        |
| Payload (gzip)  | <20KB   | <50KB    | <100KB    | 150KB       |
| Scroll-to-new   | 0       | 0        | 0         | 0 always    |

## 9. Volatility map

Document per-surface rate-of-change as part of the spec. Example from a coordination-tool dashboard:

| Surface       | Rate         | UI signal                          |
|---------------|--------------|------------------------------------|
| Activity feed | seconds      | live updates, unread indicator     |
| Sessions      | minutes      | heartbeat freshness color          |
| Board         | minutes      | "N new" badge on tab switch        |
| Proposals     | hours        | timestamp + "new since" banner     |
| Trading cards | never        | static, no liveness affordance     |

Mismatches between documented volatility and UI freshness signal = failure.

## 10. Apply this standard

Cite this doc (`standards/frontend/data-scale.md`) from any design spec that includes a list view, feed, dashboard tab, or admin panel. Include the volume walkthrough and performance budget table in the verification criteria. If a surface lacks this coverage, the design spec is incomplete.
