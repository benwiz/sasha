(ns org.get_location.lambsay
    (:gen-class :implements [com.amazonaws.services.lambda.runtime.RequestStreamHandler])
    (:require [cheshire.core :as json]
            ;   [cheshire.core :refer [generate-string]] ; could probably include parse-stream here and get rid of above line
              [clojure.java.io :as io]
              [clojure.string :as str]
              [clj-http.client :as client]
              [org.httpkit.client :as http])
    (:import (com.amazonaws.services.lambda.runtime Context)))

(defn locations
    []
    (println "BBB")
    (:body (client/get "https://sasha.benwiz.io/dynamo/locations?from=lambda" {:as :json})))
    ; (let [{:keys [status headers body error] :as resp} @(http/get "http://sasha.benwiz.io/dynamo/locations?from=lambda")]
    ;     (if error
    ;       (println "Failed, exception: " error)
    ;       (println "HTTP GET success: " status))))

(defn location
    [lat lng]
    (println "AAA")
    (println (locations))
    (println "CCC")
    (json/generate-string {:statusCode 200 :body (json/generate-string {:hi {:deeper "deepest!" :lat lat :lng lng}})}))

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
