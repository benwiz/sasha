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

## To Do

- High Priority
  - Add a `.dockerignore` file
  - Start using Django REST Framework (I think this allows for auto docs!)
  - Finish node.js wrapper
    - Delete `api-wrappers/node/node_modules` and reinstall libraries froms scratch

- Low Priority (there is no medium priority)
  - Generic login where the user just has to type in a simple password
  - Generic tree traversing algorithm(s) for `worldstate` class
  - SSL: https://bluefletch.com/blog/domain-agnostic-letsencrypt-ssl-config-for-elastic-beanstalk-single-instances/

- API Wrappers (remaining)
  - Go
  - Node.js
  - JavaScript (ajax)
  - Clojure
  - Java
  - Rust
  - C

## General To Do

- High Priority
  - Move TODOs into a trello board, but it needs a more organized backlog than jira
  - Deploy umbra to raspberrypi or linux computer (and move into my room)
  - Figure out how to handle music
  - Consider bringing a GUI to the raspberry pi in the living room and using the wireless keyboard and mouse.

- Low Priority

- Planning/architecture/design
  - Design GUI
  - Design Chatbot UI
  - Design Gestures UI
  - Figure out the best architecture to track humans (location, name, etc.). Remember, no logic just tracking.

- Look into Git Submodules and Subtrees to discover if they would be a better git architecture for `sasha` and its parts: `brain`, `umbra`, and `zing`. The major value being in a consolidated to do list as well as containing overall TODOs and TODOs that belong to no repo (e.g. raspberry pi).
- Raspberry Pi auto update
