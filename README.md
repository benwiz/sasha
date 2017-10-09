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
  - SSL: https://bluefletch.com/blog/domain-agnostic-letsencrypt-ssl-config-for-elastic-beanstalk-single-instances/
  - Start using Django REST Framework (I think this allows for auto docs!)

- Low Priority (medium and low)
  - Generic login where the user just has to type in a simple password
  - Generic tree traversing algorithm(s) for `worldstate` class

- API Wrappers (remaining)
  - Node.js
  - JavaScript (ajax)
  - Go
  - Clojure
  - Java
  - Rust

## General To Do

- Build APIs to handle controlling music
  - Some performance may be sacrificed to not require this to be online. If Sasha really has no direct communication with any of its services in Umbra or Zing, Umbra can also be deployed locally (currently not on RPI due the fbchat service).
  - TL;DR - Replicate the wemo service structure for spotify controls in Umbra

- Deploy umbra to raspberrypi or linux computer (and move into my room)
- Look into wifi speakers/controlling linux computer and second raspberry pi with sasha and via spotify app

- Planning/architecture/design
  - Design GUI
  - Design Chatbot UI
  - Design Gestures UI
  - Figure out the best architecture to track humans (location, name, etc.). Remember, no logic just tracking.

- Look into Git Submodules and Subtrees to discover if they would be a better git architecture for `sasha` and its parts: `brain`, `umbra`, and `zing`. The major value being in a consolidated to do list as well as containing overall TODOs and TODOs that belong to no repo (e.g. raspberry pi).
- Raspberry Pi auto update
