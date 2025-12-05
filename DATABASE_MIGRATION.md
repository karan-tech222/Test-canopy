# Database Migration: SQLite → Vercel KV

## What Changed

Migrated from `better-sqlite3` (native C++ module) to `@vercel/kv` (Redis-based storage) to fix build errors on Vercel's serverless platform.

## Why This Change?

`better-sqlite3` requires native compilation which fails on Vercel because:
- Uses C++ bindings that aren't compatible with Vercel's Node.js runtime
- Requires build tools not available in serverless environment
- Build errors: `CopyablePersistent`, `v8::AccessorGetterCallback` compilation failures

## Solution

Vercel KV is:
- ✅ Serverless-native (no compilation needed)
- ✅ Redis-based (fast, scalable)
- ✅ Officially supported by Vercel
- ✅ Automatic environment variable setup
- ✅ In-memory fallback for local development

## Files Modified

1. **api/package.json**
   - Removed: `better-sqlite3`
   - Added: `@vercel/kv`

2. **api/database.js**
   - Replaced SQLite operations with Vercel KV operations
   - Added async/await for all database functions
   - Added in-memory fallback for local development

3. **All API endpoints** (prorate.js, history/*.js, dashboard/stats.js)
   - Updated to use `await` for async database calls

4. **Documentation**
   - Updated VERCEL_DEPLOYMENT.md with KV setup instructions
   - Simplified setup process (automatic environment variables)

## Setup Required

### For Production (Vercel):

1. Go to Vercel Dashboard → Your Project → Storage
2. Create KV Database
3. Deploy - that's it! Environment variables auto-configured

### For Local Development:

No setup needed - uses in-memory storage automatically.

Optional: To test with real KV locally:
- Copy KV credentials from Vercel
- Create `.env` file with `KV_REST_API_URL` and `KV_REST_API_TOKEN`
- Run `vercel dev`

## Data Structure

Vercel KV uses Redis data structures:

```
Sorted Set: history:ids → stores record IDs sorted by timestamp
String: history:{id} → stores full record as JSON
```

## Benefits

1. **No Build Issues** - Pure JavaScript, no native compilation
2. **Production Ready** - Officially supported by Vercel
3. **Scalable** - Redis-based, handles high traffic
4. **Simple Setup** - Automatic configuration on Vercel
5. **Local Development** - Works without external dependencies

## Migration Path

Old data in SQLite is not automatically migrated. This is a fresh start with Vercel KV.

If you need to preserve existing data, you would need to:
1. Export data from SQLite
2. Import to Vercel KV using a migration script

However, for this deployment, starting fresh is recommended.
