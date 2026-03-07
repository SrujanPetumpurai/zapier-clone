import { PrismaClient } from '@prisma/client';
// Create a singleton instance to prevent exhausting database connections
export const prisma = new PrismaClient();
//# sourceMappingURL=db.js.map