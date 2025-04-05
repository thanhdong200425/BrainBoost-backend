import { Router } from 'express';
import { HomeController } from '../controllers/HomeController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const homeController = new HomeController();

router.get("/home/decks", authMiddleware, homeController.getPublicDecks);

export default router;