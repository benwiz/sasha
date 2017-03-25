# TO DO FOR MVP

- fix electron-snowboy issue
- build & host sasha-v1 somewhere online for easy download
- basic README

# TO DO FOR PUBLISH

- sensor endpoints need to return more info (e.g. response to get volume)

- internal functionality docs
- good README

- stream mopidy to any device that subscribes
    - https://docs.mopidy.com/en/latest/audio/#streaming-through-icecast

- architecture modifications
    - add SenseReceivers (find better name, maybe just sensors) & Hindbrain
        - a.k.a. use a State of the World updated via a message stream that is read by the Forebrain
    - decide when Sensors should reply to requester
    - real logging

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
