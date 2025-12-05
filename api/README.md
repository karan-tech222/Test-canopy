# API Directory

This directory contains serverless functions for Vercel deployment.

## Structure

- `prorate.js` - POST /api/prorate - Calculate proration
- `health.js` - GET /api/health - Health check
- `history/index.js` - GET /api/history - Get all history
- `history/[id].js` - GET/DELETE /api/history/:id - Get/delete specific record
- `dashboard/stats.js` - GET /api/dashboard/stats - Get statistics
- `database.js` - Database utilities (Vercel KV)
- `proration.js` - Core proration algorithm

## Database

Uses Vercel KV (Redis) for production, with in-memory fallback for local development.

## Local Testing

```bash
# From project root
vercel dev
```

The API will be available at `http://localhost:3000/api/*`
