'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { useLocale } from '@/contexts/LocaleContext';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: number;
  category: string;
  image: string;
  tags: string[];
}

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const { t } = useLocale();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/90 text-gray-800 hover:bg-white">
            {post.category}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(post.date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{post.readTime} {t.blog.minRead}</span>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>{post.author}</span>
          </div>
          
          <Link 
            href={`/blog/${post.id}`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium group/link"
          >
            {t.blog.readMore}
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}