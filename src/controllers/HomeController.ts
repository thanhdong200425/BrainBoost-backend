import { Request, Response } from "express";
import { DeckRepository } from "../repositories/DeckRepository";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

export class HomeController {
    private deckRepository: DeckRepository;

    constructor() {
        this.deckRepository = new DeckRepository();
    }

    getPublicDecks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const decks = await this.deckRepository.getPublicDecks(page, limit);

            const responseData = {
                success: true,
                data: decks,
                user: req.user ? { email: req.user.email } : null, // Trả về thông tin user nếu đã đăng nhập
            };

            res.status(200).json(responseData);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error fetching decks",
                error: error,
            });
        }
    };
}
