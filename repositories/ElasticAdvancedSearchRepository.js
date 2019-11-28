const Event = require('../models/index').Event
const Catalog = require('../models/index').Catalog
const Region = require('../models/index').Region
const City = require('../models/index').City
const Attraction = require('../models/index').Attraction
const Theme = require('../models/index').Theme
const Age = require('../models/index').Age
const { Client } = require('@elastic/elasticsearch')
const esPort = require('../config/es-port')
const client = new Client({ node: 'http://localhost:' + esPort })
const {
    map
} = require('p-iteration');
var moment = require('moment');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

class ElasticAdvancedSearchRepository {

    async findEvents(query, indexName, size, from) {

        var boolParams = ElasticAdvancedSearchRepository.prepareBoolObject(query)

        if (query.catalog && query.catalog != '') {
            boolParams.push({
                term: {
                    catalogId: query.catalog
                }
            })
        }

        // boolParams.push({
        //     bool:{
        //         should: [{
        //             range: {
        //                 startAt: {
        //                     "gte": "01-01-2020",
        //                     "format": "dd-MM-yyyy"
        //                 }
        //             }
        //         }]
        //     }
        // })
        // daysTotal

        // if (query.days != 'all') {

        //     if (query.days.indexOf(':') !== -1) {

        //         var daysArray = query.days.split(':')
        //         // console.log(daysArray)
        //         boolParams.push({
        //             range: {
        //                 daysTotal: {
        //                     "gte": parseInt(daysArray[0]),
        //                     "lte": parseInt(daysArray[1]),
        //                     // "boost": 2.0
        //                 }
        //             }
        //         })
        //     } else {
        //         boolParams.push({
        //             range: {
        //                 daysTotal: {
        //                     "gte": parseInt(query.days)
        //                 }
        //             }
        //         })
        //     }


        // }

        if (query.type != 'all') {
            if (query.type == 'template') {
                boolParams.push({
                    term: {
                        eventType: query.type
                    }
                })
            } else {
                boolParams.push({
                    term: {
                        eventSezonType: query.type
                    }
                })
            }

        }

        var sort = {};
        if (query.order && query.order != 'default') {
            sort[query.order] = { order: "desc" }
        }

        await client.indices.refresh({ index: indexName })

        const { body } = await client.search({
            index: indexName,
            body: {
                from,
                size,
                query: {
                    bool: {
                        // should: [{
                        //     range: {
                        //         startAt: {
                        //             "gte": "06-12-2019",
                        //             "format": "dd-MM-yyyy"
                        //         }
                        //     },

                        // },
                        // {
                        //     "term": {
                        //         "eventType": 'template'
                        //     }
                        // }
                        // ],
                        must: boolParams
                    }

                },
                "sort": [
                    sort
                ]
            }
        })

        return body

    }

    static prepareBoolObject(query) {

        var params = [

        ]


        if (query.regions && query.regions != '') {
            params.push(ElasticAdvancedSearchRepository.findBoolTemplate(query.regions, 'regions'))
        }

        if (query.cities && query.cities != '') {
            params.push(ElasticAdvancedSearchRepository.findBoolTemplate(query.cities, 'cities'))
        }

        if (query.attractions && query.attractions != '') {
            params.push(ElasticAdvancedSearchRepository.findBoolTemplate(query.attractions, 'attractions'))
        }

        if (query.themes && query.themes != '') {
            params.push(ElasticAdvancedSearchRepository.findBoolTemplate(query.themes, 'themes'))
        }

        if (query.ages && query.ages != '') {
            params.push(ElasticAdvancedSearchRepository.findBoolTemplate(query.ages, 'ages'))
        }

        if (query.days && query.days != '') {
            params.push(ElasticAdvancedSearchRepository.findBoolTemplate(query.days, 'days'))
        }

        // require('fs').writeFileSync(__dirname + '/res.json', JSON.stringify(query))

        return params;

    }

    static findBoolTemplate(paramsString, name) {
        var sh = {
            bool: {
                should: [

                ]
            }
        }
        var ids = paramsString.split(':')

        ids.forEach(id => {
            var term = {}
            term[`${name}.id`] = id;
            sh.bool.should.push({
                term
            })
        });

        return sh;
    }


    async findCatalogTypeEventsByAvl(type, catalogId, all, from, size, indexName) {


        var must = [
            {
                term: {
                    catalogId
                }
            },
            {
                term: {
                    eventSezonType: type
                }
            }
        ]


        if (!all) {
            var mDate = moment(new Date())
            // console.log(mDate.format('DD-MM-YYYY'))
            must.push({
                range: {
                    startAt: {
                        "gte": mDate.format('DD-MM-YYYY'),
                        "format": "dd-MM-yyyy"
                    }
                },
            })
        }

        await client.indices.refresh({ index: indexName })
        const { body } = await client.search({
            index: indexName,
            body: {
                from,
                size,
                query: {
                    bool: {
                        must
                    }
                },
                sort: [
                    { startAt: { order: 'desc' } }
                ]
            }
        })

        return body

    }




}

module.exports = new ElasticAdvancedSearchRepository()