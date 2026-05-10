const { PrismaClient } = require('@prisma/client');

async function test() {
  const prisma = new PrismaClient();
  try {
    console.log('Available models:', Object.keys(prisma).filter(k => k.includes('asset') || k.includes('Asset')));
    console.log('Has assetCategory:', typeof prisma.assetCategory);
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

test();