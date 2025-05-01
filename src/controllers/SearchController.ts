import { Response } from 'express';
import { DeckRepository } from '../repositories/DeckRepository';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export class SearchController {
    private deckRepository: DeckRepository;

    constructor() {
        this.deckRepository = new DeckRepository();
    }

    search = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const keyword = req.query.keyword as string;
            const limit = parseInt(req.query.limit as string) || 10;

            if (!keyword) {
                res.status(400).json({ message: 'Missing search keyword' });
                return;
            }

            const decks = await this.deckRepository.findByKeyword(keyword);

            res.status(200).json({
                data: {
                    decks
                },
            });
        } catch (error) {
            console.error('Error during search:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
}
