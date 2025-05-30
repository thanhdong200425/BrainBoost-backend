import { Router, Request, Response } from 'express';
import { FolderController } from '../controllers/FolderController';
import { authMiddleware, AuthenticatedRequest } from '../middlewares/authMiddleware';

const router = Router();
const folderController = new FolderController();

/**
 * @swagger
 * /api/folders:
 *   post:
 *     summary: Create a new folder
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               visibility:
 *                 type: string
 *                 enum: [private, public]
 *                 default: private
 *     responses:
 *       201:
 *         description: Folder created successfully
 *       400:
 *         description: Bad Request - Missing folder name
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post('/folders', authMiddleware, (req: Request, res: Response) =>
    folderController.createFolder(req as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/folders/{id}:
 *   get:
 *     summary: Get folder by ID
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Folder retrieved successfully
 *       404:
 *         description: Folder not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/folders/:id', authMiddleware, (req: Request, res: Response) =>
    folderController.getFolderById(req as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/folders/{id}:
 *   put:
 *     summary: Update folder
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               visibility:
 *                 type: string
 *                 enum: [private, public]
 *     responses:
 *       200:
 *         description: Folder updated successfully
 *       403:
 *         description: Not authorized to update this folder
 *       404:
 *         description: Folder not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.put('/folders/:id', authMiddleware, (req: Request, res: Response) =>
    folderController.updateFolder(req as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/folders/{id}:
 *   delete:
 *     summary: Delete folder
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Folder deleted successfully
 *       403:
 *         description: Not authorized to delete this folder
 *       404:
 *         description: Folder not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.delete('/folders/:id', authMiddleware, (req: Request, res: Response) =>
    folderController.deleteFolder(req as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/folders/{id}/decks:
 *   get:
 *     summary: Get all decks in a folder
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Folder decks retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/folders/:id/decks', authMiddleware, (req: Request, res: Response) =>
    folderController.getFolderDecks(req as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/folders/add-deck:
 *   post:
 *     summary: Add deck to folder
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               folderId:
 *                 type: string
 *               deckId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Deck added to folder successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post('/folders/add-deck', authMiddleware, (req: Request, res: Response) =>
    folderController.addDeckToFolder(req as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/folders/remove-deck:
 *   post:
 *     summary: Remove deck from folder
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               folderId:
 *                 type: string
 *               deckId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Deck removed from folder successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post('/folders/remove-deck', authMiddleware, (req: Request, res: Response) =>
    folderController.removeDeckFromFolder(req as AuthenticatedRequest, res)
);

export default router;
