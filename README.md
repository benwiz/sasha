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
  - Hook up toggle
  - Receive SNS notification for status of toggles??
- http-sns
  - make it do everything
  - don't use root credentials
