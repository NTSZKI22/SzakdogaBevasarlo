import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt, { Secret, JwtPayload, decode } from 'jsonwebtoken';
import { JWTKEY } from '$env/static/private';
import { detach_dev } from 'svelte/internal';

const prisma = new PrismaClient();

type TokenData = {
	id: string;
	username: string;
	email: string;
};

export const POST = async ({ request }: { request: Request }) => {
	try {
		const authHeader = request.headers.get('Authorization');
		if (!authHeader) {
			throw new Error('Authorization header not found');
		}

		const token = authHeader.split(' ')[1];
		const decodedToken = jwt.verify(token, JWTKEY) as TokenData;

		const user = await prisma.user.findFirst({
			where: {
				id: decodedToken.id
			},
			select: {
				email: true,
				id: true,
				username: true
			}
		});
		return new Response(
			JSON.stringify({ message: 'Authorized', id: decodedToken?.id, user: user }),
			{ status: 200 }
		);
	} catch (err) {
		console.error(err);
		return {
			status: 401,
			body: { error: 'Unauthorized' }
		};
	}
};
