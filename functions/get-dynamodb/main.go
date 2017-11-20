package main

import (
	"encoding/json"
	"fmt"
	"github.com/apex/go-apex"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/guregu/dynamo"
	"os"
)

type message struct {
	PathParameters query  `json:"pathParameters"`
	Body           string `json:"body"`
}

type query struct {
	Query string `json:"query"`
}

type response struct {
	StatusCode int    `json:"statusCode"`
	Body       string `json:"body"`
}

func main() {
	apex.HandleFunc(func(event json.RawMessage, ctx *apex.Context) (interface{}, error) {
		fmt.Fprintf(os.Stderr, "Event: %s\n", event)

		// Unmarshal into map so that we can look at query value
		var m message
		err := json.Unmarshal(event, &m)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Message Unmarshal Fail: %s\n", err)
			return nil, err
		}
		fmt.Fprintf(os.Stderr, "Message: %s\n", m)

		// Connect to dyanamodb
		db := dynamo.New(session.New(), &aws.Config{Region: aws.String("us-east-1")})

		// Query the proper table
		if m.PathParameters.Query == "person" {
			var p person
			table := db.Table("sasha.people")
			err = table.Get("person", "ben").One(&p)
		}

		return 1, nil
	})
}
