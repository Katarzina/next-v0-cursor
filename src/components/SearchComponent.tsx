'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, MapPin, Home, DollarSign } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useLocale } from '@/contexts/LocaleContext';

export default function SearchComponent() {
  const router = useRouter();
  const { t } = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [location, setLocation] = useState('all');

  const handleSearch = () => {
    // Build query parameters
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (propertyType !== 'all') params.append('type', propertyType);
    if (priceRange !== 'all') params.append('price', priceRange);
    if (location !== 'all') params.append('location', location);
    
    // Navigate to search results page (we'll create this later)
    router.push(`/search?${params.toString()}`);
  };

  const handleQuickAction = (action: string) => {
    if (action === 'buy') {
      router.push('/search?type=buy');
    } else if (action === 'rent') {
      router.push('/search?type=rent');
    } else if (action === 'contact') {
      router.push('/contact');
    }
  };

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-gray-900">
              {t.hero.title}
            </h1>
            <p className="text-gray-600 md:text-lg max-w-2xl mx-auto">
              {t.hero.subtitle}
            </p>
          </div>

          {/* Search Form */}
          <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Location Select */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {t.hero.location}
                </label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.hero.allLocations} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.hero.allLocations}</SelectItem>
                    <SelectItem value="downtown">{t.hero.downtown}</SelectItem>
                    <SelectItem value="brooklyn">{t.hero.brooklyn}</SelectItem>
                    <SelectItem value="upper-east-side">{t.hero.upperEastSide}</SelectItem>
                    <SelectItem value="soho">{t.hero.soho}</SelectItem>
                    <SelectItem value="greenwich">{t.hero.greenwich}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Home className="w-4 h-4 mr-1" />
                  {t.hero.propertyType}
                </label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.hero.allTypes} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.hero.allTypes}</SelectItem>
                    <SelectItem value="apartment">{t.hero.apartment}</SelectItem>
                    <SelectItem value="house">{t.hero.house}</SelectItem>
                    <SelectItem value="condo">{t.hero.condo}</SelectItem>
                    <SelectItem value="studio">{t.hero.studio}</SelectItem>
                    <SelectItem value="loft">{t.hero.loft}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {t.hero.priceRange}
                </label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.hero.anyPrice} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.hero.anyPrice}</SelectItem>
                    <SelectItem value="0-1500">{t.hero.price0to1500}</SelectItem>
                    <SelectItem value="1500-2500">{t.hero.price1500to2500}</SelectItem>
                    <SelectItem value="2500-3500">{t.hero.price2500to3500}</SelectItem>
                    <SelectItem value="3500-5000">{t.hero.price3500to5000}</SelectItem>
                    <SelectItem value="5000+">{t.hero.price5000plus}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Buy/Rent Toggle */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t.hero.lookingTo}
                </label>
                <div className="flex gap-2">
                  <Button 
                    variant={propertyType === 'buy' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setPropertyType('buy')}
                  >
                    {t.hero.buy}
                  </Button>
                  <Button 
                    variant={propertyType === 'rent' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setPropertyType('rent')}
                  >
                    {t.hero.rent}
                  </Button>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder={t.hero.searchPlaceholder}
                className="pl-10 h-12 text-base pr-32"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button 
                size="lg" 
                className="absolute right-1 top-1/2 -translate-y-1/2 h-10"
                onClick={handleSearch}
              >
                {t.hero.searchButton}
              </Button>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              variant="outline"
              className="h-12 px-8 text-base font-medium"
              onClick={() => handleQuickAction('buy')}
            >
              {t.hero.browseSale}
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="h-12 px-8 text-base font-medium"
              onClick={() => handleQuickAction('rent')}
            >
              {t.hero.findRentals}
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="h-12 px-8 text-base font-medium"
              onClick={() => handleQuickAction('contact')}
            >
              {t.hero.contactAgent}
            </Button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-8 pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{t.hero.stats.listingsCount}</div>
              <div className="text-sm text-gray-600">{t.hero.stats.listings}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{t.hero.stats.agentsCount}</div>
              <div className="text-sm text-gray-600">{t.hero.stats.agents}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{t.hero.stats.clientsCount}</div>
              <div className="text-sm text-gray-600">{t.hero.stats.clients}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}