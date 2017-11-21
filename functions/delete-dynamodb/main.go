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
	PathParameters        table                  `json:"pathParameters"`
	QueryStringParameters map[string]interface{} `json:"queryStringParameters"`
}

type table struct {
	Table string `json:"table"`
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

		// Initialize response
		r := response{}

		// Connect to dyanamodb and get the table
		db := dynamo.New(session.New(), &aws.Config{Region: aws.String("us-east-1")})
		table := db.Table("sasha." + m.PathParameters.Table)

		// Query the proper table
		if m.PathParameters.Table == "people" {
			// Get person record
			value := m.QueryStringParameters["person"].(string)
			del := table.Delete("person", value).Run()
			fmt.Fprintf(os.Stderr, "Deleted: %#v\n", del)

			// Prepare success response
			r.StatusCode = 200
			r.Body = fmt.Sprintf(`{"message": "Successfully deleted: %s."}`, value)
		} else {
			// Prepare table-not-found response
			r.StatusCode = 404
			r.Body = fmt.Sprintf(`{"message": "Table not found: %v."}`, m.PathParameters.Table)
		}

		// Respond
		return r, nil
	})
}
