# TO DO

- spotify play playlist (partially enabled, but mopidy doesn't handle searching for playlists like it does for songs/artists)
- music adjust volume up/down
- remind me in X minutes or at X:XX o'clock
- music trainer
    - scrape spotify to train Watson speech-to-text and Luis.ai nlp
    - maybe it's a sasha-brain endpoint that leverages sasha-api endpoints that scrape mopidy. Hit the brain endpoint on a cron?
    - or maybe it should be a standalone service that leverages sasha-api
    - the biffer question is: should sasha-brain be in charge of training?

ARCHITECTURE LEVEL (for api too):
- use boom
- auto documentation
- logging

- snowboy trainer
    - webapp allows people to record "sasha" 3 times, select gender, age, email me
    - maybe do in express... one file webapp???
