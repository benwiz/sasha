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

## To Do

- High Priority
  - Rudimentary GUI to control light
  - Rudimentary fb messenger UI to control light (this is really part of Umbra)

- Low Priority (medium falls into low)
  - Start using Django REST Framework (I think this allows for auto docs!)
  - Use sqlite database (or other longer term solution) so that the state isn't reset every time the webserver restarts. Maybe. There is value in expecting the state to be rebuilt within 10 seconds.
  - Generic tree traversing algorithm?

- Planning/architecture/design
  - Design GUI
  - Design Chatbot UI
  - Design Gestures UI
  - Figure out the best architecture to track humans (location, name, etc.). Remember, no logic just tracking.
