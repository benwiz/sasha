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

## text-bunny

Node.js Lambda function set on a CloudWatch cron with a JSON payload designating the phone number and message to send to.

Payload

```json
{
  "phone": "+18881234567",
  "message": "hey this is your text reminder"
}
```

If this is ever going to blast texts look into publishing to a normal sns topic then having the phone numbers subscribe to that topic. Instead of directly publishing to a specific phone number.

## Deploy

All node.js lambda functions:

- sasha-ui
- http-sns
- sns-ifttt
- text-bunny

```bash
npm run deploy
```

## To Do

- Port `services` to apex `functions`

- Receive sms
- Set up PIR watching entries and exits into room
  - Have it report to a database or redis data store
  - A cron will periodically check this against my gps location to update another record maintaing my specific location with respect to a list of places (bedroom, kitchen, marg's room, office, rouse's, etc.)
    - ... maybe it stores two locations... macro using gps and micro using more location specific details beginning with home vs. bedroom
  + I.E. Figure out state store for human location and switch states
- improved text-bunny
  - Text/message/email to Marg with a daily bun image using unsplash api
- Get another light that is only on when we are together or we are each at home

- Eventually I'd like to move off of IFTTT. This is important because otherwise I could just use IFTTT and it's webhook features as my entire backend and messaging system. Why? Because I want to do it myself.
