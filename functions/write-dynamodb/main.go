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
	PathParameters table  `json:"pathParameters"`
	Body           string `json:"body"`
}

type table struct {
	Table string `json:"table"`
}

type person struct {
	Person string `json:"person" dynamo:"person"`
	Age    int    `json:"age" dynamo:"age"`
	Gender string `json:"gender" dynamo:"gender"`
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

		// Connect to dyanamodb
		db := dynamo.New(session.New(), &aws.Config{Region: aws.String("us-east-1")})
		table := db.Table("sasha." + m.PathParameters.Table)
		fmt.Fprintf(os.Stderr, "Table: %#v\n", table)

		// Unmarshal the Body into the correct struct based on the Query
		if m.PathParameters.Table == "people" {
			var p person
			err = json.Unmarshal([]byte(m.Body), &p)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Person Unmarshal Fail: %s\n", err)
				r.StatusCode = 500
				r.Body = fmt.Sprintf(`{"message": "%s"}`, err)
				return r, nil
			}

			// Put item into sasha.people table
			err = table.Put(p).Run() // TODO: This should be able to return the created record. Use it in response.
			if err != nil {
				fmt.Fprintf(os.Stderr, "Table Put Fail: %s\n", table)
				r.StatusCode = 500
				r.Body = fmt.Sprintf(`{"message": "%s"}`, err)
				return r, nil
			}

			// TODO: Better response body. Use the created record data in response.
			r.StatusCode = 200
			r.Body = fmt.Sprintf(`{"message": "Successfully wrote record: %s."}`, p.Person)
		} else {
			r.StatusCode = 404
			r.Body = fmt.Sprintf("Table not found: %v.", m.PathParameters.Table)
		}

		return r, nil
	})
}
