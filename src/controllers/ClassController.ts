import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { ClassRepository } from '../repositories/ClassRepository';
import { DeckRepository } from '../repositories/DeckRepository';
import { AppDataSource } from '../../ormconfig';
import { Deck } from '../entities/Deck';

export class ClassController {
    private classRepository: ClassRepository;
    private deckRepository: DeckRepository;

    constructor() {
        this.classRepository = new ClassRepository();
        this.deckRepository = new DeckRepository();
    }

    createClass = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { name } = req.body;
            const userId = req.user.id;

            if (!name) {
                res.status(400).json({ message: 'Class name is required' });
                return;
            }

            const classData = {
                name,
                author: { id: userId },
                studentQuantity: 0,
            };

            const newClass = await this.classRepository.create(classData);

            res.status(201).json({
                message: 'Class created successfully',
                data: newClass,
            });
        } catch (error) {
            console.error('Error creating class:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    getClassById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const classEntity = await this.classRepository.findById(id);

            if (!classEntity) {
                res.status(404).json({ message: 'Class not found' });
                return;
            }

            res.status(200).json({
                data: classEntity,
            });
        } catch (error) {
            console.error('Error fetching class:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    updateClass = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const userId = req.user.id;

            const classEntity = await this.classRepository.findById(id);

            if (!classEntity) {
                res.status(404).json({ message: 'Class not found' });
                return;
            }

            // Check if user is the author
            if (classEntity.author.id !== userId) {
                res.status(403).json({
                    message: 'You do not have permission to update this class',
                });
                return;
            }

            const updatedClass = await this.classRepository.update(id, { name });

            res.status(200).json({
                message: 'Class updated successfully',
                data: updatedClass,
            });
        } catch (error) {
            console.error('Error updating class:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    getClassDecks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            console.log('Fetching decks for class ID:', id);

            // Alternative approach using TypeORM query builder
            const decks = await AppDataSource.getRepository(Deck)
                .createQueryBuilder('deck')
                .leftJoinAndSelect('deck.author', 'author')
                .innerJoin('class_decks', 'cd', 'deck.id = cd.deck_id')
                .where('cd.class_id = :classId', { classId: id })
                .orderBy('deck.updatedAt', 'DESC')
                .getMany();

            console.log(`Found ${decks.length} decks for class ${id}`);

            const formattedDecks = decks.map((deck: any) => ({
                id: deck.id,
                name: deck.name,
                description: deck.description,
                visibility: deck.visibility,
                createdAt: deck.createdAt,
                updatedAt: deck.updatedAt,
                author: {
                    id: deck.author.id,
                    username: deck.author.username,
                    email: deck.author.email,
                },
            }));

            res.status(200).json({
                data: formattedDecks,
            });
        } catch (error) {
            console.error('Error fetching class decks:', error);
            console.error('Error details:', error instanceof Error ? error.message : String(error));
            console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    addDeckToClass = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { deckId } = req.body;

            if (!deckId) {
                res.status(400).json({ message: 'Deck ID is required' });
                return;
            }

            const classEntity = await this.classRepository.findById(id);
            if (!classEntity) {
                res.status(404).json({ message: 'Class not found' });
                return;
            }

            const deck = await this.deckRepository.findById(deckId);
            if (!deck) {
                res.status(404).json({ message: 'Deck not found' });
                return;
            }

            const manager = AppDataSource.manager;

            const existingRelation = await manager.query(
                'SELECT id FROM class_decks WHERE class_id = $1 AND deck_id = $2',
                [id, deckId]
            );

            if (existingRelation.length > 0) {
                res.status(400).json({ message: 'Deck is already added to this class' });
                return;
            }

            try {
                await manager.query(
                    'INSERT INTO class_decks (id, class_id, deck_id) VALUES (gen_random_uuid(), $1, $2)',
                    [id, deckId]
                );
            } catch (genError) {
                console.log('Trying alternative UUID generation...');
                await manager.query(
                    'INSERT INTO class_decks (id, class_id, deck_id) VALUES (uuid_generate_v4(), $1, $2)',
                    [id, deckId]
                );
            }

            res.status(200).json({
                message: 'Deck added to class successfully',
            });
        } catch (error) {
            console.error('Error adding deck to class:', error);
            console.error('Error details:', error instanceof Error ? error.message : String(error));

            if (error instanceof Error && error.message.includes('uuid')) {
                res.status(500).json({
                    message: 'Database UUID generation error. Please check database configuration.',
                });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    };

    removeDeckFromClass = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { id, deckId } = req.params;

            const manager = AppDataSource.manager;

            const existingRelation = await manager.query(
                'SELECT id FROM class_decks WHERE class_id = $1 AND deck_id = $2',
                [id, deckId]
            );

            if (existingRelation.length === 0) {
                res.status(404).json({ message: 'Deck not found in this class' });
                return;
            }

            await manager.query('DELETE FROM class_decks WHERE class_id = $1 AND deck_id = $2', [
                id,
                deckId,
            ]);

            res.status(200).json({
                message: 'Deck removed from class successfully',
            });
        } catch (error) {
            console.error('Error removing deck from class:', error);
            console.error('Error details:', error instanceof Error ? error.message : String(error));
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    deleteClass = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const classEntity = await this.classRepository.findById(id);

            if (!classEntity) {
                res.status(404).json({ message: 'Class not found' });
                return;
            }

            if (classEntity.author.id !== userId) {
                res.status(403).json({
                    message: 'You do not have permission to delete this class',
                });
                return;
            }

            await this.classRepository.delete(id);

            res.status(200).json({
                message: 'Class deleted successfully',
            });
        } catch (error) {
            console.error('Error deleting class:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
}
