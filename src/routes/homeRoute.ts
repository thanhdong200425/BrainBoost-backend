import { Router } from 'express';
import { HomeController } from '../controllers/HomeController';

const router = Router();
const homeController = new HomeController();

router.get('/home/decks', homeController.getPublicDecks);

export default router;