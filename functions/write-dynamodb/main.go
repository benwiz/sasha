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
	PathParameters struct {
		Query string `json:"query"`
	} `json:"pathParameters"`
	Body map[string]interface{} `json:"body"`
}

type person struct {
}

// https://gobyexample.com/json

func main() {
	apex.HandleFunc(func(event json.RawMessage, ctx *apex.Context) (interface{}, error) {
		fmt.Fprintf(os.Stderr, "Event: %s\n", event)

		// Unmarshal event
		var m message
		err := json.Unmarshal(event, &m)
		if err != nil {
			return nil, err
		}

		// Unmarshal the Body into the correct struct based on the Query
		if m.PathParameters.Query == "person" {
			// TODO: Unmarshal
		} else {
			return fmt.Sprintf("Unknown table: %v, %s", m.PathParameters.Query, m.PathParameters.Query)
		}

		// Connect to dyanamodb
		// db := dynamo.New(session.New(), &aws.Config{Region: aws.String("us-west-1")})
		// table := db.Table("sasha.people")

		// Put item
		// p := person{UserID: 613, Time: time.Now(), Msg: "hello"}
		// err := table.Put(w).Run()

		// return message["pathParameters"].(string), nil
		return m.Body["banana"].(string), nil
	})
}
