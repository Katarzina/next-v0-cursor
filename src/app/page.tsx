'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, MapPin, Square, Heart, Star, Send, Phone, Mail, CalendarDays, Clock, Check } from "lucide-react";
import ApartmentCard from "@/components/ApartmentCard";
import SearchComponent from "@/components/SearchComponent";
import Footer from "@/components/Footer";
import { Property, ContactFormData, TourFormData } from "@/types";

const apartments: Property[] = [
  {
    id: 1,
    title: "Modern Downtown Loft",
    price: "$2,850",
    location: "Downtown, New York",
    bedrooms: 2,
    bathrooms: 2,
    area: "1,200",
    image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800",
    rating: 4.8,
    featured: true,
    amenities: ["Gym", "Pool", "Parking"],
    description: "Experience urban living at its finest in this stunning modern loft located in the heart of downtown. This beautifully designed space features floor-to-ceiling windows offering breathtaking city views, high ceilings, and an open-concept layout perfect for entertaining. The gourmet kitchen boasts stainless steel appliances and granite countertops. Building amenities include 24/7 concierge service, fitness center, and rooftop terrace."
  },
  {
    id: 2,
    title: "Cozy Studio Apartment",
    price: "$1,650",
    location: "Brooklyn, New York",
    bedrooms: 1,
    bathrooms: 1,
    area: "650",
    image: "https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg?auto=compress&cs=tinysrgb&w=800",
    rating: 4.6,
    featured: false,
    amenities: ["Balcony", "Laundry", "Pet-friendly"],
    description: "This charming studio apartment offers the perfect blend of comfort and convenience. Thoughtfully designed to maximize space, it features a modern kitchen with full-size appliances, ample storage, and a private balcony with garden views. Located in a vibrant Brooklyn neighborhood with easy access to cafes, restaurants, and public transportation. Pet-friendly building with on-site laundry facilities."
  },
  {
    id: 3,
    title: "Luxury Penthouse Suite",
    price: "$4,200",
    location: "Upper East Side, New York",
    bedrooms: 3,
    bathrooms: 3,
    area: "2,100",
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
    rating: 4.9,
    featured: true,
    amenities: ["Concierge", "Rooftop", "Doorman"],
    description: "Indulge in luxury living with this exquisite penthouse suite on the prestigious Upper East Side. This sophisticated residence features a grand master suite, two additional bedrooms with en-suite bathrooms, and a spectacular private rooftop terrace with panoramic city views. Premium finishes include hardwood floors, marble bathrooms, and a chef's kitchen with top-of-the-line appliances. White-glove building services ensure the ultimate in comfort and privacy."
  },
  {
    id: 4,
    title: "Waterfront Condo",
    price: "$3,500",
    location: "Battery Park, New York",
    bedrooms: 2,
    bathrooms: 2,
    area: "1,450",
    image: "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800",
    rating: 4.7,
    featured: false,
    amenities: ["Water View", "Gym", "Valet Parking", "Spa"],
    description: "Wake up to stunning water views in this elegant waterfront condominium. This residence features floor-to-ceiling windows, a gourmet kitchen with waterfall island, and spa-inspired bathrooms. Enjoy resort-style amenities including a state-of-the-art fitness center, spa facilities, and valet parking. The building's prime location offers easy access to parks, fine dining, and financial district."
  },
  {
    id: 5,
    title: "Trendy SoHo Loft",
    price: "$3,200",
    location: "SoHo, New York",
    bedrooms: 1,
    bathrooms: 1,
    area: "950",
    image: "https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg?auto=compress&cs=tinysrgb&w=800",
    rating: 4.5,
    featured: true,
    amenities: ["High Ceilings", "Exposed Brick", "Elevator"],
    description: "Live in the heart of SoHo in this authentic New York loft featuring 12-foot ceilings, exposed brick walls, and oversized windows. The open layout creates a perfect live/work space for creatives and professionals. Original hardwood floors and industrial details blend seamlessly with modern updates. Steps away from galleries, boutiques, and the best restaurants in the city."
  },
  {
    id: 6,
    title: "Garden Duplex",
    price: "$2,400",
    location: "Greenwich Village, New York",
    bedrooms: 2,
    bathrooms: 1,
    area: "1,100",
    image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800",
    rating: 4.6,
    featured: false,
    amenities: ["Private Garden", "Fireplace", "Storage"],
    description: "Rare garden duplex in a historic Greenwich Village brownstone. This charming home features a private garden oasis, working fireplace, and abundant natural light. The updated kitchen and bathroom complement the apartment's pre-war charm. Located on a tree-lined street close to Washington Square Park and excellent transportation options."
  }
];

export default function Home() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
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
  const [tourDate, setTourDate] = useState<Date | undefined>(undefined);
  const [tourTime, setTourTime] = useState<string>('');
  const [tourForm, setTourForm] = useState<TourFormData>({
    name: '',
    email: '',
    phone: ''
  });

  const toggleFavorite = (id: number) => {
    setFavoriteIds(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  const handleViewDetails = (apartment: typeof apartments[0]) => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <SearchComponent />

      {/* Apartment Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {apartments.map((apartment) => (
            <ApartmentCard
              key={apartment.id}
              apartment={apartment}
              isFavorite={favoriteIds.includes(apartment.id)}
              onToggleFavorite={toggleFavorite}
              onViewDetails={handleViewDetails}
              onScheduleTour={(apt) => {
                setSelectedApartment(apt);
                handleScheduleTour();
              }}
            />
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Looking for something specific?
          </h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            Our team can help you find the perfect apartment that matches your needs and budget.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200">
            Browse More Listings
          </Button>
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
                  <Button
                    size="icon"
                    className={`absolute top-4 right-4 bg-white/90 hover:bg-white ${
                      favoriteIds.includes(selectedApartment.id) ? 'text-red-500' : 'text-gray-600'
                    }`}
                    onClick={() => toggleFavorite(selectedApartment.id)}
                  >
                    <Heart className={`w-5 h-5 ${favoriteIds.includes(selectedApartment.id) ? 'fill-current' : ''}`} />
                  </Button>
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
        <DialogContent className="max-w-2xl">
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