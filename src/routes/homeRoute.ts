import { Router } from 'express';
import { HomeController } from '../controllers/HomeController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { DeckController } from '../controllers/DeckController';

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
router.get('/home', authMiddleware, homeController.getResourcesForUser);

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
router.get('/decks', authMiddleware, deckController.getDecks);

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
router.get('/decks/:id', authMiddleware, deckController.getDeckById);

export default router;
