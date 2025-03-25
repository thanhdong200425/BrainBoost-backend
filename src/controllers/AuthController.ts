import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export class AuthController {
    private userRepository: UserRepository;
    constructor() {
        this.userRepository = new UserRepository();
    }

    signUp = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password, confirmPassword } = req.body;

            if (confirmPassword !== password) {
                res.status(400).json({ message: "Passwords do not match" });
                return;
            }

            const existingUser = await this.userRepository.findByEmail(email);
            if (existingUser) {
                res.status(400).json({ message: "User already exists" });
                return;
            }

            const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS!));
            await this.userRepository.create({ email, password: hashedPassword });
            const accessToken = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: "7d" });

            res.status(200).json({ message: "User created successfully", token: accessToken });
        } catch (error) {
            console.error("Error signing up user", error);
            res.status(500).json({ message: "Oops! Sorry, we have some problems" });
        }
    };

    signIn = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                res.status(400).json({ message: "Invalid email" });
                return;
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(400).json({ message: "Invalid password" });
                return;
            }

            const accessToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET!, { expiresIn: "7d" });
            res.status(200).json({ message: "User signed in successfully", token: accessToken });
        } catch (error) {
            console.error("Error signing in user", error);
            res.status(500).json({ message: "Oops! Sorry, we have some problems" });
        }
    };
}
