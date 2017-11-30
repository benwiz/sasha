# Sasha

A collection of microservices that combined make Sasha.

## gui

GUI for interacting with Sasha.

A simple Node.js Lmabda function that reads an html file, handles some string replacements, and serves the resulting html.

[https://sasha.benwiz.io](https://sasha.benwiz.io)

## http-sns

A Node.js Lambda function hooked up via the API Gateway for a POST request. The body of the POST request will be taken exactly as is and placed into the topic noted in the query string.

I chose to use the library `aws-sns-publish` because it just works. I should probably learn `aws-sdk`.

Query string

```text
topic STRING (required)
```

Payload

```text
Match desired message content.
```

## sns-ifttt

A Node.js Lambda function that consumed the `ifttt` SNS topic. It takes the `action` and optional `payload` from the following message.

```json
{
  "action": "wemo_switch_1_on",
  "payload": {
    "value1": "aaa",
    "value2": "bbb",
    "value3": "ccc"
  }
}
```

## write-dynamodb

A Go function that takes an undefined JSON message and writes it to the specified key in DynamoDB. As schema's change, the structs defined in this function will have to change. I'm unsure if I like this or if I should use another language so I can submit generic payloads.

Invote the function with

```bash
apex invoke write-dynamodb < functions/write-dynamodb/event.json
```

## get-dynamodb

A Go function that takes a table name in the path paraters and a query string that matches the schema of the table.

Invote the function with

```bash
apex invoke get-dynamodb < functions/get-dynamodb/event.json
```

## overland-receiver

Receive the post request from the [Overland iOS app](https://overland.p3k.io/).

## map

Display a Google map with a pin at my current location. A temporary use for easier monitoring of the `overland-receiver` service.

## get-location

Clojure function that returns the coordinates and geolocation of given person.

## docs

Not yet working. Display API Gateway generated Swagger docs.

## index-faces

Run `indexFaces` for the faces bucket for Rekogntion.

```bash
aws rekognition create-collection --collection-id "faces"
```

```bash
aws rekognition list-collections
```

```bash
aws rekognition list-faces --collection-id faces
```

## analyze-image

## Deploy

Create a file called _env.json_ to store environment variables.

```json
{
  "PHONE_NUMBER": "",
  "UNSPLASH_APPLICATION_ID": ""
}
```

Optionally append the function name to deploy just that function.

```bash
apex deply -E env.json
```

Useful bash function.

```bash
apexdeploy() {
    if [ -z "$1" ]
    then
        apex deploy -E env.json
    else
        apex deploy -E env.json "$1"
    fi
}
```

## Notes

## To Do

- Security
- Refine SNS strategy
- Create Alexa Smart Home Skill
- Location
  - Test out polygon drawing for `map`. All `*-dynamo` functions need to handle polygons first.
  - Clojure `get-location` get current coordinates and known geolocation
  - Clojre call `get-location` and perform an action
    - Trigger sms with name of location, for now
- Currently, to add a new field to an existing model the following steps must be performed:
  - Update the sylink `models.go` (this is okay)
  - Perform some logic around null values and naming conventions inside `update-dynamodb` (this should not be necessary).
- Migrate from IFTTT to Zing as the hub. Maybe with Greengrass.

- Low priority
  - The `updateDynamoDB()` function is used in 2 places and should be shared in a symlink file.
  - Finish docs
  - `overland-receiver` needs to handle the response from `updateDynamoDB()`
  - `write-dynamodb` needs to handle missing data
  - Detect if we don't sleep together
  - Better libs strategy for Python functions (see `send-image`).
  - Receive sms, this may mean a twilio integration.
  - `update-dynamodb`
    - In a successful response include properties that do not (yet) exist in the model and also include the current record, not just the person's name.
    - Don't run mulitple updates, create multiple `Set()` or use `SetExpr()`
    - Need a much better way of not including some properties in the update (e.g. age=0, gender="")
    - Don't do the thing where I get the key and make it lowercase. Instead get the json keyname.
  - `person` in dynamodb table `people` should be changed to `name`
  - All Node.js needs to handle API json response with a try/catch
  - In `analyze-image` handle failure `searchFacesByImage()`, `updateDynamoDB()`, and `deleteS3Object()` responses.
  - `analyze-image` needs to `searchFacesByImage()` for all faces, not just largest. This requires creating crops.
