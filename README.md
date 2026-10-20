# 🚛 Roadway Logistics Group LLC (RLG) — Web Platform

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3.4-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.11-38B2AC.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.19.2-black.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

> Professional Dispatch & Trucking Business Services — Delaware Registered LLC (Est. 2021).  
> A high-performance full-stack web application designed for motor carriers, owner-operators, and fleet managers.

---

## 🌟 Key Features

* **Equipment Rates (14 Profiles):** Transparent flat pricing ($250/wk semi vs $350/wk box & hotshot) for Dry Van, Reefer, Flatbed, Stepdeck, Lowboy, RGN, Conestoga, Tanker, Hotshot 40ft, Box Truck 26ft, Power Only, Auto Hauler, Dump Truck, and Sprinter.
* **8 Core Services Grid:**
  1. 24/7 Dispatch Service ($250/wk or $350/wk flat fee)
  2. MC Authority Setup ($250 one-time)
  3. Factoring Assistance ($120 one-time)
  4. Compliance & Permits (From $150/mo)
  5. Accounting & Bookkeeping (From $150)
  6. Driver Hiring ($500 solo / $750 team placement)
  7. Logbook Management (From $100)
  8. Trailer Rental ($700–$1,200/mo)
* **Website Design Package ($274):** Turnkey 5-page custom trucking website booking modal with fast 48h turnaround.
* **Interactive Calculators:**
  * **Commission vs Flat Rate Savings:** Real-time calculation of weekly & yearly profit preserved vs 5%–10% broker dispatch commission.
  * **IFTA Fuel Tax Calculator:** Calculates gallons consumed, fuel burn rate, and net credit/tax due.
  * **RPM / Deadhead Calculator:** Calculates true gross per mile factoring in empty miles.
* **USDOT / MC Carrier Lookup:** Live safety rating, insurance verification, and active authority checker.
* **Driver Recruitment Portal:** Browse active jobs and submit 1-click driver applications.
* **Admin Inspection Portal:** Built-in dashboard to monitor real-time form submissions, stats, and applicant details.

---

## 📁 Repository Structure

```
roadway-logistics-group/
├── frontend/                     # React 19 + Vite + Tailwind CSS v4
│   ├── src/
│   │   ├── App.jsx               # Primary application UI & business logic
│   │   ├── api.js                # Centralized backend API client
│   │   ├── index.jsx             # React DOM root entry
│   │   └── index.css             # Tailwind base & custom animations
│   ├── public/                   # Static assets & .htaccess
│   ├── index.html                # HTML entry
│   ├── vite.config.mjs           # Vite config & dev API reverse proxy
│   └── package.json
├── backend/                      # Node.js + Express REST API
│   ├── server.js                 # API routes, CSP security, & static host
│   ├── db.js                     # Zero-dependency persistent JSON store
│   ├── mailer.js                 # Nodemailer with dev preview & SMTP
│   ├── package.json
│   ├── .env.example              # Template environment variables
│   ├── data/                     # Submissions store (rlg-db.json)
│   └── public/                   # Pre-built production frontend bundle
├── hostinger/                    # Pre-packaged 1-click upload zips for Hostinger
│   ├── hostinger-public_html.zip # For Hostinger Shared / Static Hosting
│   └── hostinger-backend.zip     # For Hostinger Node.js Application Manager
├── ecosystem.config.js           # PM2 configuration for Hostinger VPS / Cloud
├── package.json                  # Root runner & unified scripts
├── .gitignore
├── HOSTINGER_DEPLOYMENT_GUIDE.md # Step-by-step Hostinger hosting instructions
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
* **Node.js** v18+ or v20+ installed
* **npm** or **yarn**

### 2. Installation
Clone the repository and install dependencies:
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/roadway-logistics-group.git
cd roadway-logistics-group

# Install dependencies for both frontend and backend
npm run install:all
```

### 3. Run Locally
Start the backend API server:
```bash
cd backend
npm start
# Runs on http://localhost:5000
```

In a separate terminal, start the Vite frontend:
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000 (proxies /api to http://localhost:5000)
```

Visit **`http://localhost:3000`** in your browser.

---

## 📤 Push to GitHub

1. Create a new empty repository on [GitHub](https://github.com/new) named `roadway-logistics-group`.
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit: Roadway Logistics Group full-stack platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/roadway-logistics-group.git
git push -u origin main
```

---

## 🌐 Hostinger Deployment

Deploying on Hostinger takes under 5 minutes:

* **Option A (Hostinger Node.js Application — Recommended):** Deploy `backend/` using Hostinger hPanel's Node.js selector. The backend automatically serves both the API and the React frontend on your domain.
* **Option B (Hostinger Static Web Hosting):** Upload `hostinger/hostinger-public_html.zip` directly into your Hostinger `public_html` directory via File Manager.
* **Option C (Hostinger VPS / Cloud):** Deploy using PM2 and Nginx via `ecosystem.config.js`.

👉 See **[HOSTINGER_DEPLOYMENT_GUIDE.md](./HOSTINGER_DEPLOYMENT_GUIDE.md)** for detailed, step-by-step instructions with screenshots.

---

## 📧 Support & Contact

* **Company:** Roadway Logistics Group LLC
* **Phone:** +1-682-978-8641
* **Email:** info@roadwaylogisticsgroup.com
* **Address:** 8 The Green STE B, Dover, DE 19901
