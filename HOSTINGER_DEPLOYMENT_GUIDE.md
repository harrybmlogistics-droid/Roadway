# 🌐 Complete Hostinger Deployment Guide
### Roadway Logistics Group LLC Web Platform

This guide walks you through deploying the **Roadway Logistics Group LLC** web platform to **Hostinger**. Hostinger offers several hosting types — choose the option below that matches your plan:

| Hosting Plan | Best Option | Setup Time |
| :--- | :--- | :--- |
| **Hostinger Business / Cloud / VPS** (with Node.js) | **Option 1: Node.js Application** | ~5 minutes |
| **Hostinger Premium / Single Shared Web Hosting** | **Option 2: File Manager Static Upload** | ~3 minutes |
| **Hostinger VPS (Ubuntu / Debian)** | **Option 3: PM2 + Nginx** | ~10 minutes |

---

## 🚀 Option 1: Hostinger Node.js Application (Recommended)

This option runs both the **Express API backend** and serves the **React frontend** from a single instance on your custom domain with zero CORS setup needed.

### Step 1: Open the Node.js Manager in hPanel
1. Log into your [Hostinger hPanel](https://hpanel.hostinger.com/).
2. Select your website and navigate to **Advanced** > **Node.js** (or search `Node.js` in the hPanel search bar).

### Step 2: Configure the Node.js Application
Click **Create Application** (or **Setup Node.js**) and enter:
* **Node.js Version:** `20.x` (or `18.x`)
* **Application Mode:** `Production`
* **Application Root:** `/home/uXXXXX/public_html` (or create a subfolder like `backend`)
* **Application Startup File:** `server.js`
* **Application URL:** `https://yourdomain.com` (select your primary domain)

### Step 3: Upload the Backend Files
Choose either **Git Auto-Deploy** or **File Manager**:

#### Method A: Via Hostinger File Manager (Quickest)
1. In hPanel, open **Files** > **File Manager**.
2. Go to your Application Root folder (e.g., `public_html`).
3. Upload `hostinger/hostinger-backend.zip` (located in this repository).
4. Right-click `hostinger-backend.zip` and select **Extract**.
5. Confirm that `server.js`, `package.json`, `data/`, and `public/` are visible in the folder.

#### Method B: Via Git in Hostinger
1. In hPanel, go to **Advanced** > **Git**.
2. Paste your repository URL: `https://github.com/YOUR_USERNAME/roadway-logistics-group.git`.
3. Set the branch to `main` and target folder to `public_html`.
4. Click **Create** > **Deploy**.

### Step 4: Install Dependencies & Run
1. Return to the **Node.js** manager in hPanel.
2. Click the **NPM Install** button to automatically install dependencies from `package.json`.
3. Click **Start Application** (or **Restart Application**).
4. Visit `https://yourdomain.com` — your complete full-stack website is live!

---

## 📁 Option 2: Hostinger Static Web Hosting (File Manager Upload)

If your Hostinger plan does not include the Node.js feature, you can host the frontend directly as a high-speed static website.

### Step 1: Locate the Pre-Built Package
In this repository, find the file:
```
roadway-logistics-group/hostinger/hostinger-public_html.zip
```
*(This zip contains the optimized production build of the React app along with the Apache/LiteSpeed `.htaccess` file).*

### Step 2: Upload to Hostinger File Manager
1. Log into **Hostinger hPanel** > **Files** > **File Manager**.
2. Open the **`public_html`** directory.
3. Click the **Upload** button (top right) and select `hostinger-public_html.zip`.
4. Right-click the uploaded zip file and select **Extract**.
5. Verify that `index.html`, `assets/`, and `.htaccess` are now inside `public_html`.
6. Delete the uploaded `.zip` file to keep your storage clean.

### Step 3: Verify the `.htaccess` File
Hostinger uses LiteSpeed Web Server, which reads `.htaccess`. Make sure `.htaccess` is present in `public_html`. This ensures that refreshing deep pages (like `/dispatch` or `/admin`) routes to `index.html` rather than throwing a 404 error.

---

## 🖥️ Option 3: Hostinger VPS (Nginx + PM2)

If you are using a Hostinger VPS (Ubuntu 22.04 or 24.04):

### Step 1: Connect to VPS via SSH
```bash
ssh root@YOUR_SERVER_IP
```

### Step 2: Install Node.js & PM2
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx git
sudo npm install -g pm2
```

### Step 3: Clone & Setup
```bash
git clone https://github.com/YOUR_USERNAME/roadway-logistics-group.git /var/www/roadway
cd /var/www/roadway/backend
npm install --production
```

### Step 4: Start with PM2
```bash
pm2 start server.js --name "rlg-platform"
pm2 save
pm2 startup
```

### Step 5: Configure Nginx
Create `/etc/nginx/sites-available/roadway`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Enable site and install free SSL with Certbot:
```bash
sudo ln -s /etc/nginx/sites-available/roadway /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## ⚙️ Environment Variables Configuration

To receive real email alerts when carriers or drivers submit forms:

In `backend/.env` (or Hostinger Node.js Environment Settings):
```env
PORT=5000
NODE_ENV=production

# Email SMTP Credentials (e.g. Gmail App Password or Hostinger Titan Email)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=info@roadwaylogisticsgroup.com
EMAIL_PASS=your-16-character-app-password

# Notification Target
NOTIFY_EMAIL=info@roadwaylogisticsgroup.com

# Company info
COMPANY_PHONE=+1-682-978-8641
COMPANY_NAME=Roadway Logistics Group LLC
```

> [!TIP]
> **Using Gmail:** Go to Google Account > Security > 2-Step Verification > **App Passwords**. Generate an App Password named "Hostinger Website" and paste it into `EMAIL_PASS`.

---

## 🔒 Free SSL Activation on Hostinger

1. In hPanel, go to **Security** > **SSL**.
2. Select your domain.
3. Click **Install SSL** (Hostinger installs and auto-renews Let's Encrypt SSL certificates automatically).
4. Toggle on **Force HTTPS** to ensure all traffic is encrypted.

---

## ✅ Post-Deployment Verification Checklist

Once deployed, test the following:
* [ ] **Homepage loads:** Check logo monogram, contact phone `+1-682-978-8641`, and email.
* [ ] **14 Equipment Cards:** Inspect rates ($250/wk vs $350/wk).
* [ ] **Savings Calculator:** Move sliders to ensure live calculation works.
* [ ] **DOT Lookup:** Search carrier `3891420` to verify live safety verification.
* [ ] **Contact Form:** Submit a test message and verify confirmation toast.
* [ ] **Admin Portal:** Navigate to the Admin Portal in the top bar to inspect stored records.
