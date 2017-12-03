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

type event struct {
	Records []record `json:"Records"`
}

type record struct {
	Sns sns `json:"Sns"`
}

type sns struct {
	TopicArn string `json:"TopicArn"`
	Message  string `json:"Message"`
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

		// Get the topic name
		topicArnSplit := strings.Split(e.Records[0].Sns.TopicArn, ":")
		topicName := topicArnSplit[len(topicArnSplit)-1]

		// Connect to dyanamodb and get the table
		db := dynamo.New(session.New(), &aws.Config{Region: aws.String("us-east-1")})
		table := db.Table("sasha." + topicName)
		fmt.Fprintf(os.Stderr, "Table: %#v\n", table)

		// Unmarshal the Items into the correct struct based on the Query
		if topicName == "people" {
			var p Person
			err = json.Unmarshal([]byte(e.Records[0].Sns.Message), &p)
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

				// TODO: This is a bad way of handling the proper key name.
				if key == "latestcoordstimestamp" {
					key = "latest_coords_timestamp"
				} else if key == "lastseenlocation" {
					key = "last_seen_location"
				} else if key == "lastseentimestamp" {
					key = "last_seen_timestamp"
				} else if key == "calculatedlocation" {
					key = "calculated_location"
				}

				// TODO: Need a much better way of handling missing data.
				if key == "latitude" && value.(float32) == 0 ||
					key == "longitude" && value.(float32) == 0 ||
					key == "latest_coords_timestamp" && value.(string) == "" ||
					key == "calculated_location" && value.(string) == "" ||
					key == "last_seen_location" && value.(string) == "" ||
					key == "last_seen_timestamp" && value.(string) == "" {
					continue
				}
				fmt.Fprintf(os.Stderr, "Update Person: %#v, %#v\n", key, value)

				// Update record; TODO: We should not be calling this mulitple times. Instead
				// the struct should somehow expand multiple `Set()` or use `SetExpr()` cleverly.
				var result Person
				err = table.Update("person", p.Person).Set(key, value).Value(&result)
				if err != nil {
					r.StatusCode = 500
					r.Body = fmt.Sprintf(`{"message": "%s"}`, err)
					return r, nil
				}
				fmt.Fprintf(os.Stderr, "Updated Person: %#v\n", result)
			}

			// TODO: Better response body. Use the created record data in response.
			r.StatusCode = 200
			r.Body = fmt.Sprintf(`{"message": "Successfully updated People record: %s."}`, p.Person)
			// } else if topicName == "locations" {
			// 	// NOTE: Probably don't need to be programmatically updating the locations table.
			// 	var l Location
			// 	err = json.Unmarshal([]byte(e.Records[0].Sns.Message), &l)
			// 	if err != nil {
			// 		fmt.Fprintf(os.Stderr, "Locations Unmarshal Fail: %s\n", err)
			// 		r.StatusCode = 500
			// 		r.Body = fmt.Sprintf(`{"message": "%s"}`, err)
			// 		return r, nil
			// 	}

			// 	// Create a map of the struct so that we may iterate over it
			// 	v := reflect.ValueOf(l)

			// 	// Iterate over values
			// 	for i := 0; i < v.NumField(); i++ {
			// 		key := strings.ToLower(v.Type().Field(i).Name)
			// 		if key == "name" {
			// 			continue
			// 		}
			// 		value := v.Field(i).Interface()

			// 		// TODO: Need a much better way of handling missing data.
			// 		if key == "points" && value.([][3]float32) == nil {
			// 			continue
			// 		}
			// 		fmt.Fprintf(os.Stderr, "Update Location: %#v, %#v\n", key, value)

			// 		// Update record; TODO: We should not be calling this mulitple times. Instead
			// 		// the struct should somehow expand multiple `Set()` or use `SetExpr()` cleverly.
			// 		var result Location
			// 		err = table.Update("name", l.Name).Set(key, value).Value(&result)
			// 		if err != nil {
			// 			r.StatusCode = 500
			// 			r.Body = fmt.Sprintf(`{"message": "%s"}`, err)
			// 			return r, nil
			// 		}
			// 		fmt.Fprintf(os.Stderr, "Updated Person: %#v\n", result)

			// 		// TODO: Better response body. Use the created record data in response.
			// 		r.StatusCode = 200
			// 		r.Body = fmt.Sprintf(`{"message": "Successfully updated Location record: %s."}`, l.Name)
			// 	}
		} else {
			r.StatusCode = 404
			r.Body = fmt.Sprintf(`{"message": "Table %s not found."}`, topicName)
		}

		return r, nil
	})
}
