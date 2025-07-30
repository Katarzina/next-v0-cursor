'use client';

import React from 'react';
import { BlogPost } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, Eye, User } from 'lucide-react';
import { format } from 'date-fns';
import { useLocale } from '@/contexts/LocaleContext';
import Footer from '@/components/Footer';

interface BlogPostClientProps {
  post: BlogPost;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const { t } = useLocale();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t.blog.backToBlog || 'Back to Blog'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Image */}
        <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Badge variant="secondary">{post.category}</Badge>
            <span className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-600">
              <Eye className="w-4 h-4" />
              {post.views} views
            </span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            {post.excerpt}
          </p>

          {/* Author Info */}
          <div className="flex items-center gap-4 pb-8 border-b">
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={post.authorAvatar || '/images/default-avatar.png'}
                alt={post.author}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-medium text-gray-900">{post.author}</p>
              <p className="text-sm text-gray-600">
                <Calendar className="w-4 h-4 inline mr-1" />
                {format(new Date(post.date), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-8">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-8 border-t">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Share Section */}
        <div className="mt-12 p-6 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Share this article</h3>
          <div className="flex gap-4">
            <Button variant="outline" size="sm">
              Share on Twitter
            </Button>
            <Button variant="outline" size="sm">
              Share on Facebook
            </Button>
            <Button variant="outline" size="sm">
              Copy Link
            </Button>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
          <div className="text-center text-gray-600">
            More articles coming soon...
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}