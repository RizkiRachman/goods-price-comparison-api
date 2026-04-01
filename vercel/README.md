# Goods Price Comparison API - Mock Server

Deployed on Vercel - Free forever, never sleeps!

## Deploy

1. Go to https://vercel.com/dashboard
2. Add New Project → Import from GitHub
3. Set root directory: `vercel/`
4. Deploy!

## Usage

```bash
# Health check
curl https://your-project.vercel.app/

# API version
curl https://your-project.vercel.app/v1/version

# Health status
curl https://your-project.vercel.app/v1/health

# Search prices
curl "https://your-project.vercel.app/v1/prices/search?query=milk"
```
