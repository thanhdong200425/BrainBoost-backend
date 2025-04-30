import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { Response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import { AIRepository } from '../repositories/AIRepository';

dotenv.config();

export class AIController {
    private aiRepository: AIRepository;
    constructor() {
        this.aiRepository = new AIRepository();
    }
    generateFlashcardsBasedOnTopicAndLevel = async (
        req: AuthenticatedRequest,
        res: Response
    ): Promise<void> => {
        try {
            const { id } = req.user;
            if (!id) {
                res.status(400).send('User not found');
                return;
            }
            const { topic, level, quantity } = req.body;
            if (!topic || !level) {
                res.status(400).send('Topic and level are required');
                return;
            }
            const rawResponse = await this.aiRepository.handleRequest(quantity, topic, level);
            res.status(200).json({
                response: rawResponse,
            });
        } catch (error) {
            console.log('Error getting flashcards from ai server: ' + error);
            res.status(500).send('Internal Server Error');
        }
    };
}
