# Sasha

```bash
docker-compose up
```

```bash
docker exec -it sasha bash
```

## To Do

- Journal
  - Use Twilio to send a text message.
  - Handle a response by appending it to a database or google sheets document.
  - Use celery to text once a day.

## Notes

### Note 1 - 8/30/17

- The first app I created is called _core_. It will probably need to be replaced with more specific apps like _home_, _online_, or other names.
- All apps except for _core_ should begin their endpoint with `/appname/...`
