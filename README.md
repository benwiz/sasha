# Sasha

Sasha is a decision center. Sasha tracks the current-state-of-the-world and the desired-state-of-the-world. Sasha can be queried for some _(eventually)_ or all of the world's properties. In addition to responding with both states of the world, Sasha will also include a set of commands/instructions/actions that must take place to modify the current-state-of-the-world so that it matches the desired-state-of-the-world.

Example uses:

- Control the lights
- Control the music
- Analyze my journal and make predictions/suggestions
- Be my to do list and reminder system
- Wake me up in the morning

Basically, my own personal assisant.

## Relationship to Umbra and Zing

Umbra and Zing are collections of microservices that query Sasha in order to know what action to take. They are also frequently reporting to Sasha so that the current-state-of-the-world is as up-to-date as possible.

## Get up and running locally

Run Sasha

```bash
docker-compose up
```

## API Wrappers

### Python

```bash
pip install git+ssh://git@github.com/benwiz/sasha.git#"egg=sasha&subdirectory=api-wrappers/python"
```

```bash
python -c "import sasha; s = sasha.Sasha(); print(s)"
```

## To Do (to transfer to [Trello](https://trello.com/b/moFFwWYu/sasha))
