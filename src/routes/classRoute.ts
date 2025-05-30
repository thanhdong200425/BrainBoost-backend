import { Router, Request, Response } from 'express';
import { ClassController } from '../controllers/ClassController';
import { authMiddleware, AuthenticatedRequest } from '../middlewares/authMiddleware';

const router = Router();
const classController = new ClassController();

/**
 * @swagger
 * /api/classes:
 *   post:
 *     summary: Create a new class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the class
 *     responses:
 *       201:
 *         description: Class created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, (req: Request, res: Response) =>
    classController.createClass(req as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/classes/{id}:
 *   get:
 *     summary: Get a class by ID
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The class ID
 *     responses:
 *       200:
 *         description: Class retrieved successfully
 *       404:
 *         description: Class not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', authMiddleware, (req: Request, res: Response) =>
    classController.getClassById(req as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/classes/{id}:
 *   put:
 *     summary: Update a class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The class ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the class
 *     responses:
 *       200:
 *         description: Class updated successfully
 *       403:
 *         description: Forbidden - not the class owner
 *       404:
 *         description: Class not found
 */
router.put('/:id', authMiddleware, (req: Request, res: Response) =>
    classController.updateClass(req as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/classes/{id}:
 *   delete:
 *     summary: Delete a class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The class ID
 *     responses:
 *       200:
 *         description: Class deleted successfully
 *       403:
 *         description: Forbidden - not the class owner
 *       404:
 *         description: Class not found
 */
router.delete('/:id', authMiddleware, (req: Request, res: Response) =>
    classController.deleteClass(req as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/classes/{id}/decks:
 *   get:
 *     summary: Get all decks in a class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The class ID
 *     responses:
 *       200:
 *         description: Class decks retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/:id/decks', authMiddleware, (req: Request, res: Response) =>
    classController.getClassDecks(req as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/classes/{id}/decks:
 *   post:
 *     summary: Add a deck to a class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The class ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deckId
 *             properties:
 *               deckId:
 *                 type: string
 *                 description: The ID of the deck to add to the class
 *     responses:
 *       200:
 *         description: Deck added to class successfully
 *       400:
 *         description: Bad request or deck already in class
 *       404:
 *         description: Class or deck not found
 */
router.post('/:id/decks', authMiddleware, (req: Request, res: Response) =>
    classController.addDeckToClass(req as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/classes/{id}/decks/{deckId}:
 *   delete:
 *     summary: Remove a deck from a class
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The class ID
 *       - in: path
 *         name: deckId
 *         required: true
 *         schema:
 *           type: string
 *         description: The deck ID
 *     responses:
 *       200:
 *         description: Deck removed from class successfully
 *       404:
 *         description: Deck not found in class
 */
router.delete('/:id/decks/:deckId', authMiddleware, (req: Request, res: Response) =>
    classController.removeDeckFromClass(req as AuthenticatedRequest, res)
);

export default router;
