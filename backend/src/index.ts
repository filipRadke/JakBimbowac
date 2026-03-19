import express, { Request, Response } from "express";
import { prisma } from "../lib/prisma";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "This is the backend, you shouldn't be here" });
});

app.get("/testPrisma", async (req: Request, res: Response) => {
    const stops = await prisma.stops.findMany()
    async () => {
        await prisma.$disconnect();
    }

    res.json(stops)
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});