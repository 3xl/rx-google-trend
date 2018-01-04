'use strict';

const HttpClient = require('./HttpClient.js');
const moment     = require('moment');
const Rx         = require('rx');

/**
 * 
 * 
 * @class Widgetdata
 */
class Widgetdata extends HttpClient {

    /**
     * Creates an instance of Widgetdata.
     * 
     * @memberof Widgetdata
     */
    constructor() {
        super('https://trends.google.com/trends/api/widgetdata/');
    }

    /**
     * Get keyword trend for the specified country. If not specified it analyzes the whole world
     * 
     * @public
     *
     * @param {String} keyword
     * @param {Object} config
     * @param {String} config.geo
     * @param {Object} config.time
     * @param {String} config.time.min
     * @param {String} config.time.max
     * @param {String} config.language
     * @param {String} token 
     * 
     * @returns {Observable}
     * 
     * @memberof Widgetdata
     */
    relatedsearches(keyword, config, token) {
        const minCompareTime = moment(config.time.min).subtract(1, 'years').format('Y-MM-DD');
        const maxCompareTime = moment(config.time.min).subtract(1, 'days').format('Y-MM-DD');

        const geo = config.geo != '' ? { country: config.geo } : {};

        const req = {
            restriction: {
                geo: geo,
                time: `${config.time.min}+${config.time.max}`,
                complexKeywordsRestriction: {
                    keyword: [
                        {
                            type: 'BROAD',
                            value: keyword
                        }
                    ]
                }
            },
            keywordType: 'QUERY',
            metric: ['TOP', 'RISING'],
            trendinessSettings: {
                compareTime: `${minCompareTime}+${maxCompareTime}`
            },
            requestOptions: {
                property: '',
                backend: 'IZG',
                category: config.category
            },
            language: config.language.split('-').shift()
        }

        const parameters = {
            // custom parameters,
            hl: config.language,
            req: JSON.stringify(req),

            // default parameters
            token: token,
            tz: -60
        };

        return this.call(
            'relatedsearches',
            parameters,
            [
                { key: '%2B', value: '+' },
                { key: '%3A', value: ':' },
                { key: '%2C', value: ',' }
            ]
        )
    }

    /**
     * Get keyword trend for the specified country. If not specified it analyzes the whole world
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
     * @param {String} token
     * 
     * @returns {Observable}
     * 
     * @memberof Widgetdata
     */
    comparedgeo(keywords, config, token) {
        // build comparisonItem property adding the time period for each query criteria
        let comparisonItem = [];

        keywords.forEach(keyword => {
            comparisonItem.push({
                time: `${config.time.min}+${config.time.max}`,
                complexKeywordsRestriction: {
                    keyword: [
                        {
                            type: "BROAD",
                            value: keyword
                        }
                    ]
                }
            });
        }, this)

        const geo = config.geo != '' ? { country: config.geo } : {};
        const resolution = Object.keys(geo).length == 0 ? 'COUNTRY' : 'REGION';

        const req = {
            geo: geo,
            comparisonItem: comparisonItem,
            resolution: resolution,
            locale: config.language,
            requestOptions: {
                property: '',
                backend: 'IZG',
                category: config.category
            }
        }

        const parameters = {
            // custom parameters,
            hl: config.language,
            req: JSON.stringify(req),

            // default parameters
            token: token,
            tz: -60
        };

        return this.call(
            'comparedgeo',
            parameters,
            [
                { key: '%2B', value: '+' },
                { key: '%3A', value: ':' },
                { key: '%2C', value: ',' }
            ]
        )
    }

    /**
     * Get keyword trend
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
     * @param {String} token 
     * 
     * @returns {Observable}
     * 
     * @memberof Widgetdata
     */
    multiline(keywords, config, token) {
        // build comparisonItem property adding the time period for each query criteria
        const geo = config.geo != '' ? { country: config.geo } : {};

        let comparisonItem = [];

        keywords.map(keyword => {
            comparisonItem.push({
                geo: geo,
                complexKeywordsRestriction: {
                    keyword: [
                        {
                            type: 'BROAD',
                            value: keyword
                        }
                    ]
                }
            });
        });

        // calc resolution
        const resolution = moment.duration(moment(config.time.max).diff(moment(config.time.min))).months() < 9 ? 'DAY' : 'WEEK';

        // build req property of the parameters object
        const req = {
            time: `${config.time.min}+${config.time.max}`,
            resolution: resolution,
            locale: config.language,
            comparisonItem: comparisonItem,
            requestOptions: {
                property: '',
                backend: 'IZG',
                category: config.category
            }
        }

        // build parameters argument
        const parameters = {
            // custom parameters,
            hl: config.language,
            req: JSON.stringify(req),
            token: token,

            // default parameters
            tz: [-60, -60]
        };

        return this.call(
            'multiline',
            parameters,
            [
                { key: '%2B', value: '+' },
                { key: '%3A', value: ':' },
                { key: '%2C', value: ',' }
            ]
        )
    }

    /**
     * Extract widget token by widget id
     * 
     * @public
     * 
     * @param {String} explore 
     * @param {String} id 
     * 
     * @returns {String}
     * 
     * @memberof Widgetdata
     */
    getWidgetToken(explore, id) {
        return explore.widgets
            .filter(widget => widget.id == id)
            .map(widget => widget.token)
            .pop()
    }
}

module.exports = Widgetdata;