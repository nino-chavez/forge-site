# Query Standards

## Performance
- Use indexes appropriately
- Avoid N+1 queries
- Paginate large result sets
- Log slow queries (default threshold: 100ms)
- Monitor query performance via explain plans in CI for hot paths

## Pagination
- Prefer **cursor-based pagination** over offset for stability under concurrent writes
- Default page size: **50 rows**, max: **200**
- Cursor format: opaque token encoding `(sort_key, row_id)` — clients must not parse it
- Returned shape: `{ rows, next_cursor, has_more }` — omit `next_cursor` when exhausted
- Index every sort key referenced by a cursor (composite index on `(sort_key DESC, id)`)

## Filtering
- Filter state lives in query params, not request body, for GET list endpoints
- Server must enforce that filtered fields are indexed — reject filter params on unindexed columns with 400
- Validate every filter param against an allow-list; never pass through unknown keys

## Security
- Use parameterized queries
- Validate input before queries
- Limit returned fields to what the endpoint contract declares (no `SELECT *` at the API boundary)

## Scale expectations
- Every list query is benchmarked at 100× current row count before ship
- `EXPLAIN ANALYZE` plan committed alongside the migration that introduces the query
- Queries that scan >10k rows without a covering index are blocked by code review

## Best Practices
- Use query builders or ORM for compile-time safety; hand-written SQL only for hot paths with benchmarks attached
- Materialized views for expensive aggregates (refresh cadence documented per view)
- Row-level TTLs on ephemeral data (sessions, activity events, search history) — document retention policy per table
