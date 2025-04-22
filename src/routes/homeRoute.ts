import { Router } from 'express';
import { HomeController } from '../controllers/HomeController';
import { authMiddleware, AuthenticatedRequest } from '../middlewares/authMiddleware';
import { DeckController } from '../controllers/DeckController';
import { Request, Response } from 'express';

const router = Router();
const homeController = new HomeController();
const deckController = new DeckController();

/**
 * @swagger
 * /api/home:
 *   get:
 *     summary: Get decks, folders and classes for an authenticated user
 *     tags: [Home]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: A list of public decks, folders and classes retrieved successfully.
 *       400:
 *         description: Bad Request - Invalid query parameters (e.g., non-integer page/limit)
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       500:
 *         description: Internal Server Error
 */
router.get('/home', authMiddleware, (req: Request, res: Response) =>
    homeController.getResourcesForUser(req as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/decks:
 *   get:
 *     summary: Get all decks for the authenticated user
 *     tags: [Decks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of decks belonging to the user retrieved successfully.
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       500:
 *         description: Internal Server Error
 */
router.get('/decks', authMiddleware, (req: Request, res: Response) =>
    deckController.getDecks(req as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/decks/{id}:
 *   get:
 *     summary: Get a deck and other info of this deck by ID for the authenticated user
 *     tags: [Decks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the deck to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A deck object retrieved successfully.
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       404:
 *         description: Not Found - Deck not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/decks/:id', authMiddleware, (req: Request, res: Response) =>
    deckController.getDeckById(req as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/decks:
 *   post:
 *     summary: Create a new deck for the authenticated user
 *     tags: [Decks]
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
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the deck
 *               description:
 *                 type: string
 *                 description: Description of the deck
 *               visibility:
 *                 type: string
 *                 enum: [private, public]
 *                 default: public
 *                 description: Visibility of the deck
 *     responses:
 *       200:
 *         description: Deck created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     visibility:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad Request - Missing required fields
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       500:
 *         description: Internal Server Error
 */
router.post('/decks', authMiddleware, (req: Request, res: Response) =>
    deckController.addDeck(req as AuthenticatedRequest, res)
);

export default router;
