# 🚀 COMPLETE GUIDE: Add SSL & Domain for Admin Portal

## 📋 TWO OPTIONS AVAILABLE

---

## ✅ **OPTION 1: Path-Based (RECOMMENDED - Quickest)**

### Admin URL: `https://grp06healthapp.eastus.cloudapp.azure.com/admin`

**Pros:**
- ✅ Uses existing SSL certificate (already configured)
- ✅ No DNS configuration needed
- ✅ Can be done in 10 minutes
- ✅ No additional Azure resources

**Cons:**
- ⚠️  URL has `/admin` path instead of subdomain

---

### 🎯 IMPLEMENTATION STEPS FOR OPTION 1

#### **Step 1: Update Frontend for /admin Path**

On your Mac, update vite.config.js:

```bash
cd /Users/reethuchada/Documents/Admin-Healthapp-Frontend
```

Edit `vite.config.js` and change:
```javascript
base: '/',  // Change from this
```
To:
```javascript
base: '/admin/',  // To this
```

#### **Step 2: Rebuild Frontend**

```bash
npm run build
```

#### **Step 3: Upload to VM2**

```bash
scp -r dist/* grp06admin@20.42.48.79:~/healthcare-portal-frontend/
# Password: Healthcare@Group06!
```

#### **Step 4: Configure Nginx on VM2**

SSH to VM2:
```bash
ssh grp06admin@20.42.48.79
```

Then run the setup script:
```bash
# Option A: Copy and paste the script content manually
# Option B: If you uploaded the script:
chmod +x ~/vm2-quick-ssl-setup.sh
./vm2-quick-ssl-setup.sh
```

Or manually update Nginx config:
```bash
sudo nano /etc/nginx/sites-available/healthapp
```

Add this section BEFORE the "location /" block:
```nginx
    # Admin Portal
    location /admin {
        alias /home/grp06admin/healthcare-portal-frontend;
        index index.html;
        try_files $uri $uri/ /admin/index.html;
        rewrite ^/admin$ /admin/ permanent;
    }

    # Admin Portal assets
    location /admin/assets/ {
        alias /home/grp06admin/healthcare-portal-frontend/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
```

Test and reload:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

#### **Step 5: Update Frontend .env**

Update `.env` file:
```bash
VITE_API_URL=https://grp06healthapp.eastus.cloudapp.azure.com/api
```

#### **Step 6: Test!**

Open browser: **https://grp06healthapp.eastus.cloudapp.azure.com/admin**

✅ You should see admin portal with SSL!

---

## 🔐 **OPTION 2: Subdomain (Professional)**

### Admin URL: `https://admin.grp06healthapp.eastus.cloudapp.azure.com`

**Pros:**
- ✅ Professional subdomain
- ✅ Separate SSL certificate
- ✅ Clean URL

**Cons:**
- ⚠️  Requires Azure DNS Zone configuration
- ⚠️  Takes 15-30 minutes (DNS propagation)
- ⚠️  Slightly more complex

---

### 🎯 IMPLEMENTATION STEPS FOR OPTION 2

#### **Step 1: Configure Azure DNS**

1. Go to Azure Portal
2. Search for "DNS zones"
3. If zone doesn't exist, create:
   - Click "+ Create"
   - Name: `grp06healthapp.eastus.cloudapp.azure.com`
   - Resource Group: `MIT572-Group06`
   - Click "Create"

4. Add A Record:
   - Go to the DNS zone
   - Click "+ Record set"
   - Name: `admin`
   - Type: `A`
   - IP: `20.42.48.79`
   - Click "OK"

#### **Step 2: Wait for DNS Propagation**

Wait 5-10 minutes, then test:
```bash
nslookup admin.grp06healthapp.eastus.cloudapp.azure.com
# Should return: 20.42.48.79
```

#### **Step 3: Configure Nginx on VM2**

SSH to VM2:
```bash
ssh grp06admin@20.42.48.79
```

Create new site configuration:
```bash
sudo nano /etc/nginx/sites-available/admin-portal
```

Paste:
```nginx
server {
    listen 80;
    server_name admin.grp06healthapp.eastus.cloudapp.azure.com;

    root /home/grp06admin/healthcare-portal-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        alias /home/grp06admin/healthcare-portal-frontend/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/admin-portal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### **Step 4: Get SSL Certificate**

```bash
sudo certbot --nginx -d admin.grp06healthapp.eastus.cloudapp.azure.com
```

Follow prompts:
- Enter email
- Agree to Terms (Y)
- Redirect HTTP to HTTPS (2)

#### **Step 5: Test!**

Open browser: **https://admin.grp06healthapp.eastus.cloudapp.azure.com**

✅ You should see admin portal with SSL!

---

## 📊 COMPARISON

| Feature | Option 1 (Path) | Option 2 (Subdomain) |
|---------|-----------------|---------------------|
| URL | `/admin` | `admin.subdomain` |
| Setup Time | 10 minutes | 30 minutes |
| SSL | Shared | Dedicated |
| DNS Required | No | Yes |
| Professional | Good | Best |
| Complexity | Low | Medium |

---

## 🎯 MY RECOMMENDATION

**Use Option 1 (Path-Based)** because:
- ✅ Faster to implement
- ✅ No DNS configuration needed
- ✅ Uses existing SSL certificate
- ✅ Works immediately

You can always switch to Option 2 later if needed!

---

## 📝 QUICK START CHECKLIST

### For Option 1 (Path-Based):

```bash
# 1. Update vite.config.js
#    base: '/' → base: '/admin/'

# 2. Rebuild
cd /Users/reethuchada/Documents/Admin-Healthapp-Frontend
npm run build

# 3. Upload
scp -r dist/* grp06admin@20.42.48.79:~/healthcare-portal-frontend/

# 4. SSH to VM2
ssh grp06admin@20.42.48.79

# 5. Update Nginx (add /admin location block)
# 6. Reload: sudo systemctl reload nginx

# 7. Test: https://grp06healthapp.eastus.cloudapp.azure.com/admin
```

---

## ❓ Which option do you want to use?
