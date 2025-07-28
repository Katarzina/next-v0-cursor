import { prisma } from '@/lib/prisma';
import BlogClient from '@/components/BlogClient';

async function getBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: {
        date: 'desc'
      }
    });
    return posts;
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  
  return <BlogClient initialPosts={posts} />;
}