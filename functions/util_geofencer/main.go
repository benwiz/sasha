package main

import (
	"encoding/json"
	"fmt"
	"github.com/apex/go-apex"
	"os"
)

type message struct {
	QueryStringParameters queryStringParameters `json:"queryStringParameters"`
}

type queryStringParameters struct {
	Lat float32 `json:"lat,string"`
	Lng float32 `json:"lng,string"`
}

type location struct {
	Name   string       `json:"name"`
	Points [][3]float32 `json:"points"`
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

		// Unmarshal into map so that we can look at query string
		var m message
		err := json.Unmarshal(event, &m)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Message Unmarshal Fail: %s\n", err)
			r.StatusCode = 500
			r.Body = fmt.Sprintf(`{"message": "%s"}`, err)
			return r, nil
		}
		fmt.Fprintf(os.Stderr, "Message: %s\n", m)

		// Respond
		r.StatusCode = 200
		r.Body = "{\"lat\": -1, \"lng\": -1}"
		return r, nil
	})
}
