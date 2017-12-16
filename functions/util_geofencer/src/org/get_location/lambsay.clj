(ns org.get_location.lambsay
    (:gen-class :implements [com.amazonaws.services.lambda.runtime.RequestStreamHandler])
    (:require [cheshire.core :as json]
              [cheshire.core :refer [generate-string]] ; could probably include parse-stream here and get rid of above line
              [clojure.java.io :as io]
              [clojure.string :as str])
    (:import (com.amazonaws.services.lambda.runtime Context)))

(defn -handleRequest
    [this input-stream output-stream context]
    (let [handle (io/writer output-stream)
          is (json/parse-stream (io/reader input-stream))
          output (generate-string
            {:statusCode 200 :body
            (generate-string {:hi {:deeper "deepest"}})})]
        (println (get is "queryStringParameters"))
        (println output)
        (.write handle output)
        (.flush handle)))


; TODO: Write a correct api response in json
; TODO: Write a function to get location records via https
; TODO: Write function that finds coordindates within location
