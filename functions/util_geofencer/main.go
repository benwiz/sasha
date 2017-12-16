package main

import (
	"encoding/json"
	"fmt"
	"github.com/apex/go-apex"
	"io/ioutil"
	"math"
	"net/http"
	"os"
)

// NOTE: This can be extended with the Google Places API.

var sashaURL = "https://sasha.benwiz.io"

type message struct {
	QueryStringParameters queryStringParameters `json:"queryStringParameters"`
}

type queryStringParameters struct {
	Lat float64 `json:"lat,string"`
	Lng float64 `json:"lng,string"`
}

type location struct {
	Name   string       `json:"name"`
	Points [][3]float64 `json:"points"`
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
		fmt.Fprintf(os.Stderr, "Message: %#v\n", m)

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
		fmt.Fprintf(os.Stderr, "Locations slice:%#v\n", locations)

		// Initialize current location name variable
		var currentLocations []string

		// Loop through locations slice
		for _, location := range locations {
			fmt.Fprintf(os.Stderr, "Name: %#v\n", location.Name)
			fmt.Fprintf(os.Stderr, "Name: %#v\n", location.Points)

			// TODO: If no points, skip.
			// If one point, then it's a circle
			if len(location.Points) == 1 {
				// Get circle coordinates and radius
				circleLat := location.Points[0][0]
				circleLng := location.Points[0][1]
				circleRadius := location.Points[0][2]

				// Get distance between person and circle center. That is, `sqrt( [lat-lat]^2 + [lng-lng]^2 )`.
				distance := math.Sqrt(math.Pow(lat-circleLat, 2) + math.Pow(lng-circleLng, 2))
				// If distance is smaller than radius
				if distance <= circleRadius {
					// Add location to the list of `currentLocations`
					currentLocations = append(currentLocations, location.Name)
				}
			} else {
				// TODO: Calculate if point lies inside polygon using ray method.
			}
		}

		// Respond
		r.StatusCode = 200
		r.Body = fmt.Sprintf("%v", currentLocations)
		return r, nil
	})
}
