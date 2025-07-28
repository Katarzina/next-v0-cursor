# PropertyFinder - Real Estate Platform

A modern real estate platform built with Next.js 13+ and TypeScript, featuring property listings, agent directory, and multilingual support.

## 🚀 Features

### Core Functionality
- **Property Listings**: Browse and search through apartment listings with detailed information
- **Interactive Property Cards**: View property details, amenities, pricing, and images
- **Favorites System**: Save and manage favorite properties
- **Advanced Search**: Filter by location, property type, price range, and more
- **Property Details Modal**: Detailed view with descriptions, specifications, and contact options
- **Tour Scheduling**: Schedule property tours with date/time selection
- **Contact Agents**: Direct contact forms for property inquiries

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

## 🛠 Tech Stack

- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Font**: Inter (Google Fonts)
- **Maps**: OpenStreetMap (iframe integration)
- **State Management**: React Context API
- **Internationalization**: Custom i18n implementation

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── agents/            # Real estate agents directory
│   ├── blog/              # Blog with articles and filtering
│   ├── cookies/           # Cookie policy page
│   ├── map/               # Interactive map viewer
│   ├── privacy/          # Privacy policy page
│   ├── terms/            # Terms of service page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout with header/navigation
│   └── page.tsx          # Home page with property listings
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui component library
│   ├── AgentCard.tsx     # Agent profile cards
│   ├── ApartmentCard.tsx # Property listing cards
│   ├── BlogCard.tsx      # Blog post preview cards
│   ├── Footer.tsx        # Site footer with links
│   ├── LanguageSwitcher.tsx # Language selection dropdown
│   ├── SearchComponent.tsx  # Advanced property search form
│   └── StaticMap.tsx     # OpenStreetMap integration
├── contexts/              # React Context providers
│   └── LocaleContext.tsx # Internationalization context
├── data/                 # Static data files
│   └── locations.ts      # Location coordinates mapping
└── locales/              # Translation files
    ├── en.ts             # English translations
    ├── uk.ts             # Ukrainian translations
    └── cs.ts             # Czech translations
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

3. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Build and Deploy

```bash
# Build for production
npm run build

# Start production server
npm start

# Export static files (if needed)
npm run export
```

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