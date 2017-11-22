package main

import (
	"encoding/json"
	"fmt"
	"github.com/apex/go-apex"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/guregu/dynamo"
	"os"
	"reflect"
	"strings"
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

			// Create a map of the struct so that we may iterate over it
			v := reflect.ValueOf(p)

			// Iterate over values
			for i := 0; i < v.NumField(); i++ {
				key := strings.ToLower(v.Type().Field(i).Name)
				if key == "person" {
					continue
				}
				value := v.Field(i).Interface()
				if key == "age" && value == 0 || key == "gender" && value == "" {
					continue
				}
				fmt.Fprintf(os.Stderr, "Update Person: %#v, %#v\n", key, value)

				// Update record; TODO: We should not be calling this mulitple times. Instead
				// the struct should somehow expand multiple `Set()` or use `SetExpr()` cleverly.
				var result person
				err = table.Update("person", "ben").Set(key, value).Value(&result)
				if err != nil {
					r.StatusCode = 500
					r.Body = fmt.Sprintf(`{"message": "%s"}`, err)
					return r, nil
				}
				fmt.Fprintf(os.Stderr, "Updated Person: %#v\n", result)
			}

			// TODO: Better response body. Use the created record data in response.
			r.StatusCode = 200
			r.Body = fmt.Sprintf(`{"message": "Successfully updated record: %s."}`, p.Person)
		} else {
			r.StatusCode = 404
			r.Body = fmt.Sprintf(`{"message": "Table %s not found."}`, m.PathParameters.Table)
		}

		return r, nil
	})
}
