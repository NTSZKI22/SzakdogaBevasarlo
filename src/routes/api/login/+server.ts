import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { JWTKEY } from '$env/static/private';

const prisma = new PrismaClient();

type User = {
	username: string;
	password: string;
	email: string;
};

type TokenData = {
	id: string;
	username: string;
	email: string;
};

export const POST = async ({ request }: { request: Request }) => {
	try {
		const user = (await request.json()) as User;
		console.log(user)
		const registeredUser = await prisma.user.findFirst({
			where: {
					username: user.username
			}
		});
		console.log(registeredUser)
		if (registeredUser && bcrypt.compareSync(user.password, registeredUser.password)) {
			const newTokenData: TokenData = {
				username: registeredUser.username,
				email: user.email,
				id: registeredUser.id
			};

			const token = jwt.sign(newTokenData, JWTKEY);
			return new Response(JSON.stringify({ message: 'Sikeres bejelentkezés!', token: token }), {
				status: 200
			});
		} else {
			return new Response(JSON.stringify({ message: 'Hibás felhasználónév vagy jelszó!' }), {
				status: 401
			});
		}
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify({ message: 'Hiba történt!' }), { status: 500 });
	}
};
