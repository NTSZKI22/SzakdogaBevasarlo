import express, { Express, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

type TokenData = {
    username: String,
    email: String
}

dotenv.config();

const prisma = new PrismaClient();
const jwtKey = process.env.JWTKEY;

export async function LoginController(req: Request, res: Response) {
    const User = await prisma.users.findFirst({
        where: {
            OR: {
                username: req.body.username,
                emailaddress: req.body.emailaddress
            }
        }
    })
    if(User){
        if(await bcrypt.compareSync(req.body.password, User.password)){
            const tokenData: TokenData = {
                username: req.body.username,
                email: req.body.emailaddress
            }
            const token: String = jwt.sign(tokenData, '' + jwtKey, { expiresIn: '7d' });
            return res.status(200).json({ message: 'Sikeres bejelentkezés!', token: token })

            //res.status(200).json({message: 'Sikeres bejelentkezés'})
        }else{
            res.status(401).json({message: 'Rossz adatok!'})
        }
    }else{
        res.status(401).json({message: 'Rossz adatok!'})
    }
}