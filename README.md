# Headlight

Secure portal for healthcare communication between medical providers and patients.

## Features

### 🔐 Secure Authentication
- Role-based access for providers and patients
- Secure login system

### 💬 Provider-Patient Messaging
- Real-time secure messaging between healthcare providers and patients
- Message read receipts
- Conversation history organized by date
- HIPAA-compliant communication design

### 📋 Form Management
- **For Providers:**
  - Create custom intake forms with a visual form builder
  - Multiple field types: text, email, phone, date, textarea, select, checkbox, radio
  - Mark fields as required or optional
  - Send forms to patients
  - Preview forms before sending

- **For Patients:**
  - View and complete assigned forms
  - Submit responses securely

### 💳 Secure Payment Processing
- **PCI DSS Compliant:** Credit card data is handled securely through Stripe
- Credit card information never touches our servers
- Providers can request payments from patients
- Patients can view and pay outstanding balances
- Payment status tracking (pending, completed, refunded)

## Tech Stack

- **Frontend:** Next.js 16 with React 19 and TypeScript
- **Styling:** Tailwind CSS 4
- **Payment Processing:** Stripe (for secure credit card handling)
- **Testing:** Jest with React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/MatthewLairdHeadlight/Headlight.git
cd Headlight

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Stripe Configuration (for payment processing)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Demo Accounts

For testing purposes, use these demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Provider | dr.smith@clinic.com | any |
| Patient | john.doe@email.com | any |

## Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint
```

## Security Features

1. **Payment Security:** All credit card processing is handled by Stripe, a PCI Level 1 certified payment processor. Card details are tokenized and never stored on our servers.

2. **Secure Communication:** The portal is designed with HIPAA compliance in mind for healthcare communications.

3. **Role-Based Access:** Providers and patients have different views and permissions within the application.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/
│   ├── ui/                 # Reusable UI components (Button, Input, Card, etc.)
│   ├── messaging/          # Messaging-related components
│   ├── forms/              # Form builder and renderer components
│   └── payments/           # Payment-related components
├── lib/                    # Utility functions and stores
│   ├── store.ts            # In-memory data store (for demo)
│   └── stripe.ts           # Stripe integration helpers
├── types/                  # TypeScript type definitions
└── __tests__/              # Test files
```

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
