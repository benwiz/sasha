'use strict';

// https://datasciencelab.wordpress.com/2013/12/12/clustering-with-k-means-in-python/
// https://keras.io/getting-started/sequential-model-guide/

// external libraries
const Promise = require('bluebird');
const Kmeans = require('node-kmeans');

const start = () => {

    console.log('hello, it\'s me the dj');

    return new Promise((resolve, reject) => {

        trainKMeans()
            .then(resolve)
            .catch(reject);
    });
};

const trainKMeans = () => {

    return new Promise((resolve, reject) => {

        const data = [
            {'company': 'Microsoft' , 'size': 91259, 'revenue': 60420},
            {'company': 'IBM' , 'size': 400000, 'revenue': 98787},
            {'company': 'Skype' , 'size': 700, 'revenue': 716},
            {'company': 'SAP' , 'size': 48000, 'revenue': 11567},
            {'company': 'Yahoo!' , 'size': 14000 , 'revenue': 6426 },
            {'company': 'eBay' , 'size': 15000, 'revenue': 8700},
        ];

        // Create the data 2D-array (vectors) describing the data
        let vectors = new Array();
        for (let i = 0 ; i < data.length ; i++) {
            vectors[i] = [ data[i]['size'] , data[i]['revenue']];
        }

        Kmeans.clusterize(vectors, {k: 4}, (err,res) => {

            if (err) {
                console.error(err);
            } else {
                console.log('hihi: %o',res);
                resolve(res);
            }
        });
    });
};

module.exports = { start };
