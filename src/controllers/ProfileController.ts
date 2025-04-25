import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { UserRepository } from '../repositories/UserRepository';
import argon2 from 'argon2';

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

    // updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    //     try {
    //         const email = req.user.email;
    //         const { username, dob } = req.body;

    //         // Nếu có file được ypload, get đường dẫn public URL
    //         let avatar_url = req.body.avatar_url
    //         if (req.file) {
    //             const protocol = req.protocol
    //             const host = req.get('host')
    //             avatar_url = `${protocol}://${host}/uploads/${req.file.filename}`
    //         }

    //         const updatedUser = await this.userRepository.updateByEmail(email, {
    //             username,
    //             dob,
    //             avatar_url,
    //         });

    //         if (!updatedUser) {
    //             res.status(404).json({ message: 'User not found' });
    //             return;
    //         }

    //         res.status(200).json({ data: updatedUser });
    //     } catch (error) {
    //         console.error('Error updateProfile():', error);
    //         res.status(500).json({ message: 'Oops! Sorry, we have some problems' });
    //     }
    // };
    // updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    //     try {
    //         const email = req.user.email;
    //         const { username, dob, avatar_url } = req.body;

    //         const updatedUser = await this.userRepository.updateByEmail(email, {
    //             username,
    //             dob,
    //             avatar_url,
    //         });

    //         if (!updatedUser) {
    //             res.status(404).json({ message: 'User not found' });
    //             return;
    //         }

    //         res.status(200).json({ data: updatedUser });
    //     } catch (error) {
    //         console.error('Error updateProfile():', error);
    //         res.status(500).json({ message: 'Oops! Sorry, we have some problems' });
    //     }
    // };

    updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const email = req.user.email;
            const { username, dob, avatar_url, current_password, new_password } = req.body;

            const existingUser = await this.userRepository.findByEmail(email);
            if (!existingUser) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            if ((current_password || new_password) && (!current_password || !new_password)) {
                res.status(400).json({ message: 'Both current password and new password are required to change the password.' });
                return;
            }

            if (current_password && new_password) {
                const isPasswordValid = await argon2.verify(existingUser.password, current_password);
                if (!isPasswordValid) {
                    res.status(400).json({ message: 'Current password is incorrect' });
                    return;
                }

                const hashedPassword = await argon2.hash(new_password);
                existingUser.password = hashedPassword;
            }

            existingUser.username = username || existingUser.username;
            existingUser.dob = dob || existingUser.dob;
            existingUser.avatar_url = avatar_url || existingUser.avatar_url;

            const updatedUser = await this.userRepository.save(existingUser);

            res.status(200).json({ data: updatedUser });
        } catch (error) {
            console.error('Error updateProfile():', error);
            res.status(500).json({ message: 'Oops! Sorry, we have some problems' });
        }
    };
}
