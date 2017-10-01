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
  - Python API Wrapper (use the file from Umbra/fbchat)
  - Clean google stuff out of requirements.txt

- Low Priority (medium and low)
  - Start using Django REST Framework (I think this allows for auto docs!)
  - Use sqlite database (or other longer term solution) so that the state isn't reset every time the webserver restarts. Maybe. There is value in expecting the state to be rebuilt within 10 seconds.
  - Generic tree traversing algorithm?

- API Wrappers (remaining)
  - Python
  - Node.js
  - JavaScript (ajx)
  - Go
  - Clojure
  - Java
  - Rust

- Planning/architecture/design
  - Design GUI
  - Design Chatbot UI
  - Design Gestures UI
  - Figure out the best architecture to track humans (location, name, etc.). Remember, no logic just tracking.

- Look into Git Submodules to discover if that would be a better git architecture for `sasha` and her parts: `brain`, `umbra`, and `zing`. The major value being in a consolidated to do list as well as containing overall TODOs and TODOs that belong to no repo (e.g. raspberry pi).
