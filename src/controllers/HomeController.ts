// controllers/HomeController.ts
import { Request, Response } from 'express';
import { DeckRepository } from '../repositories/DeckRepository';

const deckRepository = new DeckRepository();

export class HomeController {
    private deckRepository: DeckRepository;

    constructor() {
        this.deckRepository = new DeckRepository();
    }

    getPublicDecks = async (req: Request, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const decks = await this.deckRepository.getPublicDecks(page, limit);
            res.status(200).json({
                success: true,
                data: decks,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching decks',
                error: error,
            });
        }
    };
}