# Biblio

A full‑stack e‑commerce platform for buying and selling second‑hand books. Built with the MERN stack, it supports both buyers and sellers with secure authentication, dynamic product listings, cart and order management, image uploads via Cloudinary, and a responsive UI.

## What the site does
- **User Actions**: Enables users to register/login, browse books, add items to cart, place orders, and track order status.
- **Seller Actions**: Allows sellers to list books with multiple images, manage their listings, and view orders related to their items.
- **Experience**: Provides reviews on products, advanced filtering and categorization on collections, and a smooth checkout experience.

## Why this site is useful
- **Focused Marketplace**: Creates a focused marketplace for affordable second‑hand books.
- **Simplified Selling**: Quick listing with image uploads and category/condition metadata.
- **Modern Stack**: Scales on a modern stack with attention to performance, security, and UX.

## Tech stack

### Frontend
- React 18
- React Router
- Axios
- Tailwind CSS
- Vite
- Styled‑Components
- React Toastify

### Backend
- Node.js
- Express
- JWT auth
- Multer
- Cloudinary
- Mongoose

### Database
- MongoDB

### Other
- Nodemailer (password reset)
- Razorpay (prepared)
- CORS

### Deployment
- Vercel (both frontend and backend configs present)

## Features
- **Authentication & Authorization**: JWT‑based login/register, current user fetch, password reset via email code.
- **Product Management**: Seller‑protected product creation with multiple images uploaded to Cloudinary; public product listing; seller‑scoped "My Products" view.
- **Cart**: Per‑user cart storage on backend; fetch and update endpoints; UI cart with totals and checkout.
- **Orders**: Place orders, view user order history, seller/admin view for relevant orders, status updates (e.g., Delivered toggles payment flag), real‑time style status reflected in UI.
- **Reviews**: Add, list, and delete reviews per product.
- **UI/UX**: Responsive layout, search, filtering, related products, latest collections, and user profile pages.

## Project structure

```
backend/
  config/           # MongoDB & Cloudinary setup
  controllers/      # cart, order, product, review, user controllers
  middlewares/      # auth, seller/admin auth, multer, error handling
  models/           # Mongoose models (user, product, review, order)
  routes/           # REST API routes
  server.js         # App bootstrap

frontend/
  src/
    components/     # Reusable UI (Cart, ProductDisplay, SearchBar, etc.)
    pages/          # Pages (Home, Collection, Product, Sell, Orders, Admin)
    context/        # Shop context/state
    styles/         # Tailwind & fonts
  vite.config.js
```

### Notes
- Authenticated routes expect a header `token: <JWT>`.
- Seller/admin routes require additional middleware as implemented.
- Image uploads use Cloudinary with Multer field mapping for up to 4 images per product.

## Deployment
- Contains `vercel.json` in both frontend and backend for deployment on Vercel.
- Ensure environment variables are configured in the hosting platform.