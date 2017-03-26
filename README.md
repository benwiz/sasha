# sasha

**[Notes](#notes)**
**[Build](#build)**

## notes

Sensor docs at http://localhost:8081/documentation

`electron-packager . sasha --all --icon "public/assets/wizatd-hat.ico"`

`cp -r ./node_modules/snowboy/lib/node/binding/Release/node-v51-darwin-x64/ ./node_modules/snowboy/lib/node/binding/Release/electron-v1.6-darwin-x64/`

## build

1. `git clone git@github:benwiz/sasha.git && cd sasha`
2. ``


`electron.js`, `logfile.js`, and `private.js` exist only for the sake of electron. Electron is a short term solution to distribute Sasha for early stage tests. I have not decided on any long term solution.
