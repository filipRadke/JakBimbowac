import express, { Request, Response } from "express";
import { prisma } from "../lib/prisma";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "This is the backend, you shouldn't be here" });
});

app.get("/stops", async (req: Request, res: Response) => {
    const stops = await prisma.stops.findMany()
    async () => {
        await prisma.$disconnect();
    }

    res.json(stops)
});

app.get("/stopTimes/:stopId", async (req: Request, res: Response) => {
    const routes = await prisma.$queryRaw`
      SELECT *
      FROM stop_times
      WHERE stop_id = ${req.params.stopId}`;`
      ORDER BY departure_time;
    `;
    async ()=> {
        await prisma.$disconnect();
    }

    console.log(routes)

    res.json(routes)
})

app.get("/trips", async (req: Request, res: Response) => {
    const trips = await prisma.trips.findMany();

    async ()=> {
        await prisma.$disconnect();
    }

    res.json(trips)
})

app.get("/routes", async (req: Request, res: Response) => {
    const routes = await prisma.routes.findMany()
    async ()=> {
        await prisma.$disconnect();
    }

    res.json(routes)
})

app.get("/routes/:stopId", async (req: Request, res: Response) => {
    const routes = await prisma.$queryRaw`
        SELECT DISTINCT r.route_id, r.route_short_name, t.trip_headsign
        FROM stop_times st
                 JOIN trips t ON st.trip_id = t.trip_id
                 JOIN routes r ON t.route_id = r.route_id
        WHERE st.stop_id = ${req.params.stopId} AND t.trip_id LIKE "%+"
    `;
    async ()=> {
        await prisma.$disconnect();
    }

    res.json(routes)
})

app.get("/departures/:stopId", async (req: Request, res: Response) => {

    const departures = await prisma.$queryRaw`
        SELECT
            st.departure_time,
            r.route_short_name,
            t.trip_headsign
        FROM stop_times st
                 JOIN trips t ON st.trip_id = t.trip_id
                 JOIN routes r ON t.route_id = r.route_id
        WHERE st.stop_id = ${req.params.stopId}

          AND CAST(SUBSTRING_INDEX(t.trip_id, '_', 1) AS UNSIGNED) = WEEKDAY(CURDATE()) + 1

        ORDER BY
            CASE
                WHEN TIME_TO_SEC(st.departure_time) >= TIME_TO_SEC(CURTIME()) THEN 0
                ELSE 1
                END,
            st.departure_time
            LIMIT 10;
    `;

    async ()=> {
        await prisma.$disconnect();
    }

    res.json(departures)
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});