package main

import (
	"encoding/json"
	"fmt"
	"github.com/apex/go-apex"
	// "github.com/aws/aws-sdk-go/aws"
	// "github.com/aws/aws-sdk-go/aws/session"
	// "github.com/guregu/dynamo"
	"os"
)

type query struct {
	Query string `json:"query"`
}

type person struct {
	Name string `json:"name"`
}

func main() {
	apex.HandleFunc(func(event json.RawMessage, ctx *apex.Context) (interface{}, error) {
		fmt.Fprintf(os.Stderr, "Event: %s\n", event)

		// Unmarshal into map so that we can look at query value
		var message map[string]*json.RawMessage
		err := json.Unmarshal(event, &message)
		if err != nil {
			return nil, err
		}

		// Unmarshal event
		var q query
		err = json.Unmarshal(*message["pathParameters"], &q)
		if err != nil {
			return nil, err
		}

		// Connect to dyanamodb
		// db := dynamo.New(session.New(), &aws.Config{Region: aws.String("us-west-1")})

		// Unmarshal the Body into the correct struct based on the Query
		if q.Query == "person" {
			var p person
			err = json.Unmarshal(*message["body"], &p)
			if err != nil {
				return nil, err
			}

			// // Put item into sasha.people table
			// table := db.Table("sasha.people")
			// err := table.Put(w).Run()

			return p, nil
		} else {
			return fmt.Sprintf("Unknown table: %v", q.Query), nil
		}

		// return message["pathParameters"].(string), nil
		// return m.Body["banana"].(string), nil
	})
}
