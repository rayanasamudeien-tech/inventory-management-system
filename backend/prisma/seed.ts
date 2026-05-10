import { PrismaClient, Role, Department } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Create Roles
  const roles = [
    { name: 'SUPER_ADMIN', description: 'Full system access' },
    { name: 'SCHOOL_ADMIN', description: 'School-wide management' },
    { name: 'INVENTORY_MANAGER', description: 'Asset and stock control' },
    { name: 'STOREKEEPER', description: 'Daily stock movements' },
    { name: 'TECHNICIAN', description: 'Repairs and maintenance' },
  ];

  console.log('Seeding roles...');
  const createdRoles: Role[] = [];
  for (const role of roles) {
    const r = await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
    createdRoles.push(r);
  }

  // 2. Create Departments
  const departments = [
    { name: 'ICT Department' },
    { name: 'Science Department' },
    { name: 'Administration' },
    { name: 'Sports' },
  ];

  console.log('Seeding departments...');
  const createdDepts: Department[] = [];
  for (const dept of departments) {
    const d = await prisma.department.upsert({
      where: { name: dept.name },
      update: {},
      create: dept,
    });
    createdDepts.push(d);
  }

  // 3. Create Default Admin User
  const adminRole = createdRoles.find(r => r.name === 'SUPER_ADMIN');
  if (!adminRole) {
    throw new Error('SUPER_ADMIN role not found');
  }

  const adminPassword = await bcrypt.hash('admin123', 10);

  console.log('Seeding default admin user...');
  await prisma.user.upsert({
    where: { email: 'admin@starhacs.edu' },
    update: {},
    create: {
      email: 'admin@starhacs.edu',
      password: adminPassword,
      firstName: 'System',
      lastName: 'Administrator',
      roleId: adminRole.id,
      isActive: true,
    },
  });

  // 4. Create Asset Categories
  const categories = [
    { name: 'ICT Equipment', description: 'Computers, printers, and IT devices' },
    { name: 'Furniture', description: 'Desks, chairs, and office furniture' },
    { name: 'Lab Tools', description: 'Laboratory equipment and tools' },
  ];

  console.log('Seeding asset categories...');
  for (const cat of categories) {
    await prisma.assetCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  // 5. Create Locations
  const locations = [
    { name: 'Main Store' },
    { name: 'Computer Lab 1' },
    { name: 'Science Lab' },
  ];

  console.log('Seeding locations...');
  for (const loc of locations) {
    await prisma.location.upsert({
      where: { name: loc.name },
      update: {},
      create: loc,
    });
  }

  // 6. Create Suppliers
  const suppliers = [
    { name: 'EduTech Solutions', category: 'Technology', email: 'orders@edutech.com' },
    { name: 'Office Mart Ltd', category: 'Office Supplies', email: 'supplies@officemart.com' },
    { name: 'Scientific Supplies', category: 'Lab Equipment', email: 'info@scisupplies.com' },
  ];

  console.log('Seeding suppliers...');
  for (const supp of suppliers) {
    await prisma.supplier.upsert({
      where: { name: supp.name },
      update: {},
      create: supp,
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
