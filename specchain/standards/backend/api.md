# API Standards

## Design
- RESTful conventions
- Consistent URL structure
- Versioning strategy (`/api/v1/...`; breaking changes require a new version path)

## Responses
- Standard response format
- Appropriate status codes
- Error response structure with stable error codes (`{ error: { code, message, details? } }`)

## List endpoints (`GET /api/.../<resource>`)

Every list endpoint must accept this query-param contract:

| Param     | Purpose                                | Default | Max   |
|-----------|----------------------------------------|---------|-------|
| `cursor`  | Opaque pagination token                | null    | —     |
| `limit`   | Max rows in response                   | 50      | 200   |
| `sort`    | Sort key (whitelisted field names)     | varies  | —     |
| `order`   | `asc` or `desc`                        | `desc`  | —     |
| `filter[X]` | Filter by field X (whitelisted only) | none    | —     |

Response shape:

```json
{
  "rows": [...],
  "next_cursor": "opaque_token" | null,
  "has_more": true | false,
  "total": 42  // optional, only if cheap to compute
}
```

Rules:
- Unknown query params return 400 with the offending key in `error.details`
- Filter values validated against each field's type; invalid = 400
- Sort on unindexed fields = 400, not a 500 or a 15s query
- `total` omitted when computation would require a full table scan

## Freshness headers

Every list endpoint returns:

- `X-Data-Freshness: <ISO-8601 timestamp>` — when the underlying data was last known-consistent
- `Cache-Control` with explicit max-age or `no-store` per endpoint

Clients use `X-Data-Freshness` to render "last synced at" timestamps without a separate call.

## Security
- Input validation at the boundary (every query param, body field, path param)
- Rate limiting per-tenant with token bucket (default: 100 req/min per project, overrideable per tier)
- Authentication/Authorization via bearer tokens; tenant context derived from token claims
- 429 responses include `Retry-After`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Observability
- Every endpoint emits a trace span tagged with tenant + route + status code + duration
- p50/p95/p99 per route tracked and visible to on-call
- Deploy-time budget: no endpoint's p95 may regress >20ms vs main without explicit override
