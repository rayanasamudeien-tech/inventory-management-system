// Load environment variables first
import 'dotenv/config';

// Ensure DATABASE_URL is defined for Prisma even in dev fallback
// This must be imported before anything else
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://dummy:dummy@localhost:5432/dummy';
}
