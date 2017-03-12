# TO DO FOR MVP

- make music quieter after hearing "sasha"
- electron app should load external webpage (http://localhost:8080/config) in it's window
- figure out how to distribute sasha-listener
    - try to package with sasha.app with an optional 'use' feature
- deploy onto server so sasha can be used as a webapp
- sign up for bluemix watson speech-to-text or find alternative tool
- basic README

# TO DO FOR PUBLISH

- internal functionality docs
- good README

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

- long term intelligence
    - have a database of people (human:[id, first name, last name, nickname, d.o.b., address], human_visit:[id, human_id, start_date, end_date])
