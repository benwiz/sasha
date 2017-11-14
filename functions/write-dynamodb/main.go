package main

import (
	"encoding/json"
	"fmt"
	"github.com/apex/go-apex"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"os"
)

type message struct {
	Hello string `json:"hello"`
}

func main() {
	apex.HandleFunc(func(event json.RawMessage, ctx *apex.Context) (interface{}, error) {
		fmt.Fprintf(os.Stderr, "Event: %s", event)

		// TODO: Instead of unmarshalling the event into the message, just write
		// it directly to DynamoDB.

		var m message
		if err := json.Unmarshal(event, &m); err != nil {
			return nil, err
		}

		return m, nil
	})
}
