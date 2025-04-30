import { Request, Response, Router } from 'express';
import { AIController } from '../controllers/AIController';
import { AuthenticatedRequest, authMiddleware } from '../middlewares/authMiddleware';

const aiRouter = Router();
const aiController = new AIController();

/**
 * @swagger
 * /ai/flashcards/auto-generate:
 *   post:
 *     summary: Generate flashcards based on topic and level
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topic
 *               - level
 *             properties:
 *               topic:
 *                 type: string
 *                 description: The topic for which to generate flashcards
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *                 description: The difficulty level of the generated flashcards
 *               quantity:
 *                 type: integer
 *                 description: The number of flashcards to generate
 *                 default: 10
 *     responses:
 *       200:
 *         description: Flashcards generated successfully
 *       400:
 *         description: Bad Request - Missing required fields or invalid data
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       500:
 *         description: Internal Server Error
 */
aiRouter.post('/flashcards/auto-generate', authMiddleware, (req: Request, res: Response) => {
    aiController.generateFlashcardsBasedOnTopicAndLevel(req as AuthenticatedRequest, res);
});

export default aiRouter;
