# TradeBot Pro - Quick Deployment Reference

## ⚡ 5-Minute Deployment Guide

### Step 1: Prepare Code (1 minute)
```bash
# Commit configuration changes
git add .
git commit -m "chore: configure TradeBot Pro for production"
git push origin main
```

### Step 2: Create Vercel Project (2 minutes)
1. Go to [vercel.com](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Select your GitHub repository
4. Under Settings:
   - Build Command: `npm run build`
   - Output Directory: **`dist`** ← Important!
   - Framework Preset: `Other`
5. Click "Deploy"

### Step 3: Register Deriv OAuth (1 minute)
1. Go to [developers.deriv.com](https://developers.deriv.com/)
2. Sign in or create account
3. Create New Application:
   - Name: `TradeBot Pro`
   - Redirect URL: `https://[your-vercel-domain]/dashboard`
   - Permissions: `Trade` + `Account Management`
4. Copy the **Client ID**

### Step 4: Add Environment Variable (1 minute)
1. Back in Vercel: Project Settings → Environment Variables
2. Click "Add New Environment Variable"
3. Name: `CLIENT_ID`
4. Value: (paste your Deriv Client ID)
5. Environments: Select all (Development, Preview, Production)
6. Click "Save"
7. In Deployments tab, click "Redeploy" on latest deployment

### Step 5: Verify ✅ (Done!)
Visit `https://your-domain.vercel.app` and test login!

---

## 📋 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created with output directory = `dist`
- [ ] Deriv OAuth app created and client ID copied
- [ ] CLIENT_ID added to Vercel environment variables
- [ ] Deployment redeployed after adding env vars
- [ ] Can access https://your-vercel-domain.vercel.app
- [ ] Login works with Deriv account
- [ ] Dashboard loads with trading interface

---

## 🔧 Configuration Files

These files are already created and production-ready:

| File | Purpose | Status |
|------|---------|--------|
| `vercel.json` | Vercel platform config + security headers | ✅ Done |
| `brand.config.json` | Professional branding (colors, domain) | ✅ Done |
| `index.html` | SEO meta tags and title | ✅ Done |
| `.env.local` | Local development template | ✅ Done |
| `.env.example` | Complete documentation | ✅ Done |
| `DEPLOYMENT.md` | Detailed deployment guide | ✅ Done |
| `ENVIRONMENT_SETUP.md` | Environment variable reference | ✅ Done |

---

## 🚨 Common Issues & Solutions

### Issue: Build fails on Vercel
**Solution**: Check Build Logs → Error messages usually show missing CLIENT_ID

### Issue: Blank page after deployment
**Solution**: 
1. Hard refresh: Ctrl+Shift+R
2. Check browser console (F12) for errors
3. Verify CLIENT_ID is set in Vercel env vars

### Issue: Login doesn't work
**Solution**:
1. Verify CLIENT_ID is set correctly in Vercel
2. Verify redirect URI in Deriv matches your domain
3. Check that brand.config.json domain matches Vercel domain

### Issue: Can't find Deriv developers site
**Solution**: Go to [developers.deriv.com](https://developers.deriv.com/) - it's the official Deriv developer portal

---

## 📱 Vercel URLs

Your deployment will be at:

```
https://[your-project-name].vercel.app
```

Example:
```
https://tradebot-pro.vercel.app
```

---

## 🔐 Security Features Already Configured

✅ HTTPS enforced (automatic on Vercel)  
✅ Content Security Policy headers  
✅ X-Frame-Options protection  
✅ HSTS (Strict Transport Security)  
✅ SPA fallback routing secured  
✅ No hardcoded secrets in code  

---

## 📚 Detailed Guides

For more information, see:

- **DEPLOYMENT.md** - Full step-by-step guide with troubleshooting
- **ENVIRONMENT_SETUP.md** - All environment variables explained
- **PRODUCTION_CHECKLIST.md** - Verification that everything is configured
- **README.md** - Original project documentation

---

## 🎯 What Happens After Deploy

1. **Users access your domain** → `https://your-vercel-domain/`
2. **Redirected to login** ← OAuth with Deriv
3. **After authentication** → Dashboard with:
   - Visual bot builder
   - SmartCharts with real-time data
   - Performance tracking
   - Trading execution
4. **Connection established** ← WebSocket to Deriv API
5. **Real-time trading** ← Live market data and execution

---

## 💡 Pro Tips

1. **Custom Domain?** → Add in Vercel Settings and update brand.config.json
2. **Analytics?** → Set GOOGLE_ANALYTICS_ID in Vercel env vars (optional)
3. **Error Tracking?** → Set SENTRY_DSN for production errors (optional)
4. **Multiple Environments?** → Create preview deployments from GitHub PRs

---

## ❓ FAQ

**Q: Do I need to run npm build locally?**  
A: No, Vercel does it automatically. Just push your code.

**Q: Can I use my own domain?**  
A: Yes, add it in Vercel Settings. Update Deriv OAuth redirect URI to match.

**Q: How long does deployment take?**  
A: Usually 2-3 minutes for first build.

**Q: Can I test locally first?**  
A: Yes, run `npm install && npm start` locally. See README.md for details.

**Q: Is my secret safe on Vercel?**  
A: Yes, Vercel encrypts environment variables and injects them at build time only.

---

## 📞 Support

- **Deployment Issues** → Check [vercel.com/docs](https://vercel.com/docs)
- **Deriv Integration** → Check [developers.deriv.com](https://developers.deriv.com/)
- **Project Documentation** → See README.md and user-guide/

---

**Status**: ✅ Ready for production deployment on Vercel

Estimated deployment time: **5 minutes**  
Difficulty: **Beginner** ⭐ (No coding required)
