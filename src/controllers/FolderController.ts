import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { FolderRepository } from '../repositories/FolderRepository';
import { DeckRepository } from '../repositories/DeckRepository';
import { AppDataSource } from '../../ormconfig';
import { Deck } from '../entities/Deck';

export class FolderController {
    private folderRepository: FolderRepository;
    private deckRepository: DeckRepository;

    constructor() {
        this.folderRepository = new FolderRepository();
        this.deckRepository = new DeckRepository();
    }

    createFolder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { name, visibility = 'private' } = req.body;
            const userId = req.user.id;

            if (!name) {
                res.status(400).json({ message: 'Folder name is required' });
                return;
            }

            const folderData = {
                name,
                author: { id: userId },
                visibility,
            };

            const newFolder = await this.folderRepository.create(folderData);

            res.status(201).json({
                message: 'Folder created successfully',
                data: newFolder,
            });
        } catch (error) {
            console.error('Error creating folder:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    getFolderById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const folder = await this.folderRepository.findById(id);

            if (!folder) {
                res.status(404).json({ message: 'Folder not found' });
                return;
            }

            res.status(200).json({
                data: folder,
            });
        } catch (error) {
            console.error('Error fetching folder:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    updateFolder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const userId = req.user.id;

            const folder = await this.folderRepository.findById(id);
            if (!folder) {
                res.status(404).json({ message: 'Folder not found' });
                return;
            }

            // Check if user owns this folder
            if (folder.author.id !== userId) {
                res.status(403).json({ message: 'Not authorized to update this folder' });
                return;
            }

            const updatedFolder = await this.folderRepository.update(id, updateData);
            res.status(200).json({
                message: 'Folder updated successfully',
                data: updatedFolder,
            });
        } catch (error) {
            console.error('Error updating folder:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    deleteFolder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const folder = await this.folderRepository.findById(id);
            if (!folder) {
                res.status(404).json({ message: 'Folder not found' });
                return;
            }

            // Check if user owns this folder
            if (folder.author.id !== userId) {
                res.status(403).json({ message: 'Not authorized to delete this folder' });
                return;
            }

            await this.folderRepository.delete(id);
            res.status(200).json({ message: 'Folder deleted successfully' });
        } catch (error) {
            console.error('Error deleting folder:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    getFolderDecks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            const decks = await AppDataSource.getRepository(Deck)
                .createQueryBuilder('deck')
                .innerJoin('deck_folders', 'df', 'df.deck_id = deck.id')
                .leftJoinAndSelect('deck.author', 'author')
                .where('df.folder_id = :folderId', { folderId: id })
                .getMany();

            res.status(200).json({
                data: decks,
            });
        } catch (error) {
            console.error('Error fetching folder decks:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    addDeckToFolder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { folderId, deckId } = req.body;

            if (!folderId || !deckId) {
                res.status(400).json({ message: 'Folder ID and Deck ID are required' });
                return;
            }

            // Check if folder exists
            const folder = await this.folderRepository.findById(folderId);
            if (!folder) {
                res.status(404).json({ message: 'Folder not found' });
                return;
            }

            // Check if deck exists
            const deck = await this.deckRepository.findById(deckId);
            if (!deck) {
                res.status(404).json({ message: 'Deck not found' });
                return;
            }

            // Check if the relation already exists
            const existingRelation = await AppDataSource.createQueryBuilder()
                .select()
                .from('deck_folders', 'df')
                .where('df.folder_id = :folderId AND df.deck_id = :deckId', { folderId, deckId })
                .getRawOne();

            if (existingRelation) {
                res.status(400).json({ message: 'Deck is already in this folder' });
                return;
            }

            await AppDataSource.createQueryBuilder()
                .insert()
                .into('deck_folders')
                .values({ folder_id: folderId, deck_id: deckId })
                .execute();

            res.status(200).json({ message: 'Deck added to folder successfully' });
        } catch (error) {
            console.error('Error adding deck to folder:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    removeDeckFromFolder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { folderId, deckId } = req.body;

            await AppDataSource.createQueryBuilder()
                .delete()
                .from('deck_folders')
                .where('folder_id = :folderId AND deck_id = :deckId', { folderId, deckId })
                .execute();

            res.status(200).json({ message: 'Deck removed from folder successfully' });
        } catch (error) {
            console.error('Error removing deck from folder:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    getQuantity = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user.id;
            const folderCount = await this.folderRepository.countByUserId(userId);

            res.status(200).json({
                data: {
                    folderCount,
                },
            });
        } catch (error) {
            console.error('Error getQuantity(): ', error);
            res.status(500).json({ message: 'Oops! Sorry, we have some problems' });
        }
    };
}
