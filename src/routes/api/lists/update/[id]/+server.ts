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

type ListData = {
    id: string;
    content: string[];
    importance: string;
    name: string,
    expiresat: string
};

export const POST = async ({ params, request }: { params: { id: string }, request: Request }) => {
    try {
        const listId = params.id;
        const listData: ListData = await (request.json()) as ListData
        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            throw new Error('No token provided');
        }

        const verified: TokenData = jwt.verify(token, JWTKEY);

        const { id } = verified;
        const oldData = await prisma.list.findFirst({
            where: {
                id: listId
            }
        })
        console.log(oldData)
        const result = await prisma.list.update({
            where: {
                id: oldData.id
            },
            data: {
                content: listData.content || oldData?.content,
                expiresat: listData.expiresat || oldData?.expiresat,
                importance: oldData?.importance,
                name: listData.name || oldData?.name

            }
        })
        return new Response(
            JSON.stringify({ message: 'Sikeres frissítés!', result }),
            { status: 201 },
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: 'Hiba történt!', error: error.message }),
            { status: 500 },
        );
    }
};
