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

type query struct {
	Query string `json:"query"`
}

type person struct {
	Person string `json:"person" dynamo:"person"`
	Age    int    `json:"age" dynamo:"age"`
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
		db := dynamo.New(session.New(), &aws.Config{Region: aws.String("us-east-1")})

		// Unmarshal the Body into the correct struct based on the Query
		if q.Query == "person" {
			var p person
			err = json.Unmarshal(*message["body"], &p)
			if err != nil {
				return nil, err
			}

			// Put item into sasha.people table
			table := db.Table("sasha.people")
			err = table.Put(p).Run()
			if err != nil {
				fmt.Fprintf(os.Stderr, "Table Fail: %s\n", table)
				return nil, err
			}

			return p, nil
		}

		return fmt.Sprintf("Unknown table: %v.", q.Query), nil
	})
}
