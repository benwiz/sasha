package main

import (
	"encoding/json"
	"fmt"
	"github.com/apex/go-apex"
	"io/ioutil"
	"net/http"
	"os"
)

var sashaURL = "https://sasha.benwiz.io"

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

		// Get lat and lng from message
		lat := m.QueryStringParameters.Lat
		lng := m.QueryStringParameters.Lng
		fmt.Fprintf(os.Stderr, "Lat: %f\n", lat)
		fmt.Fprintf(os.Stderr, "Lng: %f\n", lng)

		// GET {sashaURL}/dynamo/locations
		resp, err := http.Get(sashaURL + "/dynamo/locations")
		if err != nil {
			fmt.Fprintf(os.Stderr, "Get /dynamo/locations error: %s\n", err)
			r.StatusCode = 500
			r.Body = fmt.Sprintf(`{"message": "%s"}`, err)
			return r, nil
		}
		defer resp.Body.Close()

		// Read response
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Read /dynamo/locations response error: %s\n", err)
			r.StatusCode = 500
			r.Body = fmt.Sprintf(`{"message": "%s"}`, err)
			return r, nil
		}
		fmt.Fprintf(os.Stderr, "Locations body:%s\n", string(body))

		// Parse into location structs
		locations := make([]location, 0)
		err = json.Unmarshal(body, &locations)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Get /dynamo/locations error: %s\n", err)
			r.StatusCode = 500
			r.Body = fmt.Sprintf(`{"message": "%s"}`, err)
			return r, nil
		}
		fmt.Fprintf(os.Stderr, "Locations slice:%s\n", locations)

		// Respond
		r.StatusCode = 200
		r.Body = "{\"lat\": -1, \"lng\": -1}"
		return r, nil
	})
}
