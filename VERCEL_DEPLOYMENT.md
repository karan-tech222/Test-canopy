# Vercel Deployment Guide

## Overview

This application has been restructured for deployment on Vercel. The backend has been converted to serverless API routes, and the frontend is configured as a static React app.

## Project Structure

```
website/
├── api/                      # Serverless API functions
│   ├── package.json
│   ├── database.js          # Database utilities
│   ├── proration.js         # Proration algorithm
│   ├── prorate.js           # POST /api/prorate endpoint
│   ├── health.js            # GET /api/health endpoint
│   ├── history/
│   │   ├── index.js         # GET /api/history endpoint
│   │   └── [id].js          # GET/DELETE /api/history/:id endpoints
│   └── dashboard/
│       └── stats.js         # GET /api/dashboard/stats endpoint
├── frontend/                # React frontend
│   ├── public/
│   ├── src/
│   └── package.json
├── vercel.json             # Vercel configuration
├── .vercelignore           # Files to ignore during deployment
└── package.json            # Root package.json
```

## Deployment Steps

### 1. Prerequisites

- A [Vercel account](https://vercel.com/signup)
- [Vercel CLI](https://vercel.com/docs/cli) installed (optional, for CLI deployment)
- Git repository (recommended for automatic deployments)

### 2. Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Restructure for Vercel deployment"
   git push origin main
   ```

2. **Import Project to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your Git repository
   - Vercel will auto-detect the configuration from `vercel.json`

3. **Configure Project Settings** (if needed)
   - Framework Preset: Other
   - Root Directory: `./`
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/build`
   - Install Command: `npm install --prefix api`

4. **Deploy**
   - Click "Deploy"
   - Wait for the deployment to complete
   - Your app will be live at `https://your-project.vercel.app`

### 3. Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from the project root
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? (enter a name)
# - Directory? ./
# - Override settings? No

# For production deployment
vercel --prod
```

## API Endpoints

All API endpoints are available as serverless functions:

- `GET /api/health` - Health check
- `POST /api/prorate` - Calculate proration
- `GET /api/history` - Get all history records
- `GET /api/history/:id` - Get specific history record
- `DELETE /api/history/:id` - Delete history record
- `GET /api/dashboard/stats` - Get dashboard statistics

## Environment Variables

The Vercel KV environment variables are automatically set when you create a KV database. No manual configuration needed!

Auto-configured by Vercel:
- `KV_REST_API_URL` - Automatically set
- `KV_REST_API_TOKEN` - Automatically set
- `KV_REST_API_READ_ONLY_TOKEN` - Automatically set

## Database Storage

The application now uses **Vercel KV** (Redis) for data storage:

- **Local Development**: Uses in-memory storage (data not persisted)
- **Vercel Production**: Uses Vercel KV for persistent storage

### Setting up Vercel KV (Required for Production):

1. Go to your project in Vercel Dashboard
2. Navigate to **Storage** tab
3. Click **Create Database** → **KV**
4. Name your database (e.g., `allocation-history`)
5. Click **Create**
6. The environment variables will be automatically added to your project

That's it! The application will automatically use Vercel KV when deployed.

### Local Development with KV (Optional):

If you want to test with KV locally:

1. Get your KV credentials from Vercel Dashboard
2. Create `.env` file in the root:
   ```
   KV_REST_API_URL=your_kv_url
   KV_REST_API_TOKEN=your_kv_token
   ```
3. Run `vercel dev`

Otherwise, local development uses in-memory storage by default.

## Local Development

You can still develop locally with the original structure:

```bash
# Start backend (from backend directory)
cd backend
npm install
npm run dev

# Start frontend (from frontend directory)
cd frontend
npm install
npm start
```

Or use Vercel CLI for local testing:

```bash
# Install dependencies
npm run install-all

# Run Vercel dev server
vercel dev
```

This will simulate the Vercel environment locally on `http://localhost:3000`.

## Troubleshooting

### Build Failures

- Check build logs in Vercel Dashboard
- Ensure all dependencies are listed in package.json files
- Verify Node.js version compatibility

### API Route Issues

- Check function logs in Vercel Dashboard
- Verify CORS headers are set correctly
- Ensure API routes follow Vercel's file-based routing

### Frontend Issues

- Clear browser cache
- Check browser console for errors
- Verify API endpoints are correctly configured

### Database Issues

- Remember: SQLite data is ephemeral on Vercel
- Consider migrating to a persistent database solution
- Check `/tmp` directory permissions in serverless functions

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Vercel Storage Solutions](https://vercel.com/docs/storage)

## Continuous Deployment

Once connected to Git:
- Push to `main` branch → Automatic production deployment
- Push to other branches → Automatic preview deployments
- Pull requests → Automatic preview deployments with unique URLs

## Custom Domain

To add a custom domain:
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records as instructed
4. Wait for DNS propagation (can take up to 48 hours)

---

**Note**: This restructured version maintains all original functionality while being optimized for Vercel's serverless platform.
