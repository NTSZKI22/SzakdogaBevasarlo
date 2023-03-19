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

const saltRounds = 14;
const prisma = new PrismaClient();
const jwtKey = process.env.JWTKEY;

export async function RegisterController(req: Request, res: Response) {
    if (req.body.emailaddress && req.body.username && req.body.password) {
        await prisma.users.create({
            data: {
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password, saltRounds),
                emailaddress: req.body.emailaddress
            }
        })
        const data: TokenData = {
            username: req.body.username,
            email: req.body.emailaddress
        }
        const token: String = jwt.sign(data, '' + jwtKey, { expiresIn: '7d' });
        return res.status(201).json({ message: 'Sikeres regisztráció!', token: token })
    }
    else {
        return res.status(400).json({ message: 'Egy, vagy több adat nem lett elküldve.' })
    }
}



