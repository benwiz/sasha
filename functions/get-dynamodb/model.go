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
}

// Location represents a location record in the DynamoDB table: sasha.locations.
type Location struct {
	Name      string  `json:"name" dynamo:"name"`
	Type      string  `json:"type" dynamo:"type"`
	Latitude  float32 `json:"latitude" dynamo:"latitude"`
	Longitude float32 `json:"longitude" dynamo:"longitude"`
	Radius    float32 `json:"radius" dynamo:"radius"`
}
