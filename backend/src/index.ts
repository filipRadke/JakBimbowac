import express, { Request, Response } from "express";
import { getSession } from "./neo4j";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "This is the backend, you shouldn't be here" });
});

app.get("/create", async (req: Request, res: Response) => {
    const db = getSession();
    const timeNow = Date.now();
    let out;
    try {
        const res = await db.run(
            'CREATE (t:Timestamp {time: $timeNow}) RETURN t',
            {timeNow}
        )

        out = res.records[0].get("t")
    } finally {
        await db.close()
    }

    res.json(out);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});