(ns org.get_location.lambsay
    (:gen-class :implements [com.amazonaws.services.lambda.runtime.RequestStreamHandler])
    (:require [cheshire.core :as json]
              [clojure.java.io :as io]
              [clojure.string :as str])
    (:import (com.amazonaws.services.lambda.runtime Context)))

(defn -handleRequest
    [this input-stream output-stream context]
    (let [handle (io/writer output-stream)]
        ; (json/parse-stream (io/reader is))
        (println (json/parse-stream (io/reader input-stream)))
        (.write handle (str "hello" " world"))
        (.flush handle)))
