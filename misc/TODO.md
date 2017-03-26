# TO DO FOR PUBLISH

- a forebrain skill that leverages the mopidy actuator to intelligently pick songs based on a model trained by machine learning.

- architecture modifications
    - use hindbrain
    - use message stream between hindbrain and forebrain
    - sensor endpoints need to reply better
    - sensors -> hindbrain (-> publish -> consume by forebrain) -> forebrain -> actuators
        - sensor takes raw input and turns it into a useable format
        - hindbrain publishes compiled senses
        - forebrain consumes compiled senses to update the model of the world it maintains and makes decisions
        - actuators perform calculations and actions

- stream mopidy to any device that subscribes, maybe
    - https://docs.mopidy.com/en/latest/audio/#streaming-through-icecast

- internal functionality docs
- good README

# TO DO

- skills
    - set reminders
    - what is the weather?
    - volume louder/quieter
    - spotify
        - shuffle artist
        - play playlist
    * dj
        * machine learning & composing on songs, then samples, then sounds

- training tools
    - train it's music knowledge
    - snowboy trainer

- other
    - gui to watch realtime what's going on inside sasha
    - auto docs for internal functionality
    - handle no song found `./server/handlers/actuators/lib/mopidy.js:153:47`

- long term intelligence
    - have a database of people (human:[id, first name, last name, nickname, d.o.b., address], human_visit:[id, human_id, start_date, end_date])
