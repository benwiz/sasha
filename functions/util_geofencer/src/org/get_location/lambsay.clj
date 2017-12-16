(ns org.get_location.lambsay
    (:gen-class :implements [com.amazonaws.services.lambda.runtime.RequestStreamHandler])
    (:require [cheshire.core :as json]
              [cheshire.core :refer [generate-string]] ; could probably include parse-stream here and get rid of above line
              [clojure.java.io :as io]
              [clojure.string :as str]
              [clj-http.client :as client])
    (:import (com.amazonaws.services.lambda.runtime Context)))

(defn locations
    []
    (println "hey") ; something is wrong after this line
    ; (json/parse-stream (client/get "https://sasha.benwiz.io/dynamo/locations")))
    (client/get "https://sasha.benwiz.io/dynamo/locations"))

(defn location
    [lat lng]
    (println (locations))
    (generate-string {:statusCode 200 :body (generate-string {:hi {:deeper "deepest!" :lat lat :lng lng}})}))

(defn -handleRequest
    [this input-stream output-stream context]
    (let [handle (io/writer output-stream)
          is (json/parse-stream (io/reader input-stream))
          query-string-parameters (get is "queryStringParameters")
          lat (bigdec (get query-string-parameters "lat"))
          lng (bigdec (get query-string-parameters "lng"))
          response (location lat lng)]
        (println response)
        (.write handle response)
        (.flush handle)))


; TODO: Write a function to get location records via https
; TODO: Write function that finds coordindates within location
