import { PrismaClient } from "../../generated/prisma/client"; 
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// 1. Create a connection pool using your environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 2. Initialize the Prisma adapter
const adapter = new PrismaPg(pool);

// 3. Pass the adapter to the PrismaClient constructor
export const prisma = new PrismaClient({
  adapter,
});