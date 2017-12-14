(ns org.get_location.lambsay
    (:gen-class :implements [com.amazonaws.services.lambda.runtime.RequestStreamHandler])
    (:require [cheshire.core :as json]
              [clojure.java.io :as io]
              [clojure.string :as str])
    (:import (com.amazonaws.services.lambda.runtime Context)))

(defn -handleRequest
    [this input-stream output-stream context]
    (let [handle (io/writer output-stream)
          is (json/parse-stream (io/reader input-stream))]
        ; (println is)
        (println (get is "queryStringParameters"))
        (.write handle (str "hello" " world"))
        (.write handle "!")
        (.flush handle)))


; TODO: Write a correct api response in json
; TODO: Write a function to get location records via https
; TODO: Write function that finds coordindates within location
