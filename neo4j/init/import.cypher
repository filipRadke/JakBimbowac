// CONSTRAINTS AND INDEXES
CREATE CONSTRAINT stop_id_unique IF NOT EXISTS
FOR (s:Stop)
REQUIRE s.id IS UNIQUE;

CREATE CONSTRAINT trip_id_unique IF NOT EXISTS
FOR (t:Trip)
REQUIRE t.id IS UNIQUE;

CREATE CONSTRAINT route_id_unique IF NOT EXISTS
FOR (r:Route)
REQUIRE r.id IS UNIQUE;

CREATE INDEX stop_name_index IF NOT EXISTS
FOR (s:Stop)
ON (s.name);

CREATE INDEX stoptime_trip_index IF NOT EXISTS
FOR (st:StopTime)
ON (st.trip_id);

CREATE INDEX stoptime_sequence_index IF NOT EXISTS
FOR (st:StopTime)
ON (st.sequence);

CREATE INDEX stoptime_departure_index IF NOT EXISTS
FOR (st:StopTime)
ON (st.departure);

CREATE POINT INDEX stop_location_index IF NOT EXISTS
FOR (s:Stop)
ON (s.location);


// LOAD STOPS
LOAD CSV WITH HEADERS FROM 'file:///stops.txt' AS row

MERGE (s:Stop {id: toInteger(row.stop_id)})
SET
s.name = row.stop_name,
s.lat = toFloat(row.stop_lat),
s.lon = toFloat(row.stop_lon),
s.location = point({
latitude: toFloat(row.stop_lat),
longitude: toFloat(row.stop_lon)
});


// LOAD ROUTES
LOAD CSV WITH HEADERS FROM 'file:///routes.txt' AS row

MERGE (r:Route {id: row.route_id})
SET
r.short_name = row.route_short_name,
r.long_name = row.route_long_name;


// LOAD TRIPS
LOAD CSV WITH HEADERS FROM 'file:///trips.txt' AS row

MATCH (r:Route {id: row.route_id})

MERGE (t:Trip {id: row.trip_id})
SET t.service_id = row.service_id

MERGE (t)-[:USES_ROUTE]->(r);


// LOAD STOP TIMES
LOAD CSV WITH HEADERS FROM 'file:///stop_times.txt' AS row

MATCH (s:Stop {id: toInteger(row.stop_id)})
MATCH (t:Trip {id: row.trip_id})

CREATE (st:StopTime {
trip_id: row.trip_id,
sequence: toInteger(row.stop_sequence),
arrival: row.arrival_time,
departure: row.departure_time
})

MERGE (st)-[:STOPS_AT]->(s)
MERGE (t)-[:HAS_STOPTIME]->(st);

// CREATE CONNECTIONS BETWEEN STOPS
MATCH (t:Trip)-[:HAS_STOPTIME]->(st:StopTime)

WITH t, st
ORDER BY t.id, st.sequence

WITH t, collect(st) AS stops

UNWIND range(0, size(stops)-2) AS i

WITH stops[i] AS a, stops[i+1] AS b

MERGE (a)-[:NEXT]->(b);

// CREATE TRANSFERS BETWEEN CLOSE STOPS
MATCH (a:Stop)

CALL {
WITH a
MATCH (b:Stop)
WHERE distance(a.location,b.location) < 250
AND a <> b
RETURN b
}

MERGE (a)-[:TRANSFER]->(b);