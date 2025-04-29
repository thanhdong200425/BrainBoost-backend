import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { UserRepository } from '../repositories/UserRepository';
import argon2 from 'argon2';
import { User } from '../entities';

export class ProfileController {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const email = req.user.email;
            const user = await this.userRepository.findByEmail(email);

            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            res.status(200).json({ data: user });
        } catch (error) {
            console.error('Error getProfile():', error);
            res.status(500).json({ message: 'Oops! Sorry, we have some problems' });
        }
    };

    updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user.id;
            const { username, email, dob, avatar_url } = req.body;

            const updatedUser = await this.userRepository.updateById(userId, {
                username,
                email,
                dob,
                avatar_url,
            });

            if (!updatedUser) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            res.status(200).json({ data: updatedUser });
        } catch (error) {
            console.error('Error updateProfile():', error);
            res.status(500).json({ message: 'Oops! Sorry, we have some problems' });
        }
    };
}
