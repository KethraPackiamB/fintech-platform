# FinFlow Backend

REST API for the FinFlow Fintech Dashboard — built with **Node.js**, **Express.js**, and **MongoDB Atlas**.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Fill in your MONGO_URI and JWT secrets

# 3. Run in development
npm run dev

# 4. Run in production
npm start
```

## Base URL
`/api/v1`

## Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /auth/register | — | Register user |
| POST | /auth/login | — | Login |
| GET | /auth/me | User | Get profile |
| POST | /auth/logout | User | Logout |
| POST | /loans | User | Apply for loan |
| GET | /loans | User | My loans |
| GET | /loans/:id | User | Loan detail |
| POST | /payments | User | Make payment |
| GET | /payments | User | My payments |
| POST | /kyc | User | Submit KYC |
| GET | /kyc | User | My KYC status |
| GET | /credit-score | User | My credit score |
| GET | /analytics/dashboard | User | Dashboard stats |
| GET | /admin/loans | Admin | All loans |
| PATCH | /admin/loans/:id/status | Admin | Update loan status |
| GET | /admin/payments | Admin | All payments |
| PATCH | /admin/kyc/:userId/verify | Admin | Verify KYC |
| GET | /fraud | Admin | Fraud alerts |
| PATCH | /fraud/:id | Admin | Resolve alert |
