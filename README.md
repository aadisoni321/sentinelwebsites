# Sentinel - Subscription Management Platform

"They Hope You Forget. We Make Sure You Don't."

A modern, professional subscription management platform that helps users track, manage, and cancel their subscriptions to save money.

## Project Structure

```
sentinelapp/
├── frontend/                 # Next.js React Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx     # Main homepage
│   │   └── components/      # Reusable UI components
│   ├── public/             # Static assets
│   ├── package.json
│   └── next.config.js
├── backend/                 # Express.js Backend
│   ├── api/                # API routes (moved from frontend)
│   ├── lib/                # Utility functions
│   ├── supabase/           # Database schema
│   └── package.json
└── README.md
```

## Features

### Frontend
- **Modern UI/UX**: Dark theme with professional design
- **Responsive Design**: Works on desktop and mobile
- **High Performance**: Built with Next.js 14 and React 18
- **Professional Styling**: Tailwind CSS for precise control

### Backend
- **RESTful API**: Express.js server with organized routes
- **Database**: Supabase integration for data persistence
- **Authentication**: Secure user management
- **Integrations**: Plaid, Gmail, Calendar APIs

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Frontend Development

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The frontend will be available at `http://localhost:3000`

### Backend Development

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

The backend will be available at `http://localhost:8000`

## Tech Stack

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components
- **Fonts**: Inter (Google Fonts)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **APIs**: Plaid, Gmail, Google Calendar

## Design Philosophy

This application follows a **premium, professional design** approach:

- **Dark Theme**: Modern, easy on the eyes
- **Clean Typography**: Inter font for clarity
- **Consistent Spacing**: Tailwind's spacing system
- **Professional Color Palette**: Navy, blue, white, and grays
- **Responsive Grid**: Mobile-first design approach

## Page Structure

### Homepage (`/`)
1. **Navigation Bar**: Logo, menu items, CTA button
2. **Hero Section**: Main value proposition and call-to-action
3. **Ocean Image**: Large, calming visual element
4. **Dashboard Preview**: Grid of feature cards and metrics

## Development Notes

- **Code Quality**: Clean, maintainable, and well-documented
- **Performance**: Optimized for speed and user experience
- **Accessibility**: Following WCAG guidelines
- **SEO**: Proper meta tags and structure

## Environment Variables

Create `.env.local` files in both frontend and backend directories with the necessary environment variables for:
- Supabase connection
- API keys (Plaid, Gmail, etc.)
- Authentication secrets

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary and confidential. 