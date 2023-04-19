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

type shareData = {
    email: string
}


export const POST = async ({ params, request }: { params: { id: string }, request: Request }) => {
    try {
        const listId = params.id;
        const token = request.headers.get('Authorization')?.split(' ')[1];
        const shareData: shareData = await request.json() as shareData
        console.log(shareData)
        if (!token) {
            throw new Error('No token provided');
        }

        const verified: TokenData = jwt.verify(token, JWTKEY);

        const { id } = verified;
        const result = await prisma.list.update({
            where: {
                id: listId
            },
            data: {
                users: {
                    create: {
                        user: {
                            connect: {
                                email: shareData.email
                            }
                        }
                    }
                }
            },
            include: {
                users: true
            }
        })

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
