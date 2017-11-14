# Sasha

A collection of microservices that combined make Sasha.

## sasha-ui

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

## send-bunny

A Python function that text's the environment variable `PHONE` a link to a bunny picture.

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

## To Do

- Write a generic DynamoDB write as a Lambda endpoint in Go
- Set up Zing to report wemo switch status directly to DynamoDB
- overland-receiver needs to write the current location to a DynamoDB

- Detect if we don't sleep together

- Use a _single_ permissions role for all of sasha's functions.
- Better libs strategy for Python functions (see `send-image`).
- Receive sms
- Eventually I'd like to move off of IFTTT. This is important because otherwise I could just use IFTTT and it's webhook features as my entire backend and messaging system. Why? Because I want to do it myself. IFTTT is turning out to be kind of slow.
