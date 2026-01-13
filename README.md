# inVAS Pricing & Payment Gateway Application

A modern, responsive pricing page and payment gateway application built with Next.js 16 and Tailwind CSS. This application integrates with the inVAS third-party payment API to display pricing plans, handle payments, and verify transactions.

## Features

- **Modern Pricing Page**: Display multiple pricing tiers with feature comparisons
- **Flexible Billing**: Monthly and yearly billing options with automatic discount calculations
- **Secure Payment Modal**: Collect payment information with client-side validation
- **Payment Integration**: Direct integration with inVAS Payment Gateway API
- **Transaction Verification**: Verify payment status in real-time
- **Responsive Design**: Mobile-first design with full responsive support
- **Blue & Green Branding**: Custom color scheme matching inVAS brand identity
- **Error Handling**: Graceful fallbacks and comprehensive error messages
- **Demo Mode**: Falls back to demo data if API is unavailable

## Technology Stack

- **Frontend**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 with custom design tokens
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **API Integration**: Fetch API with error handling
- **Type Safety**: TypeScript

## Project Structure

```
├── app/
│   ├── layout.tsx                 # Root layout with metadata
│   ├── page.tsx                   # Home page with pricing section
│   ├── globals.css                # Global styles and design tokens
│   └── success/
│       ├── page.tsx               # Payment success/verification page
│       └── loading.tsx            # Loading state
├── components/
│   ├── header.tsx                 # Navigation header
│   ├── footer.tsx                 # Footer with links
│   ├── pricing-page.tsx           # Main pricing section
│   ├── pricing-card.tsx           # Individual pricing tier card
│   ├── pricing-toggle.tsx         # Monthly/yearly toggle
│   ├── payment-modal.tsx          # Payment form modal
│   └── ui/                        # shadcn/ui components
├── lib/
│   ├── api-client.ts              # API client functions
│   └── utils.ts                   # Utility functions
└── public/                        # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Install dependencies** (if using locally):
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   ```

