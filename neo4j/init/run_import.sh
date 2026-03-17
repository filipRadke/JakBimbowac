#!/bin/bash
set -e

echo "Waiting for Neo4j to be ready..."

# retry co 5s, max 60 prób (300s)
count=0
while true; do
    echo "Testing"
    sleep 30
done

echo "Neo4j ready, running import..."
cypher-shell -u neo4j -p password -f /import/import.cypher
echo "Import finished"