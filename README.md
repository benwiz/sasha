# Sasha

Sasha is a decision center where decisions (internal or delivered by a human) cause Sasha to produce commands. In the Umbra, there are a myriad of microservices that are listening to Sasha waiting to hear the right trigger.

Example uses:

- Control the lights
- Control the music
- Analyze my journal and make predictions/suggestions
- Be my to do list and reminder system
- Wake me up in the morning

Basically, my own personal assisant.

## (the?) Umbra

- The Umbra is not a part of this repo.

- Sasha does not perform any actions.
- Sasha does not know how to contact any actuators.
- Sasha does not know about the Umbra.
- The Umbra is a collection of consise microservices that listens to Sasha in order to know when to execute their singular task/purpose.

## Get up and running locally

Run Sasha

```bash
docker-compose up
```

Get inside Sasha

```bash
docker exec -it sasha bash
```

## To Do

- Person object
  + Can I connect with google contacts?
  + Use Django's `user` class
  - First name
  - Last name
  - Location

- Journal
  - Use celery or other tool to text once a day.
  - Move the google sheets api credentials to an assets or secrets folder at root.
  - Record location of Person.
  - Reply with link to google sheets document on request.
  - Implement FetchUnread

- Monitoring
  - Somehow run a chatbot test when accessing the index and display whether that chatbot is working.

## Notes

### Note 1 - 8/30/17

- The first app I created is called _core_. It will probably need to be replaced with more specific apps like _home_, _online_, or other names.
- All apps except for _core_ should begin their endpoint with `/appname/...`

### Note 2 9/3/17

- If I start adding more and more background services (e.g. fb listener) I should figure out a better way to run parallel processes in Django or consider separating out these jobs into another Docker container.
