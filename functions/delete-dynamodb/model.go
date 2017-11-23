package main

// Note this file is a symlink with the source at /shared/dynamodb-model.go
// It is used as /functions/update-dynamodb/mode.go

type Table struct {
	Table string `json:"table"`
}

type Person struct {
	Person string `json:"person" dynamo:"person"`
	Age    int    `json:"age" dynamo:"age"`
}
