// Property types
export interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  area: string;
  image: string;
  bedrooms: number;
  bathrooms: number;
  rating: number;
  featured: boolean;
  amenities: string[];
  description: string;
}

// Agent types
export interface Agent {
  id: number;
  name: string;
  title: string;
  image: string;
  rating: number;
  reviewCount: number;
  soldProperties: number;
  yearsExperience: number;
  languages: string[];
  specialties: string[];
  phone: string;
  email: string;
  bio: string;
}

// Inquiry types
export interface Inquiry {
  id: string;
  propertyId?: string;
  agentId?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: Date;
}

// Contact form data
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

// Tour form data
export interface TourFormData {
  name: string;
  email: string;
  phone: string;
}

// Blog types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  authorAvatar: string;
  date: Date;
  readTime: string;
  category: string;
  tags: string[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
} 