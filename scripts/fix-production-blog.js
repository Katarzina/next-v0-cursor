const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixProductionBlog() {
  console.log('🔍 [Production] Finding Historic Homes blog post...');
  
  try {
    // Найдем пост с Historic Homes
    const post = await prisma.blogPost.findFirst({
      where: {
        title: {
          contains: 'Historic Homes'
        }
      }
    });

    if (!post) {
      console.log('❌ Post not found. Checking all posts...');
      const allPosts = await prisma.blogPost.findMany({
        select: {
          id: true,
          title: true,
          image: true
        }
      });
      console.log('📋 Available blog posts:');
      allPosts.forEach(p => {
        console.log(`  - ${p.title}`);
        if (p.image.includes('photo-1609766934428')) {
          console.log(`    ⚠️ Found broken image: ${p.image}`);
        }
      });
      return;
    }

    console.log('✅ Found post:', post.title);
    console.log('🖼️ Current image:', post.image);

    // Проверяем, нужно ли обновлять
    if (!post.image.includes('photo-1609766934428')) {
      console.log('✅ Image is already correct, no update needed');
      return;
    }

    // Обновляем картинку на рабочую
    const newImage = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=60';
    
    const updatedPost = await prisma.blogPost.update({
      where: { id: post.id },
      data: { image: newImage }
    });

    console.log('🎉 Successfully updated image!');
    console.log('📸 New image URL:', updatedPost.image);
    console.log('✅ Production blog image fixed!');
    
  } catch (error) {
    console.error('❌ Error fixing production blog:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем только если это главный модуль
if (require.main === module) {
  fixProductionBlog();
}

module.exports = { fixProductionBlog };