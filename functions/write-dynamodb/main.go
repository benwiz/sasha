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

type message struct {
	PathParameters struct {
		Query string `json:"query"`
	} `json:"pathParameters"`
	Body map[string]interface{} `json:"body"`
}

// https://gobyexample.com/json

func main() {
	apex.HandleFunc(func(event json.RawMessage, ctx *apex.Context) (interface{}, error) {
		fmt.Fprintf(os.Stderr, "Event: %s\n", event)

		// // Unmarshal generic json into message
		// var message map[string]interface{} // TODO: Only generically unmarshal the Body
		// err := json.Unmarshal([]byte(event), &message)
		// if err != nil {
		// 	fmt.Fprintf(os.Stderr, "Error: %s\n", err)
		// 	return nil, err
		// }

		// Unmarshal event
		var m message
		err := json.Unmarshal(event, &m)
		if err != nil {
			return nil, err
		}

		// Connect to dyanamodb
		// db := dynamo.New(session.New(), &aws.Config{Region: aws.String("us-west-1")})
		// table := db.Table("sasha.people")

		// TODO: Write to db

		// return message["pathParameters"].(string), nil
		return m.Body["banana"].(string), nil
	})
}
