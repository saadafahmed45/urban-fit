# URBAN FIT — Minimalist Premium Streetwear Ecommerce

A full-stack modern streetwear and hoodie ecommerce platform built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **MongoDB Atlas**, and **NextAuth.js**.

---

## 🌟 Key Features

- **Storefront & Catalog**:
  - Curated streetwear collections (Oversized Hoodies, Heavyweight Boxy Tees, Tactical Bottoms, Accessories).
  - Rich product filtering (Category, Size, Color, Price Range, Sort, Drop badges).
  - High-performance Product Details page with dynamic size/color variant stock selection, size guide dialog, and review submission.
- **Cart & Wishlist**:
  - Zustand-powered client store with local storage persistence and SSR hydration guards.
  - Interactive slide-over cart drawer and dedicated `/cart` page with real-time promo code validation.
- **Checkout & Orders**:
  - Express checkout flow with Cash on Delivery (COD) and Card simulation.
  - Order confirmation, tracking status, and member order history.
- **Customer Authentication**:
  - Powered by **NextAuth.js** with `CredentialsProvider` and optional Google OAuth.
  - Member dashboard with orders, wishlist, and shipping addresses.
- **Admin Dashboard**:
  - Comprehensive admin control panel (`/admin/dashboard`).
  - Catalog management: Create and edit products with variant stock management.
  - Category taxonomy manager with **direct device file/image upload** (drag & drop / file picker).
  - Order fulfillment management: update status (`pending`, `processing`, `shipped`, `delivered`).
  - Coupon engine: percentage and fixed discount codes with expiration and minimum spends.
  - Hero banner slider and Lookbook outfit manager with hotspot integration.
  - Store settings: configure currency, shipping fee, free shipping threshold, and support contacts.
- **Offline & Local Fail-safe**:
  - Built-in fallback catalog data so the storefront and admin panel are 100% testable out-of-the-box even without an active MongoDB connection.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 (JavaScript / JSX)
- **Styling**: Tailwind CSS v4 (`@theme` tokens in `app/globals.css`), Radix UI headless primitives, Lucide React icons
- **Animations & Carousel**: Framer Motion, Swiper.js
- **State Management**: Zustand + Persist middleware
- **Database**: MongoDB Native Driver (`mongodb` singleton)
- **Authentication**: NextAuth.js (Customers) + Jose JWT & bcryptjs (Admin)
- **Media**: Local device uploads (`public/uploads`) + Cloudinary support

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/saadafahmed45/urban-fit.git
cd urban-fit
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy `.env.example` to `.env.local` and configure your credentials:
```bash
cp .env.example .env.local
```

```env
# MongoDB Atlas
MONGODB_URI=mongodb://localhost:27017/urban_fit
MONGODB_DB=urban_fit

# NextAuth.js Customer Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key

# Admin JWT Secret
JWT_SECRET=your_admin_jwt_secret_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Default Login Credentials

### 👑 Admin Panel
- **URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: `admin@urbanfit.style`
- **Password**: `admin123456`

### 👤 Customer Account
- **URL**: [http://localhost:3000/login](http://localhost:3000/login)
- **Email**: `customer@urbanfit.style`
- **Password**: `customer123`

---

## 📜 Available Scripts

- `npm run dev`: Start Next.js development server
- `npm run build`: Build production application
- `npm run start`: Start production server
- `npm run seed`: Seed MongoDB with streetwear catalog, categories, banners, lookbook, and default accounts
- `npm run create-admin`: CLI utility to create custom admin accounts
- `npm run create-indexes`: Create performance and unique indexes in MongoDB
