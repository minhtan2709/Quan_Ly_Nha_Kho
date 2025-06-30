import { registerAs } from "@nestjs/config";
export default registerAs('database', () => ({
  url: process.env.DATABASE_URL || 'postgresql://postgres:minhtan@localhost:5432/Warehouse_Management',
  sync: process.env.DATABASE_SYNC === 'true'
}))