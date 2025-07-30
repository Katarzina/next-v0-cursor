import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import BlogPostClient from '@/components/BlogPostClient';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

async function getBlogPost(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug }
    });
    return post;
  } catch (error) {
    console.error('Failed to fetch blog post:', error);
    return null;
  }
}

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    select: { slug: true }
  });
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    notFound();
  }
  
  return <BlogPostClient post={post} />;
}