import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { DeckRepository } from '../repositories/DeckRepository';
import { FlashcardRepository } from '../repositories/FlashcardRepository';

export class DeckController {
    private deckRepository: DeckRepository;
    private flashcardRepository: FlashcardRepository;
    constructor() {
        this.deckRepository = new DeckRepository();
        this.flashcardRepository = new FlashcardRepository();
    }

    getDecks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user.id;

            const decks = await this.deckRepository.findByUserId(userId, 'all');
            res.status(200).json({
                data: {
                    decks,
                },
            });
        } catch (error) {
            console.error('Error getDecks(): ', error);
            res.status(500).json({ message: 'Oops! Sorry, we have some problems' });
        }
    };

    getDeckById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const deckId = req.params?.id;
            if (!deckId) {
                res.status(400).json({ message: 'Deck ID is required' });
                return;
            }

            const deck = await this.deckRepository.findById(deckId);
            if (!deck) {
                res.status(404).json({ message: 'Deck not found' });
                return;
            }

            const flashcards = await this.flashcardRepository.findByDeckId(deckId, 'all');

            res.status(200).json({
                data: {
                    ...deck,
                    flashcards,
                },
            });
        } catch (error) {
            console.error('Error getDeckById(): ', error);
            res.status(500).json({ message: 'Oops! Sorry, we have some problems' });
        }
    };

    addDeck = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const userId = req.user.id;

        const { name, description } = req.body;
        if (!name || !description) {
            res.status(400).json({ message: 'Name and description are required' });
            return;
        }
        const newDeck = await this.deckRepository.create({
            name,
            description,
            author: {
                id: userId,
            },
        });

        if (!newDeck) {
            res.status(500).json({ message: 'Error creating deck' });
            return;
        }
        res.status(200).json({
            data: newDeck,
        });
    };
}
