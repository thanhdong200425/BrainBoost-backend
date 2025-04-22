import { Router, Request, Response } from 'express';
import { HomeController } from '../controllers/HomeController';
import { DeckController } from '../controllers/DeckController';
import { ProfileController } from '../controllers/ProfileController';
import { authMiddleware, AuthenticatedRequest } from '../middlewares/authMiddleware';

const router = Router();
const homeController = new HomeController();
const deckController = new DeckController();
const profileController = new ProfileController();

/**
 * @swagger
 * /api/home:
 *   get:
 *     summary: Get decks, folders and classes for an authenticated user
 *     tags: [Home]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of public decks, folders, and classes retrieved successfully.
 *       400:
 *         description: Bad Request - Invalid query parameters
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
 *     summary: Get a deck and its flashcards by ID
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
 *         description: A deck object with flashcards retrieved successfully.
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
 *     summary: Create a new deck
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
 *               description:
 *                 type: string
 *               visibility:
 *                 type: string
 *                 enum: [private, public]
 *     responses:
 *       200:
 *         description: Deck created successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post('/decks', authMiddleware, (req: Request, res: Response) =>
    deckController.addDeck(req as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/profile', authMiddleware, (req: Request, res: Response) =>
    profileController.getProfile(req as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Update the authenticated user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               dob:
 *                 type: string
 *                 format: date
 *               avatar_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/profile', authMiddleware, (req: Request, res: Response) =>
    profileController.updateProfile(req as AuthenticatedRequest, res)
);

export default router;
