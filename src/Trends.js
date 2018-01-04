'use strict';

const Rx         = require('rx');
const moment     = require('moment');
const Widgetdata = require('./Widgetdata.js');
const HttpClient = require('./HttpClient.js');

/**
 * 
 * 
 * @class Trends
 */
class Trends extends HttpClient {

    /**
     * Creates an instance of Trends.
     * 
     * @public
     *
     * @param {Object} config
     * @param {String} config.geo
     * @param {Object} config.time
     * @param {String} config.time.min
     * @param {String} config.time.max
     * @param {String} config.language
     * @param {Number} config.category
     * 
     * @memberof Trends
     */
    constructor(config = {}) {
        super('https://trends.google.com/trends/api/');

        this.widgetdata = new Widgetdata();

        // default config
        this.config = Object.assign({
                geo: '',
                time: {
                    min: moment().subtract(1, 'years').format('Y-MM-DD'),
                    max: moment().format('Y-MM-DD'),
                },
                language: 'en-US',
                category: 0
            },

            // override default config
            config
        );


    }

    /**
     * This method get all the info necessary for the 
     * 
     * @public
     * 
     * @param {String[]} keywords
     * @param {Object} config
     * @param {String} config.geo
     * @param {Object} config.time
     * @param {String} config.time.min
     * @param {String} config.time.max
     * @param {String} config.language
     * @param {Number} config.category
     * 
     * @returns {Observable}
     * 
     * @memberof Trends
     */
    explore(keywords, config = {}) {
        // override default config
        config = Object.assign(this.config, config);

        // build comparisonItem property adding the time period for each query criteria
        let comparisonItem = [];

        keywords.forEach(keyword => {
            comparisonItem.push({
                keyword: keyword,
                geo: config.geo,
                time: `${config.time.min}+${config.time.max}`
            });
        }, this);

        // build req property of the parameters object
        const req = { 
            comparisonItem: comparisonItem, 
            category: config.category, 
            property: '' 
        }

        return this.call(
            'explore', 
            {
                // custom parameters,
                hl: config.language,
                req: JSON.stringify(req),

                // default parameters
                tz: -60
            }, 
            [
                { key: '%2B', value: '+' },
                { key: '%3A', value: ':' },
                { key: '%2C', value: ',' }
            ]
        );
    }

    /**
     * Returns the list of countries
     * 
     * @public
     * 
     * @param {String} language 
     * 
     * @returns {Observable}
     * 
     * @memberof Trends
     */
    categories(language) {
        return this.call(
            'explore/pickers/category',
            {
                hl: language,
                tz: -60
            }
        );
    }

    /**
     * Returns the list of countries
     * 
     * @public
     * 
     * @param {String} language 
     * 
     * @returns {Observable}
     * 
     * @memberof Trends
     */
    countries(language) {
        return this.call(
            'explore/pickers/geo',
            {
                hl: language,
                tz: -60
            }
        );
    }

    /**
    * Get keyword trend
    * 
    * @public
    *
    * @param {String[]} keyords
    * @param {Object} config
    * @param {String} config.geo
    * @param {Object} config.time
    * @param {String} config.time.min
    * @param {String} config.time.max
    * @param {String} config.language
    * 
    * @returns {Observable}
    * 
    * @memberof Trends
    */
    multiline(keywords, config = {}) {
        // override default config
        config = Object.assign(this.config, config);

        return this.explore(keywords, config)
            .map(data => this.widgetdata.getWidgetToken(data, 'TIMESERIES'))
            .flatMap(token => this.widgetdata.multiline(keywords, config, token));
    }

    /**
     * Get keyword trend for the specified country. If not specified it analyzes the whole world
     *
     * @param {String[]} keywords
     * @param {Object} config
     * @param {String} config.geo
     * @param {Object} config.time
     * @param {String} config.time.min
     * @param {String} config.time.max
     * @param {String} config.language
     * 
     * @returns {Observable}
     * 
     * @memberof Trends
     */
    comparedgeo(keywords, config = {}) {
        // override default config
        config = Object.assign(this.config, config);

        return this.explore(keywords, config)
            .map(data => this.widgetdata.getWidgetToken(data, 'GEO_MAP'))
            .flatMap(token => this.widgetdata.comparedgeo(keywords, config, token));
    }

    /**
     * Get keyword trend related searches
     *
     * @param {String} keyword
     * @param {Object} config
     * @param {String} config.geo
     * @param {Object} config.time
     * @param {String} config.time.min
     * @param {String} config.time.max
     * @param {String} config.language
     * 
     * @returns {Observable}
     * 
     * @memberof Trends
     */
    relatedsearches(keyword, config = {}) {
        // override default config
        config = Object.assign(this.config, config);

        return this.explore([keyword], config)
            .map(data => this.widgetdata.getWidgetToken(data, 'RELATED_QUERIES'))
            .flatMap(token => this.widgetdata.relatedsearches(keyword, config, token))
    }
}

module.exports = Trends;