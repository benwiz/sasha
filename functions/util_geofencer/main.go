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

type point struct {
	Lat float64
	Lng float64
}

type segment struct {
	Points [2]point
}

type response struct {
	StatusCode int    `json:"statusCode"`
	Body       string `json:"body"`
}

// intersects algorithm taken from https://stackoverflow.com/questions/3838329/how-can-i-check-if-two-segments-intersect
func (segment1 segment) intersects(segment2 segment) bool {
	// I1 = []float64{math.Min(segment1[0].Lat, segment1[1].Lat), math.Max(segment1[0].Lat, segment1[1].Lat)}
	// I2 = []float64{math.Min(segment2[0].Lat, segment2[1].Lng), math.Max(segment2[0].Lat, segment2[1].Lat)}

	// If abcess does not exist
	if math.Max(segment1.Points[0].Lat, segment1.Points[1].Lat) < math.Min(segment2.Points[0].Lat, segment2.Points[1].Lat) {
		fmt.Fprintf(os.Stderr, "abcess does not exist: %#v %#v\n", segment1.Points, segment2.Points)
		return false
	}
	// We have proved existence of mutual interval

	// Calculate A1, A2, b1, b2
	A1 := (segment1.Points[0].Lng - segment1.Points[1].Lng) / (segment1.Points[0].Lat - segment1.Points[1].Lat) // TODO: Handle divide by 0
	A2 := (segment2.Points[0].Lng - segment2.Points[1].Lng) / (segment2.Points[0].Lat - segment2.Points[1].Lat) // TODO: Handle divide by 0
	b1 := segment1.Points[0].Lng - A1*segment1.Points[0].Lat
	b2 := segment2.Points[0].Lng - A2*segment2.Points[0].Lat

	// If parallel
	if A1 == A2 {
		fmt.Fprintf(os.Stderr, "parallel: %#v %#v\n", segment1.Points, segment2.Points)
		return false
	}

	// Calculate Xa
	Xa := (b2 - b1) / (A1 - A2)

	// Check that Xa is not included in the mutual interval
	Ia := []float64{math.Max(math.Min(segment1.Points[0].Lat, segment1.Points[1].Lat), math.Min(segment2.Points[0].Lat, segment2.Points[0].Lat)),
		math.Min(math.Max(segment1.Points[0].Lat, segment1.Points[1].Lat), math.Max(segment2.Points[0].Lat, segment2.Points[1].Lat))}
	if Xa < Ia[0] || Xa > Ia[1] {
		fmt.Fprintf(os.Stderr, "not in mutual interval: %#v %#v\n", segment1.Points, segment2.Points)
		return false
	}
	return true
}

func (p point) isInPolygon(polygonPoints []point) bool {
	crossCount := 0

	// Loop through all edges of the polygon
	for i, polygonPoint := range polygonPoints {
		// Select index of second point in edge
		nextIndex := i + 1
		if i >= len(polygonPoints)-1 {
			nextIndex = 0
		}
		fmt.Fprintf(os.Stderr, "nextIndex: %d\n", nextIndex)

		// Create edge using `nextIndex`
		edge := segment{
			Points: [2]point{polygonPoint, polygonPoints[nextIndex]},
		}
		fmt.Fprintf(os.Stderr, "Edge: %#v\n", edge)

		// Check if an upward (90 deg) or downward (-90 def) line crosses the polygon
		upwardLine := segment{
			Points: [2]point{p, point{p.Lat, 90}},
		}
		downwardLine := segment{
			Points: [2]point{p, point{p.Lat, -90}},
		}
		// If there is an intersection in either direction, and that intersection
		if edge.intersects(upwardLine) || edge.intersects(downwardLine) {
			// TODO: Only increment count if intersection point is to the right of Px
			fmt.Fprintf(os.Stderr, "increase count\n")
			crossCount++
		}

		// Break loop if this is the final element
		if i >= len(polygonPoints) {
			fmt.Fprintf(os.Stderr, "Break")
			break
		}
	}

	fmt.Fprintf(os.Stderr, "CrossCount: %#v\n", crossCount)
	// If even
	if crossCount%2 == 0 {
		return false
	}
	// Else, if odd
	return true
}

func (p point) isInPolygonPIP(polygonPoints []point) bool {
	// Create slice of Points from slice of points
	points := []Point{}
	for _, polygonPoint := range polygonPoints {
		points = append(points, Point{X: polygonPoint.Lat, Y: polygonPoint.Lng})
	}

	// Use pip.go
	rectangle := Polygon{Points: points}
	pt := Point{X: p.Lat, Y: p.Lng}

	return PointInPolygon(pt, rectangle)
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

		// Get lat and lng from message and current point
		lat := m.QueryStringParameters.Lat
		lng := m.QueryStringParameters.Lng
		currentPoint := point{Lat: lat, Lng: lng}
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
		for _, loc := range locations {
			fmt.Fprintf(os.Stderr, "Name: %#v\n", loc.Name)
			fmt.Fprintf(os.Stderr, "Name: %#v\n", loc.Points)

			// TODO: If no points, skip.
			// If one point, then it's a circle
			if len(loc.Points) == 1 {
				// Get circle coordinates and radius
				circleLat := loc.Points[0][0]
				circleLng := loc.Points[0][1]
				circleRadius := loc.Points[0][2]

				// Get distance between person and circle center. That is, `sqrt( [lat-lat]^2 + [lng-lng]^2 )`.
				distance := math.Sqrt(math.Pow(lat-circleLat, 2) + math.Pow(lng-circleLng, 2))
				// If distance is smaller than radius
				if distance <= circleRadius {
					// Add loc to the list of `currentLocations`
					currentLocations = append(currentLocations, loc.Name)
				}
			} else {
				// Iterate through `loc.Points` to craft a polygon
				polygon := []point{}
				for _, locationPoint := range loc.Points {
					p := point{
						Lat: locationPoint[0],
						Lng: locationPoint[1],
					}
					polygon = append(polygon, p)
				}

				// Compare current point against the polygon
				if currentPoint.isInPolygonPIP(polygon) {
					// Add loc to the list of `currentLocations`
					fmt.Fprintf(os.Stderr, "Add to list: %#v\n", loc.Name)
					currentLocations = append(currentLocations, loc.Name)
				}
			}
		}

		// JSONify the response
		currentLocationsJson, err := json.Marshal(currentLocations)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Marshal currentLocation error: %s\n", err)
			r.StatusCode = 500
			r.Body = fmt.Sprintf(`{"message": "%s"}`, err)
			return r, nil
		}

		// Respond
		r.StatusCode = 200
		r.Body = fmt.Sprintf("%s", currentLocationsJson)
		fmt.Fprintf(os.Stderr, "Response: %#v\n", r)
		return r, nil
	})
}
