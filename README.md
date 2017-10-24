# Sasha

A collection of microservices that combined make Sasha.

## sasha-ui

GUI for interacting with Sasha.

A simple Node.js Lmabda function that reads an html file, handles some string replacements, and serves the resulting html.

Deploy

```bash
npm run deploy
```

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

Deploy

```bash
npm run deploy
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

Deploy

```bash
npm run deploy
```

## To Do

- sasha-ui
  - Somehow display the current status of the switch
- http-sns
  - faster? or is it slow due to sns-ifttt?
