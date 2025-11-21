# Azure DNS Configuration for Admin Subdomain

## Step-by-Step Guide to Add admin.grp06healthapp.eastus.cloudapp.azure.com

### Option 1: Using Azure DNS Zone (Recommended)

#### Step 1: Create DNS Zone (If not exists)

1. Go to Azure Portal → Search "DNS zones"
2. If `grp06healthapp.eastus.cloudapp.azure.com` DNS zone doesn't exist:
   - Click "+ Create"
   - Resource group: `MIT572-Group06`
   - Name: `grp06healthapp.eastus.cloudapp.azure.com`
   - Click "Review + Create"

#### Step 2: Add A Record for Admin Subdomain

1. Go to Azure Portal → DNS zones → `grp06healthapp.eastus.cloudapp.azure.com`
2. Click "+ Record set"
3. Configure:
   - **Name**: `admin`
   - **Type**: `A`
   - **TTL**: `1` Hour
   - **IP address**: `20.42.48.79`
4. Click "OK"

#### Step 3: Verify DNS Propagation

Wait 5-10 minutes, then test:

```bash
# On your Mac
nslookup admin.grp06healthapp.eastus.cloudapp.azure.com

# Should return:
# Name: admin.grp06healthapp.eastus.cloudapp.azure.com
# Address: 20.42.48.79
```

---

### Option 2: Using Azure Public IP DNS Label (Simpler but Limited)

Since VM2 already has the DNS label `grp06healthapp`, we can't add a subdomain directly.
You would need a second Public IP for a subdomain, which requires:

1. Create new Public IP
2. Assign DNS label: `admin-grp06healthapp`
3. Configure network rules
4. This becomes: `admin-grp06healthapp.eastus.cloudapp.azure.com`

**Note:** This is more complex. Use Option 1 (DNS Zone) instead.

---

### Option 3: Path-Based (Easiest, No DNS Changes Needed)

Instead of subdomain, use: `https://grp06healthapp.eastus.cloudapp.azure.com/admin`

This requires:
- Update frontend build with `base: '/admin/'` in vite.config.js
- Update Nginx to serve admin at `/admin` path
- Use existing SSL certificate (already configured)

**This is the SIMPLEST option if Azure DNS Zone doesn't exist!**

---

## Which Option Should You Use?

### ✅ Option 1 (DNS Zone): Best for production
- Professional subdomain: `admin.grp06healthapp.eastus.cloudapp.azure.com`
- Separate SSL certificate
- Clean separation of admin and patient/doctor portals

### ✅ Option 3 (Path-Based): Quickest to implement
- URL: `https://grp06healthapp.eastus.cloudapp.azure.com/admin`
- Uses existing SSL certificate
- No DNS configuration needed
- Can implement RIGHT NOW

---

## Let me know which option you prefer!
