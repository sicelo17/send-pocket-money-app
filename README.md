

# Send Pocket Money App

A web application for Zimbabwean parents to send money to their children studying abroad (UK or South Africa). Built with Next.js, TypeScript, and modern web technologies.



## ✨ Features

### 🔐 Authentication
- **Account Creation**: Sign-up form with name, email, and password
- **User Login**: Secure authentication with credential validation
- **Session Management**: Persistent login state across browser sessions

### 💰 Send Money
- **Amount Input**: USD amount with $1 - $10,000 limits
- **Dynamic Fees**: 10% for GBP (UK), 20% for ZAR (South Africa)
- **Real-time FX Rates**: Live exchange rates from external API
- **Transaction Summary**: Detailed breakdown of fees and final amounts
- **Rounding**: All calculations rounded UP for accuracy

### 📱 Dashboard
- **Overview Statistics**: Total sent, transactions, recipients, fees
- **Current Exchange Rates**: Live GBP and ZAR rates
- **Mock Advertisements**: Carousel with educational and financial services
- **Recent Transactions**: Quick view of latest transfers

### 📊 Transaction History
- **Comprehensive View**: All transactions with pagination
- **Status Tracking**: Pending, completed, and failed states
- **Detailed Information**: Recipient details, amounts, fees, and dates
- **Responsive Design**: Optimized for all device sizes

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit (Zustand alternative)
- **UI Components**: Radix UI + Custom components
- **Form Handling**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Build Tool**: pnpm

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sicelo17/send-pocket-money-app.git
   cd send-pocket-money-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
send-pocket-money-app/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard and transaction pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard-specific components
│   ├── send-money/       # Money transfer components
│   └── ui/               # Base UI components
├── store/                 # Redux store and slices
├── lib/                   # Utilities, types, and validations
├── hooks/                 # Custom React hooks
└── public/                # Static assets
```

## 🔧 Key Design Decisions

### 1. **Authentication & Storage**
- **Choice**: Local Storage with mock authentication
- **Justification**: 
  - Demonstrates state management without backend complexity
  - Persists user sessions across browser reloads
  - Easy to replace with real authentication later
  - No sensitive data stored (passwords are not hashed in mock)

### 2. **State Management**
- **Choice**: Redux Toolkit
- **Justification**:
  - Centralized state for complex app state
  - Predictable state updates
  - Easy debugging with Redux DevTools
  - Scalable for larger applications

### 3. **FX Rates Integration**
- **Choice**: Single API endpoint with data transformation
- **Implementation**:
  ```typescript
  // Transform API response from array of objects to flat structure
  const transformRates = (apiResponse: any[]) => {
    const rates: Record<string, number> = {}
    apiResponse.forEach(item => {
      Object.entries(item).forEach(([currency, rate]) => {
        rates[currency] = rate as number
      })
    })
    return rates
  }
  ```

### 4. **Fee Structure**
- **GBP (UK)**: 10% - Lower fee for developed market
- **ZAR (South Africa)**: 20% - Higher fee for emerging market
- **Scalability**: Fee percentages stored in configuration for easy updates

### 5. **Rounding Strategy**
- **Choice**: Round UP for all calculations
- **Justification**: Ensures recipients never receive less than calculated, maintains trust

## 📱 Responsive Design

### **Mobile-First Approach**
- Responsive grid layouts using Tailwind CSS
- Mobile-optimized navigation with slide-out menu
- Touch-friendly buttons and form inputs
- Adaptive typography and spacing

### **Breakpoint Strategy**
- **Mobile**: < 768px (default)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔒 Security Considerations

### **Input Validation**
- **Zod Schema Validation**: Type-safe form validation
- **XSS Prevention**: React's built-in XSS protection
- **Input Sanitization**: All user inputs validated before processing

### **Mock Security Notes**
- **Current State**: Mock authentication for demonstration
- **Production Ready**: Easy to integrate with real auth providers
- **Best Practices**: Follows security patterns for real applications

## 🚀 Scalability & Future Enhancements

### **Multi-Currency Support**
```typescript
// Easy to add new currencies
const CURRENCY_CONFIG = {
  GBP: { fee: 0.10, country: 'UK', symbol: '£' },
  ZAR: { fee: 0.20, country: 'South Africa', symbol: 'R' },
  EUR: { fee: 0.15, country: 'Germany', symbol: '€' }, // Future
  AUD: { fee: 0.18, country: 'Australia', symbol: 'A$' }, // Future
}
```

### **Payment Method Integration**
- **Current**: Mock transactions
- **Future**: Real payment gateways (Stripe, PayPal)
- **Scalability**: Modular payment provider system

### **Real-Time Updates**
- **Current**: Manual refresh of FX rates
- **Future**: WebSocket connections for live updates
- **Fallback**: Graceful degradation to polling

## 🧪 Testing

### **Manual Testing Checklist**
- [ ] Account creation and login
- [ ] Send money form validation
- [ ] FX rates display and updates
- [ ] Transaction history pagination
- [ ] Mobile responsiveness
- [ ] Accessibility features

### **Browser Compatibility**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 API Documentation

### **FX Rates Endpoint**
```
GET https://68976304250b078c2041c7fc.mockapi.io/api/wiremit/InterviewAPIS
```

**Response Format:**
```json
[
  { "USD": 1 },
  { "GBP": 0.74 },
  { "ZAR": 17.75 },
  { "USDT": 1 }
]
```

**Usage in App:**
- Rates fetched on app initialization
- Auto-refresh every 5 minutes
- Manual refresh available
- Error handling with retry functionality

## 🎯 Component Architecture

### **Data Flow**
```
User Input → Form Validation → State Update → API Call → Store Update → UI Re-render
```

### **Key Components**
- **AuthGuard**: Protects authenticated routes
- **SendMoneyForm**: Handles money transfer logic
- **TransactionHistory**: Displays transaction data with pagination
- **AdsCarousel**: Rotating advertisement display
- **DashboardNav**: Responsive navigation component

## 🚀 Deployment

### **Build for Production**
```bash
pnpm build
pnpm start
```

### **Environment Variables**
```env
NEXT_PUBLIC_API_URL=https://68976304250b078c2041c7fc.mockapi.io
NEXT_PUBLIC_APP_NAME=Send Pocket Money
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is created for the Wiremit Frontend Developer Technical Interview.

## 👨‍💻 Author

Sicelo Sitsha - Frontend Developer

## 🙏 Acknowledgments

- Wiremit team for the technical interview opportunity
- Next.js team for the amazing framework
- Radix UI for accessible component primitives
- Tailwind CSS for the utility-first CSS framework

---

**Note**: This is a demonstration application built for technical interview purposes. In a production environment, additional security measures, error handling, and testing would be implemented.
