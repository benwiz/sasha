# sasha

**[Notes](#notes)**
**[Build](#build)**

## notes

(world ->) sensors -> hindbrain -> forebrain -> actuators

world:
- send raw data to sensor endpoints

sensors:
- endpoints that receive raw data
- convert into a usable format for node.js
- send usable perception to hindbrain

hindbrain:
- compile and organize sensations
- publish composed message
    - until using kafta/rabbitmq, directly call forebrain

forebrain:
- maintain the most up-to-date state of the world
- consume message stream from hindbrain
- run appropriate actuators using messages from hindbrain + state of the world
    - receive feedback
    - run more actuators

actuators:
- run calculations
- perform actions on the world


Sensor docs at http://localhost:8081/documentation


## build

1. `git clone git@github:benwiz/sasha.git && cd sasha`

### in parts

2. new shell: `mopidy`
3. new shell: `cd sasha-listener && npm start`
4. original shell: `npm run dev`

### electron

2. `cp -r ./node_modules/snowboy/lib/node/binding/Release/node-v51-darwin-x64/ ./node_modules/snowboy/lib/node/binding/Release/electron-v1.6-darwin-x64/`
3. `./node_modules/.bin/electron-rebuild`

#### run

4. `npm run electron`

#### build

4. `npm run build`
5. `cp ../sasha-dist/install.sh ../sasha-dist/v0.X.X/`
6. zip the directory


## other

`electron.js`, `logfile.js`, and `private.js` exist only for the sake of electron. Electron is a short term solution to distribute Sasha for early stage tests. I have not decided on any long term solution.

## to do

[TO DO](./misc/TODO.md)
