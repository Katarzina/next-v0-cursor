'use client';

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Star, Award, Home, MessageCircle } from "lucide-react";
import { useLocale } from '@/contexts/LocaleContext';
import Image from 'next/image';
import { Agent } from '@/types';

interface AgentCardProps {
  agent: Agent;
  onContact: (agent: Agent) => void;
  priority?: boolean;
}

export default function AgentCard({ agent, onContact, priority = false }: AgentCardProps) {
  const { t } = useLocale();

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-64">
        <Image
          src={agent.image}
          alt={agent.name}
          fill
          className="object-cover"
          priority={priority}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-semibold">{agent.name}</h3>
          <p className="text-sm opacity-90">{agent.title}</p>
        </div>
        <div className="absolute top-4 right-4">
          <Badge className="bg-white/90 text-gray-800 hover:bg-white">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
            {agent.rating} ({agent.reviewCount} {t.agents.reviews})
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Home className="w-5 h-5 text-gray-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{agent.soldProperties}</p>
            <p className="text-xs text-gray-600">{t.agents.propertiesSold}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Award className="w-5 h-5 text-gray-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{agent.yearsExperience}</p>
            <p className="text-xs text-gray-600">{t.agents.yearsExp}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <MessageCircle className="w-5 h-5 text-gray-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{agent.languages.length}</p>
            <p className="text-xs text-gray-600">{t.agents.languages}</p>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {agent.bio}
        </p>

        {/* Specialties */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">{t.agents.specialties}:</p>
          <div className="flex flex-wrap gap-2">
            {agent.specialties.slice(0, 3).map((specialty, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">{t.agents.speaks}:</p>
          <p className="text-sm text-gray-600">{agent.languages.join(', ')}</p>
        </div>

        {/* Contact Buttons */}
        <div className="flex gap-3">
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => onContact(agent)}
          >
            <Mail className="w-4 h-4 mr-2" />
            {t.agents.contact}
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => window.location.href = `tel:${agent.phone}`}
          >
            <Phone className="w-4 h-4 mr-2" />
            {t.agents.call}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}