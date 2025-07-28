'use client';

import React, { useState } from 'react';
import { Search, Filter, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AgentCard from '@/components/AgentCard';
import Footer from '@/components/Footer';
import { useLocale } from '@/contexts/LocaleContext';
import { Agent } from '@/types';

const agents: Agent[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Senior Real Estate Agent",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60",
    rating: 4.9,
    reviewCount: 127,
    soldProperties: 156,
    yearsExperience: 12,
    languages: ["English", "Spanish"],
    specialties: ["Luxury Homes", "Investment Properties", "First-time Buyers"],
    phone: "+1 (555) 123-4567",
    email: "sarah.johnson@propertyfinder.com",
    bio: "With over 12 years of experience in New York real estate, Sarah specializes in luxury properties and has helped hundreds of clients find their dream homes."
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Real Estate Consultant",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviewCount: 98,
    soldProperties: 134,
    yearsExperience: 8,
    languages: ["English", "Mandarin", "Cantonese"],
    specialties: ["Commercial Properties", "Condos", "International Buyers"],
    phone: "+1 (555) 234-5678",
    email: "michael.chen@propertyfinder.com",
    bio: "Michael brings a global perspective to real estate, helping international clients navigate the New York market with expertise and cultural understanding."
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    title: "Property Specialist",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=60",
    rating: 4.9,
    reviewCount: 115,
    soldProperties: 142,
    yearsExperience: 10,
    languages: ["English", "Spanish", "Portuguese"],
    specialties: ["Family Homes", "Relocations", "Neighborhoods"],
    phone: "+1 (555) 345-6789",
    email: "emily.rodriguez@propertyfinder.com",
    bio: "Emily is passionate about helping families find the perfect home. Her deep knowledge of New York neighborhoods makes her an invaluable resource."
  },
  {
    id: 4,
    name: "David Kim",
    title: "Luxury Property Expert",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60",
    rating: 5.0,
    reviewCount: 89,
    soldProperties: 178,
    yearsExperience: 15,
    languages: ["English", "Korean"],
    specialties: ["Penthouses", "Waterfront Properties", "High-end Rentals"],
    phone: "+1 (555) 456-7890",
    email: "david.kim@propertyfinder.com",
    bio: "David is the go-to expert for luxury real estate in New York. His attention to detail and market knowledge ensure clients get the best value."
  },
  {
    id: 5,
    name: "Anna Petrova",
    title: "Investment Property Advisor",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60",
    rating: 4.7,
    reviewCount: 76,
    soldProperties: 98,
    yearsExperience: 6,
    languages: ["English", "Russian", "Ukrainian"],
    specialties: ["Investment Properties", "Rental Income", "Market Analysis"],
    phone: "+1 (555) 567-8901",
    email: "anna.petrova@propertyfinder.com",
    bio: "Anna helps investors maximize their returns in the New York real estate market with data-driven insights and strategic property selection."
  },
  {
    id: 6,
    name: "James Thompson",
    title: "Relocation Specialist",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60",
    rating: 4.8,
    reviewCount: 103,
    soldProperties: 125,
    yearsExperience: 9,
    languages: ["English", "French"],
    specialties: ["Corporate Relocations", "Furnished Rentals", "Short-term Leases"],
    phone: "+1 (555) 678-9012",
    email: "james.thompson@propertyfinder.com",
    bio: "James specializes in helping professionals and families relocate to New York, providing comprehensive support throughout the entire process."
  }
];

export default function AgentsPage() {
  const { t } = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState<typeof agents[0] | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Get unique specialties and languages
  const allSpecialties = [...new Set(agents.flatMap(agent => agent.specialties))];
  const allLanguages = [...new Set(agents.flatMap(agent => agent.languages))];

  // Filter agents
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || agent.specialties.includes(selectedSpecialty);
    const matchesLanguage = selectedLanguage === 'all' || agent.languages.includes(selectedLanguage);
    
    return matchesSearch && matchesSpecialty && matchesLanguage;
  });

  const handleContact = (agent: typeof agents[0]) => {
    setSelectedAgent(agent);
    setContactForm(prev => ({
      ...prev,
      message: t.agents.defaultMessage
        .replace('{agent}', agent.name)
        .replace('{specialty}', agent.specialties[0])
    }));
    setIsContactOpen(true);
  };

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    alert(t.agents.contactSuccess);
    
    setContactForm({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
    setIsContactOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6" />
              {t.nav.agents}
            </h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">{t.agents.heroTitle}</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">{t.agents.heroSubtitle}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder={t.agents.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Specialty Filter */}
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger>
                <SelectValue placeholder={t.agents.allSpecialties} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.agents.allSpecialties}</SelectItem>
                {allSpecialties.map(specialty => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Language Filter */}
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue placeholder={t.agents.allLanguages} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.agents.allLanguages}</SelectItem>
                {allLanguages.map(language => (
                  <SelectItem key={language} value={language}>
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button 
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty('all');
                setSelectedLanguage('all');
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              {t.agents.clearFilters}
            </Button>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mb-6">
          <p className="text-gray-600">
            {t.agents.showingAgents.replace('{count}', filteredAgents.length.toString())}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map(agent => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onContact={handleContact}
            />
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">{t.agents.noAgentsFound}</p>
          </div>
        )}
      </div>

      {/* Contact Modal */}
      <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t.agents.contactAgent}</DialogTitle>
            <DialogDescription>
              {t.agents.contactSubtitle} {selectedAgent?.name}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitContact} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name">{t.contact.name} *</Label>
              <Input
                id="contact-name"
                value={contactForm.name}
                onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-email">{t.contact.email} *</Label>
              <Input
                id="contact-email"
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-phone">{t.contact.phone}</Label>
              <Input
                id="contact-phone"
                type="tel"
                value={contactForm.phone}
                onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-message">{t.contact.message} *</Label>
              <Textarea
                id="contact-message"
                value={contactForm.message}
                onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
                required
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                {t.contact.sendMessage}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsContactOpen(false)}
              >
                {t.contact.cancel}
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