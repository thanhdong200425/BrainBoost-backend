import { Router } from 'express';
import { HomeController } from '../controllers/HomeController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const homeController = new HomeController();
/**
 * @swagger
 * /api/home:
 *   get:
 *     summary: Get decks, folders and classes for an authenticated user
 *     tags: [Decks]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: A list of public decks retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                         nullable: true
 *                       visibility:
 *                         type: string
 *                         enum: [public, private] # Assuming visibility enum
 *                         example: public
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       author:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           username:
 *                             type: string
 *                 pagination: # Added pagination details to response
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       400:
 *         description: Bad Request - Invalid query parameters (e.g., non-integer page/limit)
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       500:
 *         description: Internal Server Error
 */
router.get('/home', authMiddleware, homeController.getResourcesForUser);

export default router;
