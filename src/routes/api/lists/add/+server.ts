import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { JWTKEY } from '$env/static/private';
import { list } from 'postcss';

const prisma = new PrismaClient();

type TokenData = {
    id: string;
    username: string;
    email: string;
};

type ListData = {
    id: string;
    content: string[];
    importance: string;
    name: string,
    expiresat: string
};

export const POST = async ({ request }: { request: Request }) => {
    try {
        const listData: ListData = await (request.json()) as ListData
        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            throw new Error('No token provided');
        }

        const verified: TokenData = jwt.verify(token, JWTKEY);

        const { id } = verified;
        const result = await prisma.user.update({
            where: {
                id: verified.id
            },
            data: {
                lists: {
                    create: {
                        list: {
                            create: {
                                expiresat: listData.expiresat ||  new Date(),
                                content: listData.content || [''],
                                importance: listData.importance || 'DEFAULT',
                                name: listData.name || ''
                            }
                        }
                    }
                }
            }
        })

        console.log(result);


        return new Response(
            JSON.stringify({ message: 'Sikeres hozzáadás!', result }),
            { status: 201 },
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: 'Hiba történt!', error: error.message }),
            { status: 500 },
        );
    }
};
