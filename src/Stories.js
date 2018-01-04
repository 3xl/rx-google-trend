'use strict';

const HttpClient = require('./HttpClient.js');

/**
 * 
 * 
 * @class Stories
 */
class Stories extends HttpClient {

    /**
     * Creates an instance of Stories.
     * 
     * @memberof Stories
     */
    constructor() {
        super('https://trends.google.com/trends/api/stories/');
    }

    /**
     * Get single story
     * 
     * @public
     * 
     * @param {String} id 
     * @param {String} language 
     * 
     * @return {Observable}
     * 
     * @memberof Stories
     */
    one(id, language) {
        let parameters = {
            // custom parameters,
            hl: language,

            // default parameters
            tz: -120, sw: 10
        };

        return this.call('' + id, parameters);
    }

    /**
     * Get the latest stories published on Google Trends
     * 
     * @public
     * 
     * @param {String} category 
     * @param {String} language 
     * @param {String} country 
     * 
     * @return {Observable}
     * 
     * @memberof Stories
     */
    latest(category, language, country) {
        let parameters = {
            // custom parameters
            cat: category,
            hl: language,
            geo: country,

            // default parameters
            tz: -120, fi: 15, fs: 15, ri: 300, rs: 15, sort: 0
        };

        return this.call('latest', parameters);
    }
}

module.exports = Stories;