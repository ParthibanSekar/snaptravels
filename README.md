# SnapTravels - Modern Travel Booking Platform

A comprehensive travel booking platform with a futuristic, immersive UI that reimagines the travel booking experience.

## 🚀 Features

- **Modern UI/UX**: Glassmorphism effects, animated backgrounds, floating particles
- **Multi-Modal Booking**: Flights, hotels, trains, and buses in one platform
- **Real-Time Search**: Live flight data with comprehensive Indian domestic routes
- **User Authentication**: Secure login with Replit Auth integration
- **Responsive Design**: Mobile-first approach with seamless device compatibility
- **Advanced Visual Effects**: Immersive animations and modern aesthetic

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS, Wouter Router
- **Backend**: Express.js, Node.js, PostgreSQL
- **Database**: Drizzle ORM with Neon PostgreSQL
- **UI Components**: Radix UI, shadcn/ui, Lucide Icons
- **State Management**: TanStack Query (React Query)
- **Authentication**: Replit Auth with OpenID Connect

## 🎨 Design Philosophy

SnapTravels breaks away from traditional booking website designs with:
- Dark immersive theme with glassmorphism effects
- Floating particle animations and gradient backgrounds
- Space Grotesk typography for modern appeal
- Enhanced contrast and accessibility
- Smooth animations and hover effects

## 🏗 Project Structure

```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
├── server/                # Express.js backend
│   ├── routes.ts          # API route handlers
│   ├── storage.ts         # Database operations
│   └── replitAuth.ts      # Authentication logic
├── shared/                # Shared types and schemas
└── components.json        # UI component configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Replit Auth configuration

### Installation

1. Clone the repository
```bash
git clone https://github.com/ParthibanSekar/snaptravels.git
cd snaptravels
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Create .env file with:
DATABASE_URL=your_postgresql_url
SESSION_SECRET=your_session_secret
REPL_ID=your_repl_id
REPLIT_DOMAINS=your_domain
```

4. Start development server
```bash
npm run dev
```

## 🛫 Flight Search

The platform includes a fully functional flight search system with:
- Real airline data (IndiGo, Air India, SpiceJet, Vistara)
- Comprehensive Indian domestic routes
- Real-time availability and pricing
- Advanced filtering and sorting options

## 🎯 Key Features Implemented

- ✅ Modern glassmorphism UI with dark theme
- ✅ Functional flight search with real data
- ✅ User authentication system
- ✅ PostgreSQL database integration
- ✅ Responsive mobile-first design
- ✅ Advanced visual effects and animations
- ✅ Type-safe API with TypeScript
- ✅ Real-time search capabilities

## 🚀 Deployment

### Replit Deployments (Recommended)
1. Push code to GitHub
2. Use Replit Deploy button
3. Configure environment variables
4. Deploy automatically

### Other Platforms
- Vercel: Connect GitHub repo, set build commands
- Railway: One-click PostgreSQL + app deployment
- DigitalOcean: App Platform with database

## 🛣 Roadmap

- [ ] Hotel booking integration
- [ ] Train and bus booking
- [ ] Payment processing with Stripe
- [ ] Email notifications
- [ ] Travel itinerary management
- [ ] Mobile app development

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎨 Design Credits

UI/UX inspired by modern travel platforms with a focus on immersive user experience and futuristic aesthetics.

---

**SnapTravels** - Reimagining travel booking with modern technology and design.