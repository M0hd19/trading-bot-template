# Environment Setup Guide

Complete reference for all environment variables and configuration options for TradeBot Pro.

## Environment Variables Reference

### Core Authentication

#### `CLIENT_ID` (REQUIRED)
- **Type**: String
- **Description**: OAuth 2.0 Client ID from Deriv
- **How to get**: Register app at [developers.deriv.com](https://developers.deriv.com/)
- **Format**: Usually a 64-character alphanumeric string
- **Example**: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f`
- **Where to set**:
  - Development: `.env.local`
  - Production: Vercel Project Settings → Environment Variables

#### `APP_ID` (OPTIONAL)
- **Type**: String
- **Description**: Custom Deriv Application ID
- **Default**: Uses public app ID
- **When needed**: If you have registered a custom app with Deriv
- **Format**: Integer or string ID
- **Where to set**: Same as `CLIENT_ID`

### API Configuration

#### `DERIV_WS_APP_ID` (OPTIONAL)
- **Type**: String
- **Default**: `36300` (Deriv's public app ID)
- **Description**: WebSocket trading app ID
- **Note**: Only change if you have registered a custom app
- **Where to set**: Same as `CLIENT_ID`

### Environment Detection

#### `NODE_ENV`
- **Type**: String
- **Valid Values**: `development`, `production`
- **Default**: `production` (on Vercel)
- **Purpose**: Controls build optimization and error logging
- **Auto-managed**: By Vercel (don't manually set on Vercel)
- **Manual set**: For local development in `.env.local`

#### `APP_ENV`
- **Type**: String
- **Valid Values**: `development`, `staging`, `production`
- **Default**: `development`
- **Purpose**: Controls which API endpoints are used
- **Development**: Points to Deriv staging servers
- **Production**: Points to Deriv production servers
- **Where to set**: `.env.local` or Vercel Environment Variables

### Google Drive Integration (Optional)

Enable cloud backup and restore of trading strategies.

#### `GD_CLIENT_ID`
- **Type**: String
- **How to get**: 
  1. Go to [Google Cloud Console](https://console.cloud.google.com/)
  2. Create new project
  3. Enable Google Drive API
  4. Create OAuth 2.0 Client ID (Web application)
  5. Copy Client ID

#### `GD_APP_ID`
- **Type**: String
- **How to get**: From Google Cloud Console project settings

#### `GD_API_KEY`
- **Type**: String
- **How to get**: From Google Cloud Console → Create API Key

### Error Tracking & Monitoring

#### Sentry (Error Tracking)

**`SENTRY_DSN`**
- **Type**: URL
- **How to get**: [Create Sentry account](https://sentry.io/) → Create Project → Copy DSN
- **Format**: `https://examplePublicKey@o0.ingest.sentry.io/0`
- **Purpose**: Captures and reports production errors
- **Impact**: Adds ~30KB to bundle (with tree-shaking)

#### TrackJS (Error & Performance Monitoring)

**`TRACKJS_TOKEN`**
- **Type**: String
- **How to get**: [Create TrackJS account](https://trackjs.com/) → Get token
- **Purpose**: Real user monitoring and error tracking
- **Impact**: Adds monitoring overhead

### Analytics

#### Google Analytics

**`GOOGLE_ANALYTICS_ID`**
- **Type**: String (GA4 format)
- **How to get**: [Google Analytics](https://analytics.google.com/) → Create Property → Get Measurement ID
- **Format**: `G-XXXXXXXXXX`
- **Purpose**: Website traffic and user behavior analytics
- **Impact**: Minimal (loaded asynchronously)

#### PostHog (Product Analytics)

**`POSTHOG_API_KEY`**
- **Type**: String
- **How to get**: [Create PostHog account](https://posthog.com/) → Get API key
- **Purpose**: Product usage analytics and feature flags
- **Impact**: Moderate (event tracking)

#### RudderStack (Event Analytics)

**`RUDDERSTACK_KEY`**
- **Type**: String
- **How to get**: [Create RudderStack account](https://www.rudderstack.com/) → Get key

**`RUDDERSTACK_DATA_PLANE_URL`**
- **Type**: URL
- **How to get**: RudderStack dashboard

**Purpose**: Enterprise-grade event analytics

#### Datadog RUM (Real User Monitoring)

**`DATADOG_APPLICATION_ID`**
- **Type**: String
- **How to get**: [Datadog](https://www.datadoghq.com/) → RUM → Create Application

**`DATADOG_CLIENT_TOKEN`**
- **Type**: String
- **How to get**: Same as above

**Purpose**: Performance monitoring and error tracking

### Feature Flags

#### GrowthBook

**`GROWTHBOOK_API_KEY`**
- **Type**: String
- **How to get**: [GrowthBook](https://www.growthbook.io/) → Create account → Get API key

**`GROWTHBOOK_FEATURES_URL`**
- **Type**: URL
- **Default**: `https://api.growthbook.io/api/features`
- **Purpose**: A/B testing and feature flags

## Setting Environment Variables

### Development (Local)

#### Step 1: Create `.env.local`

```bash
cp .env.example .env.local
```

#### Step 2: Edit `.env.local`

```bash
# Only set variables you need for development
CLIENT_ID=your_deriv_oauth_client_id
DERIV_WS_APP_ID=36300
NODE_ENV=development
APP_ENV=development

# Optional analytics for local testing
# GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

#### Step 3: Verify

```bash
npm run type-check
npm run build
```

**Important**: `.env.local` is in `.gitignore` - it won't be committed.

### Production (Vercel)

#### Step 1: Navigate to Vercel Project Settings

1. Go to [vercel.com](https://vercel.com)
2. Select your project
3. Click **Settings**
4. Go to **Environment Variables**

#### Step 2: Add Required Variables

| Key | Value |
|-----|-------|
| `CLIENT_ID` | Your Deriv OAuth Client ID |
| `NODE_ENV` | `production` |
| `APP_ENV` | `production` |

#### Step 3: Add Optional Variables (as needed)

- `GOOGLE_ANALYTICS_ID`
- `SENTRY_DSN`
- `DATADOG_APPLICATION_ID`
- etc.

#### Step 4: Select Environments

For each variable, select which environments it applies to:
- Development (git branch deployments)
- Preview (pull request deployments)
- Production (main branch deployments)

**Recommendation**: Set `NODE_ENV` and `APP_ENV` only for Production environment.

#### Step 5: Trigger Redeploy

```bash
# Push a commit to trigger auto-redeploy
git commit --allow-empty -m "chore: trigger redeploy with env vars"
git push

# OR manually redeploy from Vercel UI:
# Deployments → Latest → Redeploy
```

#### Step 6: Verify

1. Go to latest deployment logs
2. Verify env vars are injected: `env vars` section shows your variables
3. Check that build completes successfully
4. Test the application

## Environment Variable Precedence

When building, variables are loaded in this order (highest to lowest precedence):

1. **Vercel Environment Variables** (if deployed to Vercel)
2. **System Environment Variables**
3. **`.env.production`** (if it exists, checked by build tool)
4. **`.env.local`** (local development only)
5. **`.env.example`** (defaults, rarely used)

### Example Flow

**Local Development**:
```bash
CLIENT_ID=local_client_id npm start
# Uses: local_client_id (from command line)
```

**Local Development with .env.local**:
```bash
npm start
# Uses: CLIENT_ID from .env.local
```

**Vercel Production Build**:
```bash
# Build uses CLIENT_ID from Vercel Environment Variables
# .env.local is ignored (not part of repo)
```

## Validation

### Check Current Environment

```bash
# Show which variables are loaded (in Node script)
node -e "console.log(process.env.CLIENT_ID, process.env.APP_ENV)"

# Or in React component:
console.log(process.env.CLIENT_ID);
```

### Pre-deployment Checklist

```bash
# 1. Type checking
npm run type-check

# 2. Linting
npm run test:lint

# 3. Build
npm run build

# 4. Verify dist/ output
ls -la dist/

# 5. Check bundle size
npm run build:analyze
```

## Security Best Practices

### DO ✅

- ✅ Use Vercel's encrypted environment variables for production secrets
- ✅ Create separate OAuth apps for development and production
- ✅ Rotate CLIENT_ID every 3-6 months
- ✅ Use strong, unique values for API keys
- ✅ Document why each env var is needed
- ✅ Review env vars before each deployment

### DON'T ❌

- ❌ Commit `.env.local` or any `.env` files with secrets
- ❌ Hardcode CLIENT_ID or other secrets in source code
- ❌ Share secrets via email or chat
- ❌ Use development secrets in production
- ❌ Push API keys to public repositories
- ❌ Reuse the same OAuth app across multiple domains

## Troubleshooting

### "CLIENT_ID is undefined"

**Problem**: OAuth login fails with "Client ID is undefined"

**Solutions**:
1. Verify CLIENT_ID is set: `echo $CLIENT_ID`
2. For Vercel: Check Project Settings → Environment Variables
3. For local: Verify `.env.local` exists and has CLIENT_ID
4. Rebuild: `npm run build` then redeploy

### "Failed to connect to WebSocket"

**Problem**: Cannot connect to Deriv trading API

**Solutions**:
1. Verify `APP_ENV` is set correctly
2. Check firewall/network allows WebSocket to `api.derivws.com`
3. Verify OAuth token is valid (try logging in again)
4. Check browser console for detailed error message

### "Analytics not working"

**Problem**: Google Analytics / PostHog / other analytics not tracking events

**Solutions**:
1. Verify ID/API key is correct
2. Check that variable is set: `process.env.GOOGLE_ANALYTICS_ID`
3. Verify build includes the variable: Check Production build logs
4. Wait 5-10 minutes for data to appear in analytics dashboard
5. Use browser DevTools → Network tab to verify API calls are being made

### Wrong environment configuration

**Problem**: Local dev is hitting production servers or vice versa

**Solutions**:
1. Check `APP_ENV`: Should be `development` for dev, `production` for prod
2. Verify in browser console: `console.log(process.env.APP_ENV)`
3. Rebuild: `npm run build`
4. Clear browser cache: Ctrl+Shift+Delete

## Complete Environment Template

```bash
# ============================================================================
# REQUIRED
# ============================================================================
CLIENT_ID=your_deriv_client_id

# ============================================================================
# RECOMMENDED
# ============================================================================
NODE_ENV=production
APP_ENV=production
DERIV_WS_APP_ID=36300

# ============================================================================
# OPTIONAL - Analytics
# ============================================================================
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
SENTRY_DSN=https://key@sentry.io/project

# ============================================================================
# OPTIONAL - Google Drive Integration
# ============================================================================
GD_CLIENT_ID=your_google_client_id
GD_APP_ID=your_google_app_id
GD_API_KEY=your_google_api_key
```

## Reference Links

- [Deriv OAuth Setup](https://developers.deriv.com/)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Sentry Documentation](https://docs.sentry.io/)
- [DataDog RUM Docs](https://docs.datadoghq.com/real_user_monitoring/)

---

Last Updated: 2024
