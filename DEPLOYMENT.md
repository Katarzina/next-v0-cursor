# 🚀 Deploy to Vercel

## Quick Start (5 minutes)

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your GitHub repository
4. **Configure Project:**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (leave as is)
   - Build Settings: (leave defaults)

### 3. Add Database & Environment Variables
During deployment setup:

1. **Add Storage** → Select **Postgres** → Create Database
   - Vercel will automatically add: `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, etc.
2. **Environment Variables** - Add only this one:
   - `NEXTAUTH_SECRET` → Click "Generate" (or use `openssl rand -base64 32`)
3. Click **Deploy**

### 4. Initialize Database (after deployment)
```bash
# Install Vercel CLI
npm i -g vercel

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run database migrations
npx prisma db push

# Seed with test data (optional)
npm run db:seed
```

### 5. Final Configuration
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project → Settings → Environment Variables
3. Update `NEXTAUTH_URL` to your actual domain: `https://your-app.vercel.app`
4. Go to Deployments tab → Click "..." → Redeploy

## ✅ Done!

Your app is now live at: `https://your-app.vercel.app`

### Test Accounts (if you ran db:seed)
- **Admin**: admin@propertyfinder.com / password123
- **Agent**: sarah.johnson@propertyfinder.com / password123
- **User**: user@example.com / password123

---

## 🛠 Troubleshooting

### Database Connection Issues
- **Error: Can't connect to database**
  - Verify `DATABASE_URL` environment variable is set to `{{POSTGRES_PRISMA_URL}}`
  - Or manually copy the `POSTGRES_PRISMA_URL` value to `DATABASE_URL`

### Authentication Not Working
- **Error: NEXTAUTH_URL mismatch**
  - Ensure `NEXTAUTH_URL` exactly matches your Vercel domain (with https://)
  - Must be updated after deployment when you know the final URL

### No Data Showing
- **Empty property listings**
  ```bash
  npx prisma db push     # Create tables
  npm run db:seed        # Add test data
  ```

### Build Failures
- **Module not found errors**
  - Check all imports use correct casing (Linux is case-sensitive)
  - Ensure `postinstall` script runs: `"postinstall": "prisma generate"`

---

## 📊 Production Checklist

- [ ] All environment variables set correctly
- [ ] Database migrations completed (`npx prisma db push`)
- [ ] NEXTAUTH_URL updated to production domain
- [ ] Test user registration and login
- [ ] Test property CRUD as agent
- [ ] Verify API docs work at `/api-docs`
- [ ] Check all pages load without errors

---

## 🔄 Updating Your App

When you push updates to GitHub:
1. Vercel automatically rebuilds and deploys
2. If you changed the database schema:
   ```bash
   vercel env pull
   npx prisma db push
   ```

---

## 💡 Tips

- **Free Database**: Vercel Postgres free tier includes 60 hours/month compute time
- **Custom Domain**: Add in Settings → Domains
- **Analytics**: Enable Vercel Analytics for free insights
- **Speed Insights**: Enable for performance monitoring

Need help? Check the [Vercel Docs](https://vercel.com/docs) or [open an issue](https://github.com/your-repo/issues).