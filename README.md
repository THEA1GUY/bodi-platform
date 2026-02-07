# 🏠 BODI Platform

**Peace of Mind Housing for Nigeria**

BODI is an AI-powered real estate platform designed to solve Nigeria's housing trust crisis through verified listings, secure escrow payments, and community-driven safety features.

![BODI Logo](frontend/public/bodi-logo.png)

## 🌟 Features

### For Tenants
- 🤖 **AI-Powered Search** - BODI understands Nigerian locations and verifies proximity claims with real-time internet access
- ✅ **Verified Listings** - All properties undergo verification with safety scores and landlord background checks
- 💰 **Secure Escrow** - Your deposit is protected until you confirm move-in. Zero risk of fraud
- 🛡️ **Trust & Safety** - ID verification, location sharing during viewings, and emergency alerts
- 💬 **Community Reviews** - Real tenant reviews and neighborhood insights from verified users
- 🔧 **Service Network** - Verified plumbers, movers, and maintenance providers at your fingertips

### For Landlords
- 📊 **Analytics Dashboard** - Track your properties, revenue, and tenant interactions
- 📝 **Easy Listing** - Simple property listing with automatic verification process
- 💳 **Escrow Protection** - Secure payment processing with automatic release
- 🔧 **Maintenance Tracking** - Manage tenant maintenance requests efficiently

## 🚀 Tech Stack

### Frontend
- **Next.js 16** - React framework with Turbopack
- **TypeScript** - Type-safe development
- **CSS** - Custom design system with "Warm Earth & Trust" theme

### Backend
- **FastAPI** - Modern Python web framework
- **Google Gemini AI** - Conversational AI for property search
- **Tavily API** - Real-time internet search for location verification
- **SQLite** - Lightweight database (upgradeable to PostgreSQL)

## 📦 Project Structure

```
bodi-platform/
├── frontend/           # Next.js frontend
│   ├── app/           # App router pages
│   ├── components/    # Reusable components
│   ├── lib/          # Utilities and API client
│   └── public/       # Static assets
├── backend/           # FastAPI backend
│   ├── main.py       # Main application
│   ├── models.py     # Data models
│   ├── database.py   # Database logic
│   └── geography.py  # Location services
└── docs/             # Documentation
```

## 🛠️ Local Development

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- Google Gemini API key
- Tavily API key

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/bodi-platform.git
   cd bodi-platform
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   
   # Create .env file
   cp .env.example .env
   # Add your API keys to .env
   
   # Run backend
   python main.py
   ```
   Backend will run on `http://localhost:8000`

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Create .env.local file
   cp .env.example .env.local
   
   # Run frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

## 🌐 Deployment

### Quick Deploy (Recommended)

**Frontend**: Vercel  
**Backend**: Render

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

### Quick Deploy Script

```bash
# Run the automated deployment script
.\deploy.ps1
```

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT_GUIDE.md) - How to deploy for beta testing
- [Logo Usage Guide](LOGO_GUIDE.md) - Brand assets and usage
- [Tavily Integration](TAVILY_INTEGRATION.md) - AI search implementation
- [Chat Feature](BODI_CHAT_FEATURE.md) - Conversational AI details
- [Project Plan](PROJECT_PLAN.md) - Roadmap and features

## 🎨 Design System

BODI uses a "Warm Earth & Trust" color palette:
- **Primary**: `#A65D5D` (Warm terracotta)
- **Secondary**: `#E09F3E` (Golden amber)
- **Accent**: `#2A9D8F` (Trustworthy teal)
- **Background**: `#F4F1EA` (Soft cream)

## 🔑 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)
```env
GEMINI_API_KEY=your_gemini_api_key
TAVILY_API_KEY=your_tavily_api_key
```

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
pytest
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Gemini AI for conversational intelligence
- Tavily for real-time search capabilities
- The Nigerian tech community for inspiration

## 📞 Contact

For questions or feedback, please open an issue or contact the maintainers.

---

**Built with ❤️ for Nigeria's housing future**
