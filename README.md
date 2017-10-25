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

- Set up PIR watching entries and exits into room
  - Have it report to a database or redis data store
  - A cron will periodically check this against my gps location to update another record maintaing my specific location with respect to a list of places (bedroom, kitchen, marg's room, office, rouse's, etc.)
    - ... maybe it stores two locations... macro using gps and micro using more location specific details beginning with home vs. bedroom
  + I.E. Figure out state store for human location and switch states

- Get another light that is only on when we are together or we are each at home
