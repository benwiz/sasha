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

Quick brainstorm:

- I need to leverage SNS more.
  - For example, `overland-receiver` should do nothing other than turn the overland payload into an SNS message. Then, one Lambda function will pick that up and write it to DynamoDB (or some other data store). Other lambda functions will be triggered by that message.
  - Another example: `analyze-image` publish a message with _person_ and _location_. One Lambda function will write that data to a data store. Other lambda functions will be triggered by that message.

## To Do

- Create Alexa Smart Home Skill
  - Allow async response message (`Send Alexa Events`). This should hopefully enable being able to use Alexa as my hub. A geofence message could send Alexa a message.
- RaspiCam to S3 bucket

- Cognito authorizer, might have to be a custom authorizer. For: `/`, `/map`, and `/sns`.

- Location: Perform action based on current location of requested (or all?) people. Use Clojure.
- Currently, to add a new field to an existing model the following steps must be performed:
  - Update the sylink `models.go` (this is okay)
  - Perform some logic around null values and naming conventions inside `update-dynamodb` (this should not be necessary).
- Switch to serverless.com or AWS SAM
- Migrate from IFTTT to Zing as the hub. Maybe with Greengrass. An intermediary step (pre-AWS-Greengrass and pre-AWS-IoT) would be to use SNS messaging.

- Low priority
  - The `updateDynamoDB()` function is used in 2 places and should be shared in a symlink file.
  - Docs
  - `overland-receiver` needs query string based api key
  - `overland-receiver` needs to handle the response from `updateDynamoDB()`
  - `write-dynamodb` needs to handle missing data
  - Detect if we don't sleep together
  - Better libs strategy for Python functions (see `send-image`).
  - Receive sms, this may mean a twilio integration.
  - `person` in dynamodb table `people` should be changed to `name`
  - All Node.js needs to handle API json response with a try/catch
  - In `analyze-image` handle failure `searchFacesByImage()`, `updateDynamoDB()`, and `deleteS3Object()` responses.
  - `analyze-image` needs to `searchFacesByImage()` for all faces, not just largest. This requires creating crops.

https://sasha.auth.us-east-1.amazoncognito.com/login?response_type=token&client_id=5nak3f7i74nijenes3ec3un9bg&redirect_uri=https://sasha.benwiz.io/?
