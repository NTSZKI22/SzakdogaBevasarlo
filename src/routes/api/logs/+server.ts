import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const GET = async () => {
	return new Response(JSON.stringify(await prisma.user.findMany({})), { status: 200 });
};
