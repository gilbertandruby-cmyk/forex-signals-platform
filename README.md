# Forex Volatility Signals Platform

A comprehensive full-stack web application for generating and tracking forex trading signals based on volatility analysis.

## 🎯 Overview

This platform analyzes forex market volatility and generates automated trading signals using technical indicators (RSI, MACD, Bollinger Bands, Moving Averages). Users can track portfolios, manage alerts, and monitor signal performance in real-time.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+ (or use Docker)
- Redis (or use Docker)

### Using Docker Compose (Recommended)

```bash
# Clone repository
git clone https://github.com/gilbertandruby-cmyk/forex-signals-platform.git
cd forex-signals-platform

# Start all services
docker-compose up

# Access applications
Frontend: http://localhost:3000
Backend: http://localhost:5000
```

### Manual Setup

#### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm start
```

## 📋 Features

### ✅ User Management
- User registration & authentication
- Profile management
- Email/push notification preferences
- Security with JWT tokens

### ✅ Forex Market Data
- Real-time forex pair tracking
- Historical volatility data
- Bid/Ask spread monitoring
- 50+ forex pairs supported

### ✅ Signal Generation
- Automated signal generation engine
- Multi-indicator analysis:
  - RSI (Relative Strength Index)
  - MACD (Moving Average Convergence Divergence)
  - Bollinger Bands
  - Moving Averages (20/50 day)
- Confidence scoring (0-100%)
- Risk management (stop loss, target price)

### ✅ Portfolio Management
- Create multiple portfolios
- Track forex positions
- Calculate P&L
- Cash balance management

### ✅ Price Alerts
- Custom price alerts
- Volatility-based alerts
- Alert notifications
- Alert management

### ✅ Real-Time Updates
- WebSocket integration
- Live signal notifications
- Price updates
- Portfolio value tracking

### ✅ Performance Analytics
- Signal win rate tracking
- Average profit/loss calculation
- Historical signal analysis
- Risk/reward metrics

## 🏗️ Architecture

### Technology Stack

**Backend:**
- Node.js + Express
- TypeORM (PostgreSQL)
- Socket.io (WebSockets)
- JWT Authentication
- TypeScript

**Frontend:**
- React 18+
- React Router
- React Query
- Socket.io Client
- Tailwind CSS
- TypeScript

**Database:**
- PostgreSQL 15
- Redis (caching)

**DevOps:**
- Docker & Docker Compose
- TypeScript

## 📁 Project Structure

```
forex-signals-platform/
├── backend/
│   ├── src/
│   │   ├── entities/          # Database entities
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── middleware/        # Auth, error handling
│   │   ├── database/          # Database config
│   │   └── index.ts           # Entry point
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components
│   │   ├── services/          # API client, WebSocket
│   │   ├── context/           # React context
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml
├── DEVELOPMENT.md
└── README.md
```

## 🔌 API Endpoints

See [DEVELOPMENT.md](DEVELOPMENT.md) for complete API documentation

### Quick Reference
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/forex/pairs` - List forex pairs
- `GET /api/signals/active` - Active signals
- `GET /api/portfolio` - User portfolios
- `GET /api/users/alerts` - User alerts

## 💻 Development

### Install Dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### Run in Development

```bash
# Using Docker Compose (all services)
docker-compose up

# Or individually
cd backend && npm run dev    # Terminal 1
cd frontend && npm start     # Terminal 2
```

### Build for Production

```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

## 🗄️ Database

### Setup Database

```bash
# Using Docker
docker-compose up postgres

# Manual PostgreSQL
createdb forex_signals_db
```

### Run Migrations

```bash
cd backend
npm run migrate
```

## 📊 Signal Generation Algorithm

The platform uses a sophisticated multi-indicator approach:

1. **RSI Analysis** - Identifies overbought/oversold conditions
2. **MACD** - Detects trend momentum changes
3. **Bollinger Bands** - Identifies support/resistance levels
4. **Moving Averages** - Confirms trend direction
5. **Volatility Score** - Weights signal reliability
6. **Confidence Calculation** - Combines all factors (0-100%)

Example Signal:
```json
{
  "id": "uuid",
  "type": "STRONG_BUY",
  "pair": "EUR/USD",
  "entryPrice": 1.0950,
  "targetPrice": 1.1050,
  "stopLoss": 1.0850,
  "confidence": 85,
  "volatilityScore": 72,
  "reason": "RSI oversold with positive MACD crossover"
}
```

## 🔐 Security

- JWT token authentication
- Bcrypt password hashing
- CORS enabled
- Environment variable secrets
- SQL injection prevention (ORM)
- Input validation

## 📝 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:pass@localhost:5432/db
JWT_SECRET=your-secret-key
NODE_ENV=development
API_PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚢 Deployment

### Docker Build

```bash
# Backend
docker build -t forex-backend:latest ./backend

# Frontend
docker build -t forex-frontend:latest ./frontend
```

### Deploy with Compose

```bash
docker-compose -f docker-compose.yml up -d
```

## 📈 Performance Metrics Tracked

- **Win Rate** - % of profitable closed signals
- **Average Profit/Loss** - Mean return per signal
- **Hit Rate** - % signals hitting target price
- **Risk/Reward Ratio** - Target vs Stop Loss ratio
- **Signal Frequency** - Signals generated per day

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## 📚 Documentation

- [DEVELOPMENT.md](DEVELOPMENT.md) - Detailed development guide
- API Documentation - See swagger docs at `/api/docs`
- WebSocket Events - See [DEVELOPMENT.md](DEVELOPMENT.md#websocket-events)

## 🐛 Troubleshooting

### Database connection failed
```bash
# Check PostgreSQL
docker-compose up postgres
docker-compose logs postgres
```

### API not responding
```bash
# Check backend logs
docker-compose logs backend
docker-compose exec backend npm run dev
```

### Frontend build issues
```bash
cd frontend
rm -rf node_modules .cache
npm install
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 💬 Support

For issues and questions:
- Open an issue on GitHub
- Check [DEVELOPMENT.md](DEVELOPMENT.md) for common problems
- Review existing issues for solutions

## 🙏 Acknowledgments

- Technical indicators algorithms inspired by TradingView
- Forex data from Alpha Vantage API
- React ecosystem

---

**Made with ❤️ for forex traders**
