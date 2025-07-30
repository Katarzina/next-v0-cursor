# PropertyFinder - Real Estate Platform

A modern real estate platform built with Next.js 13+ and TypeScript, featuring property listings, agent directory, and multilingual support.

🌐 **Live Demo**: [Project deployed here](https://next-v0-cursor-a77v.vercel.app/)

## 🚀 Features

### Core Functionality
- **Property Listings**: Browse and search through apartment listings with detailed information
- **Interactive Property Cards**: View property details, amenities, pricing, and images
- **Favorites System**: Save and manage favorite properties
- **Advanced Search**: Filter by location, property type, price range, and more
- **Property Details Modal**: Detailed view with descriptions, specifications, and contact options
- **Tour Scheduling**: Schedule property tours with date/time selection
- **Contact Agents**: Direct contact forms for property inquiries

### Authentication & Authorization
- **User Registration**: Sign up with email/password or Google OAuth
- **Role-Based Access Control**: Three user roles - USER, AGENT, and ADMIN
- **Secure Authentication**: NextAuth.js with JWT sessions and bcrypt password hashing
- **Protected Routes**: Agent dashboard and admin panel with route protection
- **Session Management**: Persistent sessions with automatic refresh

### User Interface
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean design using Tailwind CSS and shadcn/ui components
- **Interactive Maps**: OpenStreetMap integration for location viewing
- **Image Galleries**: High-quality property images with hover effects
- **Loading States**: Smooth user experience with proper loading indicators

### Multilingual Support
- **3 Languages**: English, Ukrainian, and Czech
- **Complete Translations**: All UI elements, forms, and content are localized
- **Language Switcher**: Easy switching between languages in the header
- **Persistent Locale**: Language preference saved in localStorage

### Pages & Navigation
- **Home Page**: Property listings with advanced search component
- **Agents Directory**: Browse real estate agents with filtering by specialty and language
- **Blog**: Real estate news, tips, and market insights with category/tag filtering
- **Map Integration**: Full-screen interactive maps for property locations
- **Legal Pages**: Terms of Service, Privacy Policy, and Cookie Policy
- **Global Navigation**: Fixed header with logo, navigation, and language switcher
- **Authentication Pages**: Sign in, sign up, and password reset pages
- **Agent Dashboard**: Property management interface for agents
- **User Profile**: Profile dropdown with role-based navigation

## 🛠 Tech Stack

- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Font**: Inter (Google Fonts)
- **Maps**: OpenStreetMap (iframe integration)
- **State Management**: Recoil + React Context API
- **Internationalization**: Custom i18n implementation
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT strategy
- **API Documentation**: Swagger/OpenAPI
- **Form Validation**: React Hook Form + Zod

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── agent/             # Agent dashboard and management
│   │   └── properties/    # Property CRUD operations
│   ├── agents/            # Real estate agents directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── properties/    # Property REST API
│   │   ├── agents/        # Agents REST API
│   │   └── swagger/       # API documentation endpoint
│   ├── auth/              # Authentication pages
│   │   ├── signin/        # Sign in page
│   │   └── signup/        # Sign up page
│   ├── blog/              # Blog with articles and filtering
│   ├── cookies/           # Cookie policy page
│   ├── map/               # Interactive map viewer
│   ├── privacy/          # Privacy policy page
│   ├── terms/            # Terms of service page
│   ├── api-docs/          # Swagger UI documentation
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout with header/navigation
│   └── page.tsx          # Home page with property listings
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui component library
│   ├── AgentCard.tsx     # Agent profile cards
│   ├── PropertyCard.tsx  # Property listing cards
│   ├── PropertyForm.tsx  # Property create/edit form
│   ├── BlogCard.tsx      # Blog post preview cards
│   ├── Footer.tsx        # Site footer with links
│   ├── LanguageSwitcher.tsx # Language selection dropdown
│   ├── SearchComponent.tsx  # Advanced property search form
│   ├── UserNav.tsx       # User profile dropdown
│   └── StaticMap.tsx     # OpenStreetMap integration
├── contexts/              # React Context providers
│   └── LocaleContext.tsx # Internationalization context
├── lib/                  # Utility functions and configurations
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client instance
│   ├── swagger.ts        # Swagger/OpenAPI specification
│   └── utils.ts          # Helper functions
├── atoms/                # Recoil state atoms
│   └── propertiesAtom.ts # Global state for properties
├── hooks/                # Custom React hooks
│   └── use-toast.ts      # Toast notification hook
├── data/                 # Static data files
│   └── locations.ts      # Location coordinates mapping
├── locales/              # Translation files
│   ├── en.ts             # English translations
│   ├── uk.ts             # Ukrainian translations
│   └── cs.ts             # Czech translations
└── types/                # TypeScript type definitions
    └── index.ts          # Shared types and interfaces
```

## 🌍 Internationalization

The application supports three languages with complete translations:

- **English (en)**: Default language
- **Ukrainian (uk)**: Full localization including Cyrillic support
- **Czech (cs)**: Complete Czech translations

All text content, form labels, error messages, and UI elements are translated. The language preference is persisted in localStorage and applied across all pages.

## 🏠 Property Features

Each property listing includes:
- High-quality images with hover effects
- Detailed specifications (bedrooms, bathrooms, square footage)
- Pricing information with per-month display
- Location with interactive map links
- Amenities list (gym, pool, parking, etc.)
- Featured property badges
- Favorite/heart button for saving
- Contact agent functionality
- Tour scheduling system

## 👥 Agent Directory

The agents section features:
- Agent profile cards with photos and contact information
- Filtering by specialty (residential, commercial, luxury, etc.)
- Language filtering for multilingual agents
- Search by agent name
- Contact forms for direct communication
- Agent statistics (properties sold, years of experience, reviews)

## 📝 Blog System

The blog includes:
- Article cards with featured images and metadata
- Category-based filtering
- Tag-based filtering
- Search functionality across articles
- Author information and publication dates
- Read time estimates
- Newsletter subscription section

## 🗺 Map Integration

Interactive mapping features:
- Full-screen map viewer
- OpenStreetMap integration via iframe
- Property location markers
- Wide area view with adjustable zoom
- Google Maps integration links
- Responsive map containers

## 🔐 Authentication System

### User Roles
- **USER**: Default role for regular users
  - Can browse properties
  - Save favorites
  - Contact agents
  - Schedule tours
  
- **AGENT**: Real estate agents
  - All USER permissions
  - Create new property listings
  - Edit/delete own properties
  - Access agent dashboard
  
- **ADMIN**: System administrators
  - Full access to all resources
  - Manage all properties
  - Manage all users and agents

### Agent Dashboard Features
- **Property Management**: Create, read, update, and delete property listings
- **Statistics Overview**: Total properties, featured listings, average rating
- **Search & Filter**: Find specific properties quickly
- **Bulk Actions**: Manage multiple properties efficiently
- **Form Validation**: Comprehensive validation for property data

### Security Features
- **Password Hashing**: Bcrypt for secure password storage
- **JWT Sessions**: Secure token-based authentication
- **Protected Routes**: Automatic redirection for unauthorized access
- **Role Verification**: Server-side role checking on all protected endpoints
- **CSRF Protection**: Built-in CSRF protection via NextAuth.js

## 🚀 Getting Started

1. **Clone the repository**
```bash
git clone <repository-url>
cd next-v0-cursor
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**
Create a `.env.local` file with:
```env
# Database
DATABASE_URL="your-postgresql-connection-string"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

4. **Set up the database**
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database with test data
npx prisma db seed
```

5. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Build and Deploy

### Local Production Build
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Deploy to Vercel

1. **Push your code to GitHub**
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect Next.js

3. **Configure Environment Variables in Vercel Dashboard**
   
   Required variables:
   ```
   DATABASE_URL=your-postgresql-connection-string
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your-generated-secret
   ```
   
   Optional variables:
   ```
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

4. **Database Setup Options**
   
   **Option A: Vercel Postgres**
   - Add Vercel Postgres from the Vercel dashboard
   - It will automatically set DATABASE_URL
   
   **Option B: External Database (Recommended)**
   - Use [Supabase](https://supabase.com) (free tier available)
   - Use [Neon](https://neon.tech) (free tier available)
   - Use [Railway](https://railway.app) (pay as you go)
   
5. **Run Database Migrations**
   ```bash
   # After deployment, run migrations using Vercel CLI
   vercel env pull .env.local
   npx prisma migrate deploy
   npx prisma db seed
   ```

6. **Update NEXTAUTH_URL**
   - After deployment, update NEXTAUTH_URL to your Vercel domain
   - Example: `https://your-app.vercel.app`

### Important Deployment Notes

- **Database**: You need a PostgreSQL database. Vercel doesn't include one by default
- **Environment Variables**: All env variables must be set in Vercel dashboard
- **Build Command**: Vercel will use `prisma generate && next build` automatically
- **Node Version**: The project uses Node.js 18.x or higher

## 📊 API Documentation

The project includes comprehensive API documentation using Swagger/OpenAPI:

- **Access Documentation**: Navigate to `/api-docs` when the server is running
- **Interactive Testing**: Test API endpoints directly from the Swagger UI
- **Authentication**: Supports both JWT bearer tokens and session cookies
- **Role-Based Endpoints**: Clear indication of required permissions for each endpoint

### Available API Endpoints

#### Authentication
- `POST /api/auth/signup` - Register a new user
- `GET /api/auth/session` - Get current user session

#### Properties
- `GET /api/properties` - List all properties (public)
- `POST /api/properties` - Create property (AGENT/ADMIN)
- `GET /api/properties/:id` - Get property details (public)
- `PUT /api/properties/:id` - Update property (owner/ADMIN)
- `DELETE /api/properties/:id` - Delete property (owner/ADMIN)

#### Agents
- `GET /api/agents` - List all agents
- `POST /api/agents` - Create agent profile

#### Blog
- `GET /api/blog` - List blog posts
- `POST /api/blog` - Create blog post

## 🎨 Customization

The project uses Tailwind CSS for styling and can be easily customized:

- **Colors**: Modify `tailwind.config.js` for brand colors
- **Typography**: Update font settings in `layout.tsx`
- **Components**: shadcn/ui components can be customized in `src/components/ui/`
- **Translations**: Add new languages by creating files in `src/locales/`

## 📄 License

This project is available for use under the terms specified by the project owner.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and enhancement requests.

## 🧪 Test Credentials

The database seed includes the following test users:

### Admin Account
- **Email**: admin@propertyfinder.com
- **Password**: password123
- **Role**: ADMIN (full system access)

### Agent Accounts
- **Sarah Johnson**
  - Email: sarah.johnson@propertyfinder.com
  - Password: password123
  - Role: AGENT
  - Has sample properties in the system
  
- **Michael Chen**
  - Email: michael.chen@propertyfinder.com
  - Password: password123
  - Role: AGENT
  - Has sample properties in the system

### Regular User
- **Email**: user@example.com
- **Password**: password123
- **Role**: USER (standard access)

## 🛡️ Security Considerations

- All passwords are hashed using bcrypt with 12 rounds
- Session tokens expire and refresh automatically
- API endpoints validate user permissions on the server
- Environment variables store sensitive configuration
- HTTPS should be used in production
- Regular security updates recommended for dependencies