3. **Update `.env.local` with your inVAS API credentials**:
   ```env
   NEXT_PUBLIC_API_URL=https://your-invas-api.com/api
   NEXT_PUBLIC_API_KEY=your-api-key-here
   ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Deploy

Build for production:

```bash
npm run build
npm start
```

## API Integration

### Base URL Configuration

The application communicates with the inVAS Payment Gateway API using the following environment variables:

- `NEXT_PUBLIC_API_URL`: Base URL of the inVAS API
- `NEXT_PUBLIC_API_KEY`: API key for authentication

All API requests include the `X-API-Key` header for authentication.

### API Endpoints

#### 1. Get All Plans
Fetch available pricing plans from the API.

```
GET /plans
```

**Headers**: 
```
X-API-Key: {API_KEY}
Content-Type: application/json
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "plan_id",
      "externalPlanId": "plan_basic",
      "name": "Starter",
      "amount": 5900,
      "currency": "USD",
      "duration": 30,
      "features": {
        "PhoneBooks Manipulation": "✓",
        "Bot Sessions": "1,000"
      },
      "isActive": true
    }
  ]
}
```

#### 2. Initiate Payment
Create a new payment transaction.

```
POST /payments/initiate
```

**Headers**:
```
X-API-Key: {API_KEY}
Content-Type: application/json
```

**Body**:
```json
{
  "userId": "user_123",
  "planId": "plan_basic",
  "metadata": {
    "source": "web",
    "planName": "Starter",
    "amount": 5900
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "transactionId": "txn_abc123",
    "paymentUrl": "https://payment-provider.com/...",
    "status": "pending"
  },
  "message": "Payment initiated successfully"
}
```

#### 3. Verify Payment
Check the status of a payment transaction.

```
GET /payments/verify/{transactionId}
```

**Headers**:
```
X-API-Key: {API_KEY}
Content-Type: application/json
```

**Response**:
```json
{
  "success": true,
  "data": {
    "transactionId": "txn_abc123",
    "status": "completed",
    "amount": 5900,
    "planId": "plan_basic"
  },
  "message": "Payment verified successfully"
}
```

## Application Flow

### 1. Pricing Page
- Loads available plans from `/plans` endpoint
- Displays three pricing tiers (Starter, Growth, Premium)
- Supports monthly/yearly billing with 17% yearly discount
- Shows error message if API is unavailable (uses demo data)

### 2. Plan Selection
- User clicks "Select Plan" button
- Plan details are passed to payment modal
- Modal opens with pre-filled plan information

### 3. Payment Processing
- User enters contact and payment information
- `POST /payments/initiate` is called with user details and plan ID
- Transaction ID is received and stored
- User is redirected to success page with transaction ID

### 4. Payment Verification
- Success page calls `GET /payments/verify/{transactionId}`
- Payment status is verified with the API
- Confirmation details are displayed to user
- User can navigate to dashboard or return to pricing

## Component Documentation

### PricingPage
Main pricing section component that manages plan fetching and selection.

**Key Features**:
- Fetches plans from API on mount
- Handles loading and error states
- Calculates yearly pricing with 17% discount
- Manages payment modal visibility

### PricingCard
Individual pricing tier card component.

**Props**:
- `plan`: Plan data object
- `isPopular`: Boolean to highlight popular plan
- `onSelect`: Callback when plan is selected
- `billingPeriod`: Current billing period ("monthly" or "yearly")
- `yearlyPrice`: Pre-calculated yearly price

### PaymentModal
Modal component for payment form.

**Features**:
- Collects customer email, name, and payment details
- Calls API to initiate payment
- Shows loading and error states
- Calls success callback with transaction ID

### PricingToggle
Toggle component for monthly/yearly billing period selection.

**Props**:
- `billingPeriod`: Current billing period
- `onToggle`: Callback to change billing period

## Design & Styling

### Color Scheme
The application uses a custom color scheme based on inVAS branding:

- **Primary**: Dark navy blue (`oklch(0.15 0 240)`)
- **Accent**: Vibrant green (`oklch(0.55 0.25 142)`)
- **Background**: Light neutral (`oklch(0.98 0 0)`)
- **Card**: White (`oklch(1 0 0)`)

### Design Tokens
All colors are defined as CSS custom properties in `app/globals.css` for easy theming and consistency.

### Responsive Design
- Mobile-first approach
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px)
- All components fully responsive

## Error Handling

The application includes comprehensive error handling:

1. **API Unavailable**: Falls back to demo data with warning message
2. **Network Errors**: Shows user-friendly error messages
3. **Invalid Transaction**: Displays error on success page with retry option
4. **Form Validation**: Client-side validation for payment form

## Debugging

The application includes debug logging for troubleshooting:

```javascript
console.log("invas Error message:", error)
```

All logs are prefixed with `invas` for easy filtering in browser console.

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Required
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_API_KEY=your-api-key-here

# Optional
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

**Important**: 
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Never commit `.env.local` to version control
- Use `.env.example` as a template

## Deployment

### Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
1. Build the application: `npm run build`
2. Set environment variables in deployment platform
3. Start the application: `npm start`

## Testing

### Manual Testing Checklist
- [ ] Plans load correctly from API
- [ ] Monthly/yearly toggle works correctly
- [ ] Yearly discount is calculated (17%)
- [ ] Payment modal opens when plan is selected
- [ ] Payment form accepts input
- [ ] Payment initiation is successful
- [ ] Success page displays transaction ID
- [ ] Payment verification works
- [ ] Error states display correctly
- [ ] Mobile responsiveness is correct

### API Testing
Use the provided Postman collection to test API endpoints:
1. Set `base_url` variable to your API URL
2. Set `api_key` variable to your API key
3. Run test requests for each endpoint

## Troubleshooting

### Plans Not Loading
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify `NEXT_PUBLIC_API_KEY` is valid
- Check browser console for error messages
- Ensure API is responding with correct format

### Payment Initiation Fails
- Verify API key has payment permissions
- Check request body format matches API requirements
- Look for error message in response
- Check API logs on server side

### Transaction Verification Fails
- Ensure transaction ID is correct
- Verify API endpoint `/payments/verify/` exists
- Check if transaction exists in database
- Confirm API key has verification permissions

### CORS Issues
- Configure CORS headers on inVAS API
- Allow origin for your domain
- Add `X-API-Key` to allowed headers

## API Client Usage

The `lib/api-client.ts` file exports helper functions for API communication:

```typescript
import { fetchPlans, initiatePayment, verifyPayment } from "@/lib/api-client"

// Fetch plans
const plans = await fetchPlans()

// Initiate payment
const response = await initiatePayment(userId, planId, metadata)

// Verify payment
const result = await verifyPayment(transactionId)
```

## Performance Optimization

- Server-side plan fetching where possible
- Memoization of expensive computations
- Lazy loading of non-critical components
- Optimized bundle size with tree-shaking
- CDN-optimized images and assets

## Security Considerations

- API key stored in environment variables
- HTTPS recommended for production
- Payment information should be handled server-side in production
- CORS properly configured
- Input validation on all forms
- No sensitive data logged in console (production)

## Support & Documentation

For issues or questions:
1. Check the troubleshooting section
2. Review API integration guide
3. Check browser console for error messages
4. Review API server logs
5. Contact inVAS support team

## License

This project is part of the inVAS platform. All rights reserved.

## Changelog

### v1.0.0 (Initial Release)
- Pricing page with three tiers
- Monthly/yearly billing toggle
- Payment modal integration
- Payment verification
- Responsive design
- API integration with fallback demo data
