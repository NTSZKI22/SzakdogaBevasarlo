import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { JWTKEY } from '$env/static/private';

const prisma = new PrismaClient();

type TokenData = {
    id: string;
    username: string;
    email: string;
};

export const POST = async ({ request }: { request: Request }) => {
    try {
        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            throw new Error('No token provided');
        }

        const verified: TokenData = jwt.verify(token, JWTKEY);

        const { id } = verified;
        const result = await prisma.list.update({
            where: {
                id: request.body.id
            },
            data: {
                users: {
                    create: {
                        user: {
                            connect: {
                               id: verified.id 
                            }
                        }
                    }
                }
            },
            include: {
                users: true
            }
        })

        console.log(result);


        return new Response(
            JSON.stringify({ message: 'Sikeres hozzáadás!', result }),
            { status: 200 },
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: 'Hiba történt!', error: error.message }),
            { status: 500 },
        );
    }
};
