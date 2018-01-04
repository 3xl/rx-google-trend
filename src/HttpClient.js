'use strict'

const Rx    = require('rx');
const qs    = require('querystring');
const https = require('https');

/**
 * 
 * 
 * @class HttpClient
 */
class HttpClient {
    /**
     * Creates an instance of HttpClient.
     * 
     * @public
     * 
     * @param {String} baseurl 
     * 
     * @memberof HttpClient
     */
    constructor(baseurl) {
        this.baseurl = baseurl;
    }
    
    /**
     * Execute http call
     * 
     * @public
     *
     * @param {String} segment
     * @param {Object} parameters
     * @param {Array} whitelist
     * 
     * @returns {Observable}
     * 
     * @memberof HttpClient
     */
    call(segment, parameters, whitelist = []) {
        const url = this._buildUrl(segment, parameters, whitelist);
        
        return Rx.Observable.create(obs => {
            https.get(url, resp => {
                let data = '';

                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    data += chunk;
                });

                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    obs.onNext(data);
                    obs.onCompleted();
                });

            }).on("error", err => {
                obs.onError(err.message);
            });
        })
        .flatMap(this._parseResponse);
    }

    /**
     * Create the correct url for the api call
     * 
     * @private
     * 
     * @param {String} segment 
     * @param {Object} parameters
     * @param {Array} whitelist
     * 
     * @returns {String}
     * 
     * @memberof HttpClient
     */
    _buildUrl(segment, parameters, whitelist = []) {
        let url = this.baseurl + segment + "?" + qs.stringify(parameters);

        if (whitelist.length > 0) {
            whitelist.forEach(rule => {
                url = url.replace(new RegExp(rule.key, 'gi'), rule.value);
            }, this);
        }

        return url;
    }

    /**
     * Parse response removing strange characters
     * 
     * @private
     * 
     * @param {Observable} response 
     * 
     * @returns {Observable}
     * 
     * @memberof HttpClient
     */
    _parseResponse(response) {
        return Rx.Observable.of(response)
            .map(response => response.split('\n'))
            .flatMap(Rx.Observable.from)
            .last()
            .map(JSON.parse);
    }
}

module.exports = HttpClient;