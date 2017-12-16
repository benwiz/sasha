(defproject org.get_location "0.0.0-SNAPSHOT"
    :description "For the provided coordinates determine if they fall within any Locaion."
    :dependencies [[cheshire "5.7.0"]
                   [com.amazonaws/aws-lambda-java-core "1.1.0"]
                   [com.amazonaws/aws-lambda-java-events "1.1.0" :exclusions [com.amazonaws/aws-java-sdk-s3
                                                                              com.amazonaws/aws-java-sdk-sns
                                                                              com.amazonaws/aws-java-sdk-cognitoidentity
                                                                              com.amazonaws/aws-java-sdk-kinesis
                                                                              com.amazonaws/aws-java-sdk-dynamodb]]
                   [org.clojure/clojure "1.8.0"]
                   [clj-http "3.7.0"]
                   [http-kit "2.2.0"]]
    :aot :all)
