import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { AppDataSource } from "../ormconfig";
import { checkOrigin } from "./middlewares/checkOrigin";
import { authRouter } from "./routes";

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT!) || 3000;

app.use(cors());
// @ts-ignore
// app.use(checkOrigin);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/auth", authRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
});

const startServer = async () => {
    try {
        await AppDataSource.initialize();
        app.listen(port, "0.0.0.0", () => {
            console.log("Server is running at: " + port);
        });
    } catch (error) {
        console.error("Error connecting to database", error);
        process.exit(1);
    }
};

startServer();
