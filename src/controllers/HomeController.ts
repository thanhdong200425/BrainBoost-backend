import { Request, Response } from 'express';
import { DeckRepository } from '../repositories/DeckRepository';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export class HomeController {
    private deckRepository: DeckRepository;

    constructor() {
        this.deckRepository = new DeckRepository();
    }

    getDecks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const userEmail = req.user?.email;
            if (!userEmail) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const foundDecks = await this.deckRepository.findByEmail(userEmail);
            res.status(200).json({
                data: foundDecks,
            });
        } catch (error) {
            console.log('Error fetching decks:', error);
            res.status(500).json({
                message: error || 'Internal server error',
            });
        }
    };
}
