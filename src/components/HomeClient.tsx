'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, MapPin, Square, Star, Send, Phone, Mail, CalendarDays, Clock, Check, Home, Plus } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import SearchComponent from "@/components/SearchComponent";
import Footer from "@/components/Footer";
import FavoriteButton from "@/components/FavoriteButton";
import { Property, ContactFormData, TourFormData } from "@/types";
import { useSetRecoilState, useRecoilState } from 'recoil';
import { propertiesState, favoritePropertiesState } from '@/atoms/propertiesAtom';

interface HomeClientProps {
  initialProperties: Property[];
}

export default function HomeClient({ initialProperties }: HomeClientProps) {
  const { data: session } = useSession();
  const setProperties = useSetRecoilState(propertiesState);
  const [favorites, setFavorites] = useRecoilState(favoritePropertiesState);
  const [selectedApartment, setSelectedApartment] = useState<Property | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isTourOpen, setIsTourOpen] = useState(false);
  
  // Search filters
  const [searchFilters, setSearchFilters] = useState({
    query: '',
    propertyType: 'all',
    priceRange: 'all',
    location: 'all'
  });
  const [tourDate, setTourDate] = useState<Date | undefined>(undefined);
  const [tourTime, setTourTime] = useState<string>('');
  const [tourForm, setTourForm] = useState<TourFormData>({
    name: '',
    email: '',
    phone: ''
  });

  // Initialize Recoil state with server data
  useEffect(() => {
    setProperties(initialProperties);
    
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favoriteProperties');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, [initialProperties, setProperties, setFavorites]);

  const toggleFavorite = (propertyId: number) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId];
      
      // Save to localStorage
      localStorage.setItem('favoriteProperties', JSON.stringify(newFavorites));
      
      return newFavorites;
    });
  };

  const handleViewDetails = (apartment: Property) => {
    setSelectedApartment(apartment);
    setIsDetailsOpen(true);
  };

  const handleContactAgent = () => {
    setIsContactOpen(true);
    // Pre-fill message with apartment info
    setContactForm(prev => ({
      ...prev,
      message: `Hi, I'm interested in the ${selectedApartment?.title} located at ${selectedApartment?.location}. Please contact me with more information.`
    }));
  };

  const handleContactFormChange = (field: string, value: string) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitContact = () => {
    // Here you would normally send the form data to your backend
    console.log('Contact form submitted:', contactForm);
    alert(`Thank you for your interest! An agent will contact you soon at ${contactForm.email} or ${contactForm.phone}.`);
    
    // Reset form and close modal
    setContactForm({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
    setIsContactOpen(false);
  };

  const handleScheduleTour = () => {
    setIsTourOpen(true);
  };

  const handleTourFormChange = (field: string, value: string) => {
    setTourForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitTour = () => {
    if (!tourDate || !tourTime) {
      alert('Please select both date and time for your tour.');
      return;
    }
    
    // Format the date for display
    const formattedDate = tourDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    console.log('Tour scheduled:', { ...tourForm, date: tourDate, time: tourTime });
    alert(`Tour scheduled for ${formattedDate} at ${tourTime}. You will receive a confirmation email at ${tourForm.email}.`);
    
    // Reset form and close modal
    setTourForm({
      name: '',
      email: '',
      phone: ''
    });
    setTourDate(undefined);
    setTourTime('');
    setIsTourOpen(false);
  };

  // Generate available time slots
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', 
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  // Filter properties based on search criteria
  const filteredProperties = initialProperties.filter(property => {
    // Filter by search query
    if (searchFilters.query && !property.title.toLowerCase().includes(searchFilters.query.toLowerCase()) &&
        !property.location.toLowerCase().includes(searchFilters.query.toLowerCase())) {
      return false;
    }

    // Filter by property type
    if (searchFilters.propertyType !== 'all') {
      // Map property types from search to property data
      const propertyTypeMap: Record<string, string[]> = {
        'apartment': ['apartment', 'loft', 'studio'],
        'house': ['house'],
        'condo': ['condo'],
        'studio': ['studio'],
        'loft': ['loft']
      };
      
      const validTypes = propertyTypeMap[searchFilters.propertyType] || [];
      const propertyType = property.title.toLowerCase();
      
      if (!validTypes.some(type => propertyType.includes(type))) {
        return false;
      }
    }

    // Filter by price range
    if (searchFilters.priceRange !== 'all') {
      const price = parseInt(property.price.replace(/[^0-9]/g, ''));
      const [min, max] = searchFilters.priceRange.split('-').map(p => 
        p === '+' ? Infinity : parseInt(p)
      );
      
      if (max === undefined) {
        // Handle "5000+" case
        if (price < min) return false;
      } else {
        if (price < min || price > max) return false;
      }
    }

    // Filter by location
    if (searchFilters.location !== 'all') {
      const locationMap: Record<string, string[]> = {
        'downtown': ['downtown'],
        'brooklyn': ['brooklyn'],
        'upper-east-side': ['upper east side'],
        'soho': ['soho'],
        'greenwich': ['greenwich']
      };
      
      const validLocations = locationMap[searchFilters.location] || [];
      const propertyLocation = property.location.toLowerCase();
      
      if (!validLocations.some(loc => propertyLocation.includes(loc))) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <SearchComponent onSearch={setSearchFilters} />

      {/* Agent Banner */}
      {session?.user?.role === 'AGENT' && (
        <div className="bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5" />
                <p className="font-medium">Welcome back, {session.user.name}! Ready to manage your properties?</p>
              </div>
              <Link href="/agent/properties">
                <Button variant="secondary" size="sm" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Plus className="w-4 h-4 mr-2" />
                  Manage Properties
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Apartment Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {filteredProperties.map((apartment) => (
            <PropertyCard
              key={apartment.id}
              apartment={apartment}
              onToggleFavorite={() => toggleFavorite(apartment.id)}
              onViewDetails={handleViewDetails}
              onScheduleTour={(apt) => {
                setSelectedApartment(apt);
                handleScheduleTour();
              }}
            />
          ))}
        </div>
      </div>

      {/* Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedApartment && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selectedApartment.title}</DialogTitle>
                <DialogDescription className="text-lg text-gray-600">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  {selectedApartment.location}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                {/* Image */}
                <div className="relative h-96 rounded-lg overflow-hidden">
                  <img
                    src={selectedApartment.image}
                    alt={selectedApartment.title}
                    className="w-full h-full object-cover"
                  />
                  <FavoriteButton propertyId={selectedApartment.id} />
                </div>

                {/* Price and Rating */}
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold text-blue-600">{selectedApartment.price}/month</div>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{selectedApartment.rating}</span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <Bed className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                    <p className="text-sm text-gray-600">Bedrooms</p>
                    <p className="font-semibold">{selectedApartment.bedrooms}</p>
                  </div>
                  <div className="text-center">
                    <Bath className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                    <p className="text-sm text-gray-600">Bathrooms</p>
                    <p className="font-semibold">{selectedApartment.bathrooms}</p>
                  </div>
                  <div className="text-center">
                    <Square className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                    <p className="text-sm text-gray-600">Area</p>
                    <p className="font-semibold">{selectedApartment.area} sqft</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedApartment.description}</p>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedApartment.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleScheduleTour}>
                    Schedule Tour
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={handleContactAgent}>
                    Contact Agent
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Contact Agent Modal */}
      <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Contact Agent</DialogTitle>
            <DialogDescription>
              Fill out the form below and an agent will contact you about {selectedApartment?.title}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitContact(); }} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name *</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={contactForm.name}
                onChange={(e) => handleContactFormChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={contactForm.email}
                onChange={(e) => handleContactFormChange('email', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={contactForm.phone}
                onChange={(e) => handleContactFormChange('phone', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                placeholder="Tell us more about what you're looking for..."
                value={contactForm.message}
                onChange={(e) => handleContactFormChange('message', e.target.value)}
                rows={4}
                required
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsContactOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
          
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">Or contact us directly:</p>
            <div className="flex gap-4 text-sm">
              <a href="tel:+15551234567" className="flex items-center text-blue-600 hover:underline">
                <Phone className="w-4 h-4 mr-1" />
                +1 (555) 123-4567
              </a>
              <a href="mailto:info@realestate.com" className="flex items-center text-blue-600 hover:underline">
                <Mail className="w-4 h-4 mr-1" />
                info@realestate.com
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Tour Modal */}
      <Dialog open={isTourOpen} onOpenChange={setIsTourOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Schedule a Tour</DialogTitle>
            <DialogDescription>
              Select a date and time to visit {selectedApartment?.title}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitTour(); }} className="space-y-6 mt-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Calendar Section */}
              <div className="space-y-2">
                <Label className="text-base font-semibold flex items-center">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Select Date
                </Label>
                <Calendar
                  mode="single"
                  selected={tourDate}
                  onSelect={setTourDate}
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                  className="rounded-md border"
                />
              </div>
              
              {/* Time Selection Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-semibold flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Select Time
                  </Label>
                  <Select value={tourTime} onValueChange={setTourTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Selected DateTime Display */}
                {tourDate && tourTime && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Your tour is scheduled for:</p>
                    <p className="font-semibold text-blue-600">
                      {tourDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="font-semibold text-blue-600">{tourTime}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold">Your Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tour-name">Name *</Label>
                  <Input
                    id="tour-name"
                    placeholder="John Doe"
                    value={tourForm.name}
                    onChange={(e) => handleTourFormChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tour-email">Email *</Label>
                  <Input
                    id="tour-email"
                    type="email"
                    placeholder="john@example.com"
                    value={tourForm.email}
                    onChange={(e) => handleTourFormChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tour-phone">Phone Number *</Label>
                <Input
                  id="tour-phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={tourForm.phone}
                  onChange={(e) => handleTourFormChange('phone', e.target.value)}
                  required
                />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button 
                type="submit" 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!tourDate || !tourTime}
              >
                <Check className="w-4 h-4 mr-2" />
                Confirm Tour
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsTourOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <Footer />
    </div>
  );
}