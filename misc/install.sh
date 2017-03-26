#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

echo -n "Enter your Spotify username and press [ENTER]: "
read SPOTIFY_USERNAME

echo -n "Enter your Spotify password and press [ENTER]: "
read SPOTIFY_PASSWORD

FILEPATH=sasha.app/Contents/Resources/app/private.js
sed -i '' "s/SPOTIFY_USERNAME/$SPOTIFY_USERNAME/" $FILEPATH
sed -i '' "s/SPOTIFY_PASSWORD/$SPOTIFY_PASSWORD/" $FILEPATH

# mv ./sasha.app /Applications/
