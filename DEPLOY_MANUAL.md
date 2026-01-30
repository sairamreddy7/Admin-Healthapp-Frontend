# 🚀 Quick Manual Deployment Guide

Since automated SSH deployment is having authentication issues, here's the simplest manual deployment process:

## Step 1: Open Terminal and SSH into VM2

```bash
ssh azureuser@grp06healthapp.eastus.cloudapp.azure.com
```

When prompted, enter password: `Healthcare@Group06!`

---

## Step 2: Copy and Paste This Entire Block

Once you're logged into VM2, copy and paste this entire command block:

```bash
cd /var/www/html/admin && \
echo "📥 Pulling latest changes..." && \
git pull origin main && \
echo "📦 Installing dependencies..." && \
npm install && \
echo "⚙️ Configuring for production..." && \
sed -i "s|// base: '/admin/',|base: '/admin/',|g" vite.config.js && \
sed -i 's|// basename="/admin"|basename="/admin"|g' src/App.jsx && \
echo "🔨 Building production bundle..." && \
npm run build && \
echo "🚀 Deploying..." && \
sudo mkdir -p /var/www/html/admin_current && \
sudo rm -rf /var/www/html/admin_current/* && \
sudo cp -r dist/* /var/www/html/admin_current/ && \
sudo chown -R www-data:www-data /var/www/html/admin_current/ && \
sudo chmod -R 755 /var/www/html/admin_current/ && \
echo "🔄 Restarting nginx..." && \
sudo systemctl restart nginx && \
echo "🔧 Reverting config..." && \
sed -i "s|base: '/admin/',|// base: '/admin/',|g" vite.config.js && \
sed -i 's|basename="/admin"|// basename="/admin"|g' src/App.jsx && \
echo "" && \
echo "✅ DEPLOYMENT COMPLETE!" && \
echo "🌐 Admin Portal: https://grp06healthapp.eastus.cloudapp.azure.com/admin/"
```

---

## Step 3: Wait for Completion

The deployment will take 2-5 minutes. You'll see:
- ✅ Pulling latest changes
- ✅ Installing dependencies  
- ✅ Building production bundle
- ✅ Deploying files
- ✅ Restarting nginx
- ✅ DEPLOYMENT COMPLETE!

---

## Step 4: Verify Deployment

Open your browser and go to:

**🌐 https://grp06healthapp.eastus.cloudapp.azure.com/admin/**

Test:
- ✅ Login page loads with modern design
- ✅ Can log in with admin credentials
- ✅ Dashboard shows modern UI with quick actions
- ✅ All pages load correctly

---

## 🆘 Troubleshooting

### If build fails:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### If nginx doesn't restart:
```bash
sudo systemctl status nginx
sudo nginx -t
sudo systemctl restart nginx
```

### If 404 errors occur:
Check nginx config points to `/var/www/html/admin_current`

---

## ✅ Done!

Once you see "DEPLOYMENT COMPLETE!", your modernized admin portal is live! 🎉
