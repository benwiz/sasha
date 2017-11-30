package main

// Source of this symlink file is /shared/dynamodb-models.

// Table represents the DynamoDB table. It is questionable to have it in this file.
type Table struct {
	Table string `json:"table"`
}

// Person represents a person record in the DynamoDB table: sasha.people.
type Person struct {
	Person                string  `json:"person" dynamo:"person"`
	Latitude              float32 `json:"latitude" dynamo:"latitude"`
	Longitude             float32 `json:"longitude" dynamo:"longitude"`
	LatestCoordsTimestamp string  `json:"latest_coords_timestamp" dynamo:"latest_coords_timestamp"`
	LastSeenLocation      string  `json:"last_seen_location" dynamo:"last_seen_location"`
	LastSeenTimestamp     string  `json:"last_seen_timestamp" dynamo:"last_seen_timestamp"`
}

// Location represents a location record in the DynamoDB table: sasha.locations.
// Each location has a set of points. If the length of that set is 1 then we know
// that element can be interpreted as an order set: (x, y, r). If there is more
// than 1 element, then the elements can be interpreted as an ordered set (x, y)
type Location struct {
	Name string `json:"name" dynamo:"name"`
	Type string `json:"type" dynamo:"type"`
	// TODO: Replace the following 3 lines with 1 line that does: list of ordered pairs or triples
	Latitude  float32 `json:"latitude" dynamo:"latitude"`
	Longitude float32 `json:"longitude" dynamo:"longitude"`
	Radius    float32 `json:"radius" dynamo:"radius"`
}
