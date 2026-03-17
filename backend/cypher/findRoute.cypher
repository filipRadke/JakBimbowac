MATCH (start:Stop {name:"Dworzec"})
MATCH (end:Stop {name:"Politechnika"})

MATCH p = shortestPath(
(start)<-[:STOPS_AT]-(:StopTime)-[:NEXT*..50]->(:StopTime)-[:STOPS_AT]->(end)
)

RETURN p
  LIMIT 1;