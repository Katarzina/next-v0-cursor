'use client';

import React, { useState } from 'react';
import { Search, BookOpen, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BlogCard from '@/components/BlogCard';
import Footer from '@/components/Footer';
import { useLocale } from '@/contexts/LocaleContext';

const blogPosts = [
  {
    id: 1,
    title: "10 Tips for First-Time Home Buyers in New York",
    excerpt: "Navigating the New York real estate market can be challenging for first-time buyers. Here are essential tips to help you make informed decisions and find your dream home.",
    content: "Full article content here...",
    author: "Sarah Johnson",
    date: "2024-01-15",
    readTime: 5,
    category: "Buying Guide",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60",
    tags: ["First-time Buyers", "Tips", "NYC Real Estate"]
  },
  {
    id: 2,
    title: "Understanding Property Taxes in New York: A Complete Guide",
    excerpt: "Property taxes can significantly impact your budget. Learn everything you need to know about property taxes in New York, including how they're calculated and ways to potentially reduce them.",
    content: "Full article content here...",
    author: "Michael Chen",
    date: "2024-01-12",
    readTime: 7,
    category: "Finance",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=60",
    tags: ["Property Tax", "Finance", "Investment"]
  },
  {
    id: 3,
    title: "Best Neighborhoods for Families in Brooklyn",
    excerpt: "Brooklyn offers diverse neighborhoods perfect for families. Discover the top areas with great schools, parks, and family-friendly amenities.",
    content: "Full article content here...",
    author: "Emily Rodriguez",
    date: "2024-01-10",
    readTime: 6,
    category: "Neighborhood Guide",
    image: "https://images.unsplash.com/photo-1546074177-ffdda98d214f?w=800&auto=format&fit=crop&q=60",
    tags: ["Brooklyn", "Family", "Neighborhoods"]
  },
  {
    id: 4,
    title: "Real Estate Investment Strategies for 2024",
    excerpt: "Explore proven investment strategies in the current real estate market. From rental properties to REITs, find the approach that suits your goals.",
    content: "Full article content here...",
    author: "David Kim",
    date: "2024-01-08",
    readTime: 8,
    category: "Investment",
    image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&auto=format&fit=crop&q=60",
    tags: ["Investment", "Strategy", "2024 Trends"]
  },
  {
    id: 5,
    title: "How to Stage Your Home for a Quick Sale",
    excerpt: "Home staging can make a significant difference in selling your property quickly and for the best price. Learn professional staging tips that work.",
    content: "Full article content here...",
    author: "Anna Petrova",
    date: "2024-01-05",
    readTime: 4,
    category: "Selling Tips",
    image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&auto=format&fit=crop&q=60",
    tags: ["Home Staging", "Selling", "Tips"]
  },
  {
    id: 6,
    title: "The Rise of Smart Homes: What Buyers Want in 2024",
    excerpt: "Smart home technology is becoming a must-have for modern buyers. Discover the most sought-after smart home features and their impact on property values.",
    content: "Full article content here...",
    author: "James Thompson",
    date: "2024-01-03",
    readTime: 5,
    category: "Technology",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=60",
    tags: ["Smart Home", "Technology", "Trends"]
  },
  {
    id: 7,
    title: "Renting vs. Buying: Making the Right Decision in 2024",
    excerpt: "The eternal debate continues. We break down the pros and cons of renting versus buying in today's market to help you make an informed decision.",
    content: "Full article content here...",
    author: "Sarah Johnson",
    date: "2024-01-01",
    readTime: 6,
    category: "Market Analysis",
    image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&auto=format&fit=crop&q=60",
    tags: ["Renting", "Buying", "Market Analysis"]
  },
  {
    id: 8,
    title: "Green Living: Eco-Friendly Homes in New York",
    excerpt: "Sustainability is becoming increasingly important in real estate. Explore eco-friendly homes and green building practices gaining popularity in New York.",
    content: "Full article content here...",
    author: "Emily Rodriguez",
    date: "2023-12-28",
    readTime: 5,
    category: "Sustainability",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop&q=60",
    tags: ["Green Living", "Sustainability", "Eco-Friendly"]
  },
  {
    id: 9,
    title: "Luxury Real Estate Trends: What's Hot in Manhattan",
    excerpt: "Discover the latest trends in Manhattan's luxury real estate market, from penthouse amenities to architectural innovations defining high-end living.",
    content: "Full article content here...",
    author: "David Kim",
    date: "2023-12-25",
    readTime: 7,
    category: "Luxury Market",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60",
    tags: ["Luxury", "Manhattan", "Trends"]
  }
];

export default function BlogPage() {
  const { t } = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');

  // Get unique categories and tags
  const categories = ['all', ...new Set(blogPosts.map(post => post.category))];
  const allTags = ['all', ...new Set(blogPosts.flatMap(post => post.tags))];

  // Filter posts
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag);
    
    return matchesSearch && matchesCategory && matchesTag;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              {t.footer.blog}
            </h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">{t.blog.heroTitle}</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">{t.blog.heroSubtitle}</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder={t.blog.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-gray-900 bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              {/* Categories */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.blog.categories}</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                        selectedCategory === category
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {category === 'all' ? t.blog.allCategories : category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Tags */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.blog.popularTags}</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 10).map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTag === tag ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => setSelectedTag(tag)}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag === 'all' ? t.blog.allTags : tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                {t.blog.showingPosts.replace('{count}', filteredPosts.length.toString())}
              </p>
              {(selectedCategory !== 'all' || selectedTag !== 'all' || searchQuery) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedTag('all');
                  }}
                >
                  {t.blog.clearFilters}
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">{t.blog.noPostsFound}</p>
              </div>
            )}

            {/* Pagination (placeholder) */}
            {filteredPosts.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    {t.blog.previous}
                  </Button>
                  <span className="px-4 py-2 text-sm text-gray-600">
                    {t.blog.page} 1 {t.blog.of} 1
                  </span>
                  <Button variant="outline" size="sm" disabled>
                    {t.blog.next}
                  </Button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-blue-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.blog.newsletterTitle}</h3>
          <p className="text-gray-600 mb-6">{t.blog.newsletterSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder={t.blog.emailPlaceholder}
              className="flex-1"
            />
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              {t.blog.subscribe}
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}