# TradeBot Pro - Vercel Deployment Guide

This guide walks you through deploying TradeBot Pro to Vercel with production-ready configuration, security headers, and environment setup.

## Prerequisites

Before deploying, ensure you have:

1. **Node.js 20.x** and **npm 9.x** installed locally
2. **GitHub account** with your forked repository
3. **Vercel account** (free tier is sufficient)
4. **Deriv Developer Account** at [developers.deriv.com](https://developers.deriv.com/)

## Step 1: Local Setup & Testing

### 1.1 Clone and Install

```bash
git clone https://github.com/M0hd19/trading-bot-template.git
cd trading-bot-template
npm install
```

### 1.2 Configure Brand

Edit `brand.config.json` to customize:
- Brand name and domain
- Colors and typography
- Logo and platform name
- OAuth redirect URIs

```json
{
  "brand_name": "TradeBot Pro",
  "brand_domain": "tradebot-pro.vercel.app",
  "platform": {
    "hostname": {
      "production": {
        "com": "tradebot-pro.vercel.app"
      }
    }
  }
}
```

### 1.3 Generate Brand CSS

```bash
npm run generate:brand-css
```

### 1.4 Validate Configuration

```bash
# Type checking
npm run type-check

# Code linting
npm run test:fix

# Build test
npm run build
```

All commands should pass without errors before deploying.

## Step 2: Register OAuth Client with Deriv

### 2.1 Create OAuth Application

1. Go to [developers.deriv.com](https://developers.deriv.com/)
2. Sign in or create an account
3. Navigate to **Settings** → **OAuth Applications**
4. Click **Add Application**
5. Fill in:
   - **Application Name**: TradeBot Pro
   - **Redirect URL**: `https://tradebot-pro.vercel.app/dashboard`
   - **Permissions**: Select `Trade` and `Account Management`
6. Click **Create**
7. Copy the **Client ID** - you'll need this for Vercel

### 2.2 Update brand.config.json

Update the OAuth redirect URIs in `brand.config.json`:

```json
{
  "auth": {
    "oauth_redirect_uri_production": "https://tradebot-pro.vercel.app/dashboard"
  }
}
```

Commit and push this change:

```bash
git add brand.config.json
git commit -m "docs: configure OAuth redirect URI for production"
git push origin main
```

## Step 3: Create Vercel Project

### 3.1 Import Repository

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Select **Import Git Repository**
4. Search for your repository and select it
5. Click **Import**

### 3.2 Configure Build Settings

Vercel should auto-detect these, but verify:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Other |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

**Important**: Make sure **Output Directory is set to `dist`** (not the default).

### 3.3 Deploy

Click **Deploy** and wait for the initial deployment to complete. You'll get a deployment URL (e.g., `tradebot-pro.vercel.app`).

## Step 4: Add Environment Variables to Vercel

### 4.1 Navigate to Environment Variables

1. Go to **Project Settings** → **Environment Variables**
2. Add the following variables:

#### Required Variables

| Key | Value | Description |
|-----|-------|-------------|
| `CLIENT_ID` | Your Deriv OAuth Client ID | OAuth authentication |
| `NODE_ENV` | `production` | Production environment |
| `APP_ENV` | `production` | Application environment |

#### Optional Variables

| Key | Value | Description |
|-----|-------|-------------|
| `APP_ID` | Your Deriv App ID | Optional Deriv app ID |
| `DERIV_WS_APP_ID` | `36300` | WebSocket app ID (Deriv default) |
| `SENTRY_DSN` | Your Sentry DSN | Error tracking |
| `GOOGLE_ANALYTICS_ID` | Your GA4 ID | Analytics |

### 4.2 Save Environment Variables

After adding variables, click **Save** and trigger a redeploy:

1. Go to **Deployments** tab
2. Click **Redeploy** on the latest successful deployment
3. Wait for build to complete

## Step 5: Verify Production Deployment

### 5.1 Test the Application

1. Navigate to your Vercel URL: `https://tradebot-pro.vercel.app`
2. You should see the TradeBot Pro login page
3. Click **Log In** and authenticate with your Deriv account
4. After login, you should reach the dashboard

### 5.2 Verify Security Headers

Open browser DevTools (F12) → **Network** tab:

1. Reload the page
2. Click on the main document request
3. Go to **Response Headers** tab
4. Verify these headers are present:
   - `Content-Security-Policy`
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: SAMEORIGIN`
   - `Strict-Transport-Security`

### 5.3 Check Configuration

Open browser console and verify:

```javascript
// Check brand config is loaded
console.log(window.__brand_config__)
```

## Step 6: Custom Domain (Optional)

To use your own domain:

1. In Vercel Project Settings → **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `trading.yourdomain.com`)
4. Follow the DNS setup instructions
5. Update OAuth redirect URI in Deriv and `brand.config.json`
6. Trigger a redeploy

## Continuous Deployment

After initial setup, deployments are automatic:

1. Push changes to main branch
2. Vercel automatically builds and deploys
3. Preview deployments for pull requests
4. Production deployment on merge to main

## Troubleshooting

### Build Fails on Vercel

1. Check build logs: **Deployments** → Failed Deployment → **View Build Logs**
2. Common issues:
   - Missing `CLIENT_ID` env var
   - Incorrect `package.json` scripts
   - Node version mismatch (should be 20.x)

### Login Not Working

1. Verify `CLIENT_ID` is set in Vercel env vars
2. Check OAuth redirect URI matches in both Deriv and `brand.config.json`
3. Ensure `brand_domain` and `platform.hostname.production` match deployment URL
4. Clear browser cache and try again

### Blank Page After Login

1. Check browser console for errors (F12)
2. Verify all env vars are set
3. Check network tab for failed API requests
4. Ensure WebSocket connection to `api.derivws.com` is allowed

### Security Headers Not Working

1. Verify `vercel.json` headers are correct
2. Try a hard refresh (Ctrl+Shift+R)
3. Check that `vercel.json` is in root directory
4. Trigger a redeploy: **Deployments** → **Redeploy**

## Performance Optimization

The project is already optimized, but you can:

1. Enable Vercel **Analytics** in Project Settings
2. Monitor Core Web Vitals
3. Use Vercel's **Edge Cache** for static assets (enabled by default)
4. Check bundle size: `npm run build:analyze`

## Security Checklist

Before going to production, ensure:

- ✅ `CLIENT_ID` is set in Vercel environment variables
- ✅ OAuth redirect URI matches deployment domain in both Deriv and `brand.config.json`
- ✅ Security headers are present in browser (CSP, HSTS, etc.)
- ✅ HTTPS is enforced (automatic on Vercel)
- ✅ Environment variables are not hardcoded in source
- ✅ `.env.local` is in `.gitignore` and not committed
- ✅ Analytics/monitoring credentials are configured (optional)
- ✅ Build passes without TypeScript or ESLint errors
- ✅ No console errors in production
- ✅ WebSocket connection to Deriv is working

## Support

For issues related to:

- **Deriv Integration**: [Deriv Developer Docs](https://developers.deriv.com/)
- **Vercel Deployment**: [Vercel Docs](https://vercel.com/docs)
- **This Template**: Check `user-guide/` directory

## Next Steps

1. **Monitor** your deployment with Vercel Analytics
2. **Add monitoring** (Sentry, DataDog, etc.) for production alerts
3. **Customize** the UI by editing `brand.config.json` and React components
4. **Scale** by connecting additional services (Google Drive, analytics, etc.)

---

**Deployment Status**: ✅ Production Ready

Built with React 18, TypeScript, RSBuild, and Deriv API.
