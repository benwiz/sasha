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

type event struct {
	Records []record `json:"Records"`
}

type record struct {
	Sns sns `json:"Sns"`
}

type sns struct {
	Message string `json:"Message"`
}

type message struct {
	Action string `json:"action"`
	Table  string `json:"table"`
	Key    string `json:"key"`
}

type response struct {
	StatusCode int    `json:"statusCode"`
	Body       string `json:"body"`
}

func main() {
	apex.HandleFunc(func(ev json.RawMessage, ctx *apex.Context) (interface{}, error) {
		fmt.Fprintf(os.Stderr, "Event: %s\n", ev)

		// Initialize response
		r := response{}

		// Unmarshal event
		var e event
		err := json.Unmarshal(ev, &e)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Event Unmarshal Fail: %s\n", err)
			r.StatusCode = 500
			r.Body = fmt.Sprintf(`{"message": "%s"}`, err)
			return r, nil
		}
		fmt.Fprintf(os.Stderr, "Parsed Event: %s\n", e)

		// Parse message
		var m message
		err = json.Unmarshal([]byte(e.Records[0].Sns.Message), &m)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Message Unmarshal Fail: %s\n", err)
			r.StatusCode = 500
			r.Body = fmt.Sprintf(`{"message": "%s"}`, err)
			return r, nil
		}
		fmt.Fprintf(os.Stderr, "Parsed Message: %s\n", m)

		// If not "delete" action then end function
		if m.Action != "delete" {
			r.StatusCode = 200
			r.Body = fmt.Sprintf(`{"message": "Not a delete action."`)
			return r, nil
		}

		// Connect to dyanamodb and get the table
		db := dynamo.New(session.New(), &aws.Config{Region: aws.String("us-east-1")})
		table := db.Table("sasha." + m.Table)
		fmt.Fprintf(os.Stderr, "Table: %#v\n", table)

		// Set the proper primary key for the table
		var key string
		if m.Table == "people" {
			key = "person"
		} else if m.Table == "locations" {
			key = "name"
		} else {
			// Prepare table-not-found response
			r.StatusCode = 404
			r.Body = fmt.Sprintf(`{"message": "Table not found: %v."}`, m.Table)
			return r, nil
		}

		// Delete record
		del := table.Delete(key, m.Key).Run()
		fmt.Fprintf(os.Stderr, "Deleted: %#v\n", del)

		// Prepare success response
		r.StatusCode = 200
		r.Body = fmt.Sprintf(`{"message": "Successfully deleted: %s from table %s."}`, m.Key, m.Table)

		// Respond
		return r, nil
	})
}
