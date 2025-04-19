import { Request, Response } from 'express';
import { DeckRepository } from '../repositories/DeckRepository';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { ClassRepository } from '../repositories/ClassRepository';
import { FolderRepository } from '../repositories/FolderRepository';

export class HomeController {
    private deckRepository: DeckRepository;
    private classRepository: ClassRepository;
    private folderRepository: FolderRepository;

    constructor() {
        this.deckRepository = new DeckRepository();
        this.classRepository = new ClassRepository();
        this.folderRepository = new FolderRepository();
    }

    getResourcesForUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const [decks, classes, folders] = await Promise.all([
                this.deckRepository.findByUserId(userId),
                this.classRepository.findByUserId(userId),
                this.folderRepository.findByUserId(userId),
            ]);
            res.status(200).json({
                data: {
                    decks,
                    classes,
                    folders,
                },
            });
        } catch (error) {
            console.log('Error fetching decks:', error);
            res.status(500).json({
                message: error || 'Internal server error',
            });
        }
    };
}
