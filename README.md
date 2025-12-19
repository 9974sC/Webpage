# Ascendia - Production-Ready Financial Platform

Production-ready financial platform for the Polish market with React frontend, Node.js backend, PostgreSQL database, and full authentication system.

## Features

- **Frontend**: React + TypeScript + React Router + i18n (PL/EN)
- **Backend**: Node.js + Express + Prisma ORM + PostgreSQL
- **Authentication**: Session-based with secure HTTP-only cookies, bcrypt password hashing
- **Role-Based Access**: USER and ADMIN roles
- **Admin Panel**: Full CRUD access to users, loans, payments, audit logs
- **Loan Calculator**: Interactive loan calculation and application
- **Payments**: Payment processing (mocked but realistic)
- **Support**: Support messages and chatbot (stubbed)
- **GDPR/RODO Compliance**: Audit logging and consent management
- **Design**: Accessible for older users (40-70), modern and calm UI

## Tech Stack

### Backend
- Node.js 18+
- Express.js
- PostgreSQL
- Prisma ORM
- Express Session (cookie-based authentication)
- bcrypt
- TypeScript

### Frontend
- React 18
- TypeScript
- React Router v6
- Vite
- Tailwind CSS
- i18next (PL/EN)
- Zustand (state management)
- React Hook Form + Zod

## Color Palette

- **Primary Text**: `#080708`
- **Background**: `#F2F6D0` (Cream)
- **Primary Action**: `#473BF0` (Indigo)
- **Secondary Accent**: `#A0DDFF` (Light Blue)

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Web2
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ascendia?schema=public"
SESSION_SECRET="your-super-secret-session-key-change-in-production"
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

Run Prisma migrations and seed:

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory (optional):

```env
VITE_API_URL=http://localhost:3001/api
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Demo Accounts

### Admin Account
- **Email**: `admin@ascendia.pl`
- **Password**: `Admin#1234`

### User Accounts
- **Email**: `jan.kowalski@demo.pl`
- **Password**: `User#1234`

- **Email**: `anna.nowak@demo.pl`
- **Password**: `User#1234`

**Note**: All passwords are encrypted using bcrypt in the database. Plaintext passwords are shown here for demo purposes only.

## Project Structure

```
.
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── seed.ts              # Seed script
│   ├── src/
│   │   ├── middleware/          # Auth, error handling, audit
│   │   ├── routes/              # API routes
│   │   └── server.ts            # Express server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── routes/          # React Router pages
│   │   ├── components/
│   │   │   ├── ui/              # UI components
│   │   │   └── layout/          # Layout components
│   │   ├── i18n/                # i18n configuration
│   │   ├── services/            # API services
│   │   ├── store/               # Zustand store
│   │   └── styles/              # Global styles
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (creates session)
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout (destroys session)

### Loans
- `GET /api/loans/my-loans` - Get user's loans
- `POST /api/loans/calculate` - Calculate loan payment
- `POST /api/loans/apply` - Apply for loan

### Payments
- `GET /api/payments/upcoming` - Get upcoming payments
- `GET /api/payments/history` - Get payment history
- `POST /api/payments/:id/pay` - Process payment

### Admin (requires ADMIN role)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user details
- `GET /api/admin/loans` - Get all loans
- `PATCH /api/admin/loans/:id` - Update loan status
- `GET /api/admin/payments` - Get all payments
- `GET /api/admin/documents` - Get all documents
- `GET /api/admin/audit-logs` - Get audit logs

### Support
- `GET /api/support/messages` - Get user's messages
- `POST /api/support/messages` - Create support message
- `POST /api/support/chatbot` - Chatbot endpoint (stubbed)

## Database Schema

- **User**: Users with roles (USER/ADMIN)
- **Loan**: Loan applications and active loans
- **Payment**: Payment schedule and history
- **Document**: User-uploaded documents
- **SupportMessage**: Support tickets
- **AuditLog**: GDPR/RODO compliance logs

## Security Features

- bcrypt password hashing (12 rounds)
- Session-based authentication with secure HTTP-only cookies
- Session expiry (7 days)
- Role-based route protection
- Audit logging for admin actions
- Input validation with Zod
- CORS configuration with credentials support

## GDPR/RODO Compliance

- Audit logging for all admin actions
- User consent management
- Data access rights
- Privacy policy information
- Secure data handling

## Development

### Backend Development

```bash
cd backend
npm run dev          # Start with hot reload
npm run build        # Build for production
npm start            # Run production build
npx prisma studio    # Open Prisma Studio
```

### Frontend Development

```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Production Deployment

1. Set environment variables in production
2. Build both frontend and backend
3. Run database migrations
4. Seed initial data (optional)
5. Start servers with process manager (PM2, etc.)

## Notes

- Payments are mocked but realistic (uses token validation)
- Chatbot uses stubbed responses
- All sensitive operations are logged in audit logs
- Design optimized for users aged 40-70
- Full i18n support (Polish/English)

## License

Copyright 2025 Ascendia Sp. z o.o.

# my-app
