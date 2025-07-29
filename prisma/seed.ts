import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.property.deleteMany()
  await prisma.agentProfile.deleteMany()
  await prisma.blogPost.deleteMany()
  await prisma.user.deleteMany()
  
  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@propertyfinder.com',
      name: 'Admin User',
      password: hashedPassword,
      role: UserRole.ADMIN
    }
  })
  
  const agentUser1 = await prisma.user.create({
    data: {
      email: 'sarah.johnson@propertyfinder.com',
      name: 'Sarah Johnson',
      password: hashedPassword,
      role: UserRole.AGENT
    }
  })
  
  const agentUser2 = await prisma.user.create({
    data: {
      email: 'michael.chen@propertyfinder.com',
      name: 'Michael Chen',
      password: hashedPassword,
      role: UserRole.AGENT
    }
  })
  
  const regularUser = await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: 'John Doe',
      password: hashedPassword,
      role: UserRole.USER
    }
  })
  
  console.log('Created test users:')
  console.log('- Admin: admin@propertyfinder.com / password123')
  console.log('- Agent: sarah.johnson@propertyfinder.com / password123')
  console.log('- Agent: michael.chen@propertyfinder.com / password123')
  console.log('- User: user@example.com / password123')
  
  // Create agent profiles linked to users
  const agent1 = await prisma.agentProfile.create({
    data: {
      title: "Senior Real Estate Agent",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60",
      rating: 4.9,
      reviewCount: 127,
      soldProperties: 156,
      yearsExperience: 12,
      languages: ["English", "Spanish"],
      specialties: ["Luxury Homes", "Investment Properties", "First-time Buyers"],
      phone: "+1 (555) 123-4567",
      bio: "With over 12 years of experience in New York real estate, Sarah specializes in luxury properties and has helped hundreds of clients find their dream homes.",
      userId: agentUser1.id
    }
  })
  
  const agent2 = await prisma.agentProfile.create({
    data: {
      title: "Real Estate Consultant",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60",
      rating: 4.8,
      reviewCount: 98,
      soldProperties: 134,
      yearsExperience: 8,
      languages: ["English", "Mandarin", "Cantonese"],
      specialties: ["Commercial Properties", "Condos", "International Buyers"],
      phone: "+1 (555) 234-5678",
      bio: "Michael brings a global perspective to real estate, helping international clients navigate the New York market with expertise and cultural understanding.",
      userId: agentUser2.id
    }
  })
  
  console.log('Created 2 agent profiles')
  
  // Create properties
  const properties = await prisma.property.createMany({
    data: [
      {
        title: "Modern Downtown Loft",
        location: "Downtown, New York",
        price: "$2,850",
        area: "1,200",
        image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800",
        bedrooms: 2,
        bathrooms: 2,
        rating: 4.8,
        featured: true,
        amenities: ["Gym", "Pool", "Parking"],
        description: "Experience urban living at its finest in this stunning modern loft located in the heart of downtown.",
        userId: agentUser1.id
      },
      {
        title: "Cozy Studio Apartment",
        location: "Brooklyn, New York",
        price: "$1,650",
        area: "650",
        image: "https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg?auto=compress&cs=tinysrgb&w=800",
        bedrooms: 1,
        bathrooms: 1,
        rating: 4.6,
        featured: false,
        amenities: ["Balcony", "Laundry", "Pet-friendly"],
        description: "This charming studio apartment offers the perfect blend of comfort and convenience."
      },
      {
        title: "Luxury Penthouse Suite",
        location: "Upper East Side, New York",
        price: "$4,200",
        area: "2,100",
        image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
        bedrooms: 3,
        bathrooms: 3,
        rating: 4.9,
        featured: true,
        amenities: ["Concierge", "Rooftop", "Doorman"],
        description: "Indulge in luxury living with this exquisite penthouse suite on the prestigious Upper East Side."
      },
      {
        title: "Waterfront Condo",
        location: "Battery Park, New York",
        price: "$3,500",
        area: "1,450",
        image: "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800",
        bedrooms: 2,
        bathrooms: 2,
        rating: 4.7,
        featured: false,
        amenities: ["Water View", "Gym", "Valet Parking", "Spa"],
        description: "Wake up to stunning water views in this elegant waterfront condominium."
      },
      {
        title: "Trendy SoHo Loft",
        location: "SoHo, New York",
        price: "$3,200",
        area: "950",
        image: "https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg?auto=compress&cs=tinysrgb&w=800",
        bedrooms: 1,
        bathrooms: 1,
        rating: 4.5,
        featured: true,
        amenities: ["High Ceilings", "Exposed Brick", "Elevator"],
        description: "Live in the heart of SoHo in this authentic New York loft featuring 12-foot ceilings."
      }
    ]
  })
  
  console.log(`Created ${properties.count} properties`)
  
  // Create blog posts
  const blogPosts = await prisma.blogPost.createMany({
    data: [
      {
        title: "10 Tips for First-Time Home Buyers in New York",
        slug: "10-tips-first-time-home-buyers-nyc",
        excerpt: "Navigate the competitive NYC real estate market with confidence. Essential tips for first-time buyers.",
        content: "Buying your first home in New York City can be overwhelming. Here are 10 essential tips to help you navigate the process...",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60",
        author: "Sarah Johnson",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60",
        date: new Date('2024-02-15'),
        readTime: "5 min read",
        category: "Buying Guide",
        tags: ["First-time Buyers", "NYC Real Estate", "Tips"],
        views: 342
      },
      {
        title: "Understanding NYC Property Taxes: A Complete Guide",
        slug: "understanding-nyc-property-taxes-guide",
        excerpt: "Everything you need to know about property taxes in New York City, from calculations to exemptions.",
        content: "Property taxes in NYC can be complex. This comprehensive guide breaks down everything you need to know...",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=60",
        author: "Michael Chen",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60",
        date: new Date('2024-02-10'),
        readTime: "8 min read",
        category: "Finance",
        tags: ["Property Tax", "NYC", "Finance"],
        views: 456
      },
      {
        title: "Best Neighborhoods for Families in Manhattan",
        slug: "best-neighborhoods-families-manhattan",
        excerpt: "Discover the top family-friendly neighborhoods in Manhattan with great schools, parks, and amenities.",
        content: "When looking for a family home in Manhattan, certain neighborhoods stand out for their family-friendly amenities...",
        image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&auto=format&fit=crop&q=60",
        author: "Emily Rodriguez",
        authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=60",
        date: new Date('2024-02-05'),
        readTime: "6 min read",
        category: "Neighborhood Guide",
        tags: ["Manhattan", "Family", "Neighborhoods"],
        views: 567
      },
      {
        title: "Investment Properties: Brooklyn vs Queens",
        slug: "investment-properties-brooklyn-vs-queens",
        excerpt: "Comparing investment opportunities in Brooklyn and Queens. Which borough offers better ROI?",
        content: "For real estate investors, both Brooklyn and Queens offer unique opportunities. Let's compare the markets...",
        image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&auto=format&fit=crop&q=60",
        author: "David Kim",
        authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60",
        date: new Date('2024-01-30'),
        readTime: "7 min read",
        category: "Investment",
        tags: ["Investment", "Brooklyn", "Queens"],
        views: 892
      },
      {
        title: "NYC Rental Market Trends 2024",
        slug: "nyc-rental-market-trends-2024",
        excerpt: "Latest trends in the NYC rental market. What renters and landlords need to know for 2024.",
        content: "The NYC rental market continues to evolve in 2024. Here are the key trends shaping the market...",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60",
        author: "Anna Petrova",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60",
        date: new Date('2024-01-25'),
        readTime: "5 min read",
        category: "Market Analysis",
        tags: ["Rental Market", "Trends", "2024"],
        views: 1024
      },
      {
        title: "Historic Homes: Preserving NYC's Architectural Heritage",
        slug: "historic-homes-preserving-nyc-heritage",
        excerpt: "Explore the charm and challenges of owning a historic home in New York City.",
        content: "Owning a historic home in NYC comes with unique rewards and responsibilities. Learn about preservation requirements...",
        image: "https://images.unsplash.com/photo-1609766934428-cf8c3cb67809?w=800&auto=format&fit=crop&q=60",
        author: "James Thompson",
        authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=60",
        date: new Date('2024-01-20'),
        readTime: "6 min read",
        category: "Architecture",
        tags: ["Historic Homes", "Architecture", "Preservation"],
        views: 234
      }
    ]
  })
  
  console.log(`Created ${blogPosts.count} blog posts`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })