# Sasha

```bash
docker-compose up
```

```bash
docker exec -it sasha bash
```

## To Do

- Journal
  - Use celery to text once a day.
  - Move the google sheets api credentials to a folder at root.
  - Location from where message was sent.
  - CDT/CST time column. Or better yet, local time whatever that happens to be.

- Monitoring
  - Somehow run a chatbot test when accessing the index and display whether that chatbot is working.

## Notes

### Note 1 - 8/30/17

- The first app I created is called _core_. It will probably need to be replaced with more specific apps like _home_, _online_, or other names.
- All apps except for _core_ should begin their endpoint with `/appname/...`

### Note 2 9/3/17

- If I start adding more and more background services (e.g. fb listener) I should figure out a better way to run parallel processes in Django or consider separating out these jobs into another Docker container.
