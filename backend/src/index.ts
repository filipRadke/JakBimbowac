import express, { Request, Response } from "express";
import {getSession} from "./neo4j";
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

function getCurrentDay() {
    const jsDay = new Date().getDay(); // 0 = niedziela
    return jsDay === 0 ? 7 : jsDay;
}

app.get("/findRoute/:startStopId/:endStopId/:mode/:time", async (req: Request, res: Response) => {
    const session = getSession()

    const day = getCurrentDay()
    const startStopId = Number(req.params.startStopId)
    const endStopId = Number(req.params.endStopId)
    const time = String(req.params.time) // "HH:MM:SS"
    const mode = String(req.params.mode) // "DEPARTURE" | "ARRIVAL"

    const query = `
  WITH 
    $day AS day,
    $startId AS startId,
    $endId AS endId,
    time($time) AS queryTime,
    $mode AS mode

  WITH *,
    toString(day) AS dayPrefix,
    toString(CASE WHEN day = 7 THEN 1 ELSE day + 1 END) AS nextDayPrefix

  MATCH (start:Stop {id: startId})
  MATCH (end:Stop {id: endId})

  MATCH (start)<-[:STOPS_AT]-(stStart:StopTime)
  MATCH (t:Trip {id: stStart.trip_id})

  WHERE 
    (
      mode = "DEPARTURE" AND (
        (t.id STARTS WITH dayPrefix AND time(stStart.departure) >= queryTime)
        OR
        (t.id STARTS WITH nextDayPrefix AND queryTime >= time("23:00:00"))
      )
    )
    OR
    (
      mode = "ARRIVAL" AND (
        (t.id STARTS WITH dayPrefix AND time(stStart.departure) <= queryTime)
        OR
        (t.id STARTS WITH nextDayPrefix AND queryTime <= time("01:00:00"))
      )
    )

  MATCH (end)<-[:STOPS_AT]-(stEnd:StopTime)

  CALL gds.shortestPath.dijkstra.stream({
    nodeProjection: 'StopTime',
    relationshipProjection: {
      NEXT: {
        type: 'NEXT',
        properties: 'duration'
      }
    },
    sourceNode: id(stStart),
    targetNode: id(stEnd),
    relationshipWeightProperty: 'duration'
  })
  YIELD totalCost, nodeIds

  WITH totalCost,
       [nodeId IN nodeIds | gds.util.asNode(nodeId)] AS stops,
       stStart, stEnd, mode

  UNWIND range(0, size(stops)-2) AS i
  WITH stops[i] AS a, stops[i+1] AS b, totalCost, stStart, stEnd, mode

  MATCH (a)-[:STOPS_AT]->(stopA:Stop)
  MATCH (b)-[:STOPS_AT]->(stopB:Stop)

  WITH 
    a, b, stopA, stopB, totalCost, stStart, stEnd, mode,
    a.trip_id AS tripA,
    b.trip_id AS tripB,
    time(a.departure) AS depA,
    time(b.departure) AS depB

  WITH *,
  CASE WHEN tripA <> tripB THEN 1 ELSE 0 END AS isTransfer,

  CASE 
    WHEN depB >= depA 
    THEN duration.inSeconds(depA, depB).seconds
    ELSE duration.inSeconds(depA, time("23:59:59")).seconds +
         duration.inSeconds(time("00:00:00"), depB).seconds
  END AS waitTime

  WITH totalCost, stStart, stEnd, mode,
  collect({
    from: stopA.name,
    to: stopB.name,
    trip: tripA,
    departure: depA,
    next_departure: depB,
    isTransfer: isTransfer,
    wait_sec: waitTime
  }) AS segments

  RETURN
    totalCost,
    stStart.departure AS departure,
    stEnd.arrival AS arrival,
    segments

  ORDER BY
    CASE 
      WHEN mode = "DEPARTURE" THEN totalCost
      WHEN mode = "ARRIVAL" THEN duration.inSeconds(time("00:00:00"), time(stEnd.arrival)).seconds
    END
  LIMIT 1
  `

    const result = await session.run(query, {
        day,
        startStopId,
        endStopId,
        time,
        mode,
    });

    await session.close();

    if (result.records.length === 0) return null;

    const record = result.records[0];

    res.json ({
        totalTimeSec: record.get("totalCost").toNumber(),
        departure: record.get("departure"),
        arrival: record.get("arrival"),
        segments: record.get("segments"),
    })
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});