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

interface AgentsClientProps {
  initialAgents: Agent[];
}

export default function AgentsClient({ initialAgents }: AgentsClientProps) {
  const { t } = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Get unique specialties and languages
  const specialtiesSet = new Set<string>();
  const languagesSet = new Set<string>();
  
  initialAgents.forEach(agent => {
    agent.specialties.forEach(specialty => specialtiesSet.add(specialty));
    agent.languages.forEach(language => languagesSet.add(language));
  });
  
  const allSpecialties = Array.from(specialtiesSet);
  const allLanguages = Array.from(languagesSet);

  // Filter agents
  const filteredAgents = initialAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || agent.specialties.includes(selectedSpecialty);
    const matchesLanguage = selectedLanguage === 'all' || agent.languages.includes(selectedLanguage);
    
    return matchesSearch && matchesSpecialty && matchesLanguage;
  });

  const handleContact = (agent: Agent) => {
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
          {filteredAgents.map((agent, index) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onContact={handleContact}
              priority={index < 3}
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