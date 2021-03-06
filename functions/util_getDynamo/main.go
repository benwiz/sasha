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
	PathParameters        Table                  `json:"pathParameters"`
	QueryStringParameters map[string]interface{} `json:"queryStringParameters"`
}

type response struct {
	StatusCode int    `json:"statusCode"`
	Body       string `json:"body"`
}

func main() {
	apex.HandleFunc(func(event json.RawMessage, ctx *apex.Context) (interface{}, error) {
		fmt.Fprintf(os.Stderr, "Event: %s\n", event)

		// Initialize response
		r := response{}

		// Unmarshal into map so that we can look at query value
		var m message
		err := json.Unmarshal(event, &m)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Message Unmarshal Fail: %s\n", err)
			r.StatusCode = 500
			r.Body = fmt.Sprintf(`{"message": "%s"}`, err)
			return r, nil
		}
		fmt.Fprintf(os.Stderr, "Message: %s\n", m)

		// Connect to dyanamodb and get the table
		db := dynamo.New(session.New(), &aws.Config{Region: aws.String("us-east-1")})
		table := db.Table("sasha." + m.PathParameters.Table)
		fmt.Fprintf(os.Stderr, "Table: %#v\n", table)

		// Query the proper table
		if m.PathParameters.Table == "people" {
			// Get person record
			var p Person
			value := m.QueryStringParameters["person"].(string)
			err = table.Get("person", value).One(&p)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Get Error: %s\n", err)
				r.StatusCode = 404
				r.Body = fmt.Sprintf(`{"message": "%s"}`, err)
				return r, nil
			}
			fmt.Fprintf(os.Stderr, "Person: %#v\n", p)

			// Prepare success response
			r.StatusCode = 200
			responseBody, err := json.Marshal(p)
			if err != nil {
				r.StatusCode = 500
				r.Body = fmt.Sprintf(`{"message": "%s"}`, err)
				return r, nil
			}
			r.Body = string(responseBody)
		} else if m.PathParameters.Table == "locations" {
			// Get location record
			var locations []Location
			err = table.Scan().All(&locations)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Get Error: %s\n", err)
				r.StatusCode = 404
				r.Body = fmt.Sprintf(`{"message": "%s"}`, err)
				return r, nil
			}
			fmt.Fprintf(os.Stderr, "Location: %#v\n", locations)

			// Prepare success response
			r.StatusCode = 200
			responseBody, err := json.Marshal(locations)
			if err != nil {
				r.StatusCode = 500
				r.Body = fmt.Sprintf(`{"message": "%s"}`, err)
				return r, nil
			}
			r.Body = string(responseBody)
		} else {
			// Prepare table-not-found response
			r.StatusCode = 404
			r.Body = fmt.Sprintf(`{"message": "Table not found: %v."}`, m.PathParameters.Table)
		}

		// Respond
		return r, nil
	})
}
