const ElasticAdvancedSearchRepository = require('./ElasticAdvancedSearchRepository')
const Event = require('../models/index').Event
const Catalog = require('../models/index').Catalog
const Region = require('../models/index').Region
const City = require('../models/index').City
const Attraction = require('../models/index').Attraction
const Theme = require('../models/index').Theme
const Age = require('../models/index').Age
var limit = require('../config/limit')
const { Client } = require('@elastic/elasticsearch')
const esPort = require('../config/es-port')
const client = new Client({ node: 'http://localhost:' + esPort })
const {
    map
} = require('p-iteration');
var moment = require('moment');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;


class ElasticSearchRepository {

    async putNewArticle(id, indexName) {

        var ev = await Event.findOne({ where: { id } });

        // console.log(a);
        // return
        if (ev) {

            ev.dataValues.catalog = await ev.getCatalog({ attributes: ["id", "name", "alias"] })
            ev.dataValues.regions = await ev.getRegions({ attributes: ["id", "name", "alias"] })
            ev.dataValues.cities = await ev.getCities({ attributes: ["id", "name", "alias"] })
            ev.dataValues.attractions = await ev.getAttractions({ attributes: ["id", "name", "alias"] })
            ev.dataValues.themes = await ev.getThemes({ attributes: ["id", "name"] })
            ev.dataValues.ages = await ev.getAges({ attributes: ["id", "from", "to"] })
            ev.dataValues.days = await ev.getDays({
                attributes: ["id", daysNumber],
                order: [[
                    'daysNumber', 'asc'
                ]]
            })
            var daysBorder = ElasticSearchRepository.findMinAndMaxDays(ev.dataValues.days)
            var priceConfig = JSON.parse(ev.priceConfig)



            var nevent = {
                eid: ev.id,
                catalogId: (ev.dataValues.catalog) ? ev.dataValues.catalog.id : 0,
                catalogName: (ev.dataValues.catalog) ? ev.dataValues.catalog.name : '',
                link: (ev.dataValues.catalog) ? ev.dataValues.catalog.alias + '/' + ev.alias : (ev.alias) ? ev.alias : '',
                name: ev.name,
                alais: ev.alias,
                number: ev.number,
                image: ev.image,
                startAt: (ev.startAt) ? ev.startAt : moment(new Date()).format('YYYY-MM-DD'),
                endAt: (ev.endAt) ? ev.endAt : moment(new Date()).format('YYYY-MM-DD'),
                eventType: ev.eventType,
                eventSezonType: ev.eventSezonType,
                smallDesc: ev.smallDesc,
                longDesc: ev.longDesc,
                status: ev.status,
                daysMin: daysBorder.min,
                daysMax: daysBorder.max,
                microGallery: ev.microGallery,
                content: ElasticSearchRepository.mergeEventContent(ev.smallDesc, ev.longDesc),
                days: ev.dataValues.days.map(r => { return { id: r.id, daysNumber: r.daysNumber } }),
                regions: ev.dataValues.regions.map(r => { return { id: r.id, name: r.name, alias: r.alias } }),
                cities: ev.dataValues.cities.map(r => { return { id: r.id, name: r.name, alias: r.alias } }),
                attractions: ev.dataValues.attractions.map(r => { return { id: r.id, name: r.name, alias: r.alias } }),
                themes: ev.dataValues.themes.map(r => { return { id: r.id, name: r.name } }),
                ages: ev.dataValues.ages.map(r => { return { id: r.id, from: r.from, to: r.to } }),
                priceConfig: priceConfig,
                priceBrutto: parseFloat(ev.priceBrutto)
            }

            // console.log(nevent)


            return await client.index({
                method: 'PUT',
                index: indexName,
                type: '_doc',
                id: ev.id,
                body: nevent
            })

        } else {
            return { error: 'event_not_found' }
        }
    }

    async updateArticle(id, indexName) {

        var ev = await Event.findOne({ where: { id } });

        // console.log(a);
        // return
        if (ev) {

            ev.dataValues.catalog = await ev.getCatalog({ attributes: ["id", "name", "alias"] })
            ev.dataValues.regions = await ev.getRegions({ attributes: ["id", "name", "alias"] })
            ev.dataValues.cities = await ev.getCities({ attributes: ["id", "name", "alias"] })
            ev.dataValues.attractions = await ev.getAttractions({ attributes: ["id", "name", "alias"] })
            ev.dataValues.themes = await ev.getThemes({ attributes: ["id", "name"] })
            ev.dataValues.ages = await ev.getAges({ attributes: ["id", "from", "to"] })
            ev.dataValues.days = await ev.getDays({
                attributes: ["id", daysNumber],
                order: [[
                    'daysNumber', 'asc'
                ]]
            })
            var daysBorder = ElasticSearchRepository.findMinAndMaxDays(ev.dataValues.days)
            var priceConfig = JSON.parse(ev.priceConfig)


            var nevent = {
                eid: ev.id,
                catalogId: (ev.dataValues.catalog) ? ev.dataValues.catalog.id : 0,
                catalogName: (ev.dataValues.catalog) ? ev.dataValues.catalog.name : '',
                link: (ev.dataValues.catalog) ? ev.dataValues.catalog.alias + '/' + ev.alias : (ev.alias) ? ev.alias : '',
                name: ev.name,
                alais: ev.alias,
                number: ev.number,
                image: ev.image,
                startAt: (ev.startAt) ? ev.startAt : moment(new Date()).format('YYYY-MM-DD'),
                endAt: (ev.endAt) ? ev.endAt : moment(new Date()).format('YYYY-MM-DD'),
                eventType: ev.eventType,
                eventSezonType: ev.eventSezonType,
                smallDesc: ev.smallDesc,
                longDesc: ev.longDesc,
                status: ev.status,
                daysMin: daysBorder.min,
                daysMax: daysBorder.max,
                microGallery: ev.microGallery,
                content: ElasticSearchRepository.mergeEventContent(ev.smallDesc, ev.longDesc),
                days: ev.dataValues.days.map(r => { return { id: r.id, daysNumber: r.daysNumber } }),
                regions: ev.dataValues.regions.map(r => { return { id: r.id, name: r.name, alias: r.alias } }),
                cities: ev.dataValues.cities.map(r => { return { id: r.id, name: r.name, alias: r.alias } }),
                attractions: ev.dataValues.attractions.map(r => { return { id: r.id, name: r.name, alias: r.alias } }),
                themes: ev.dataValues.themes.map(r => { return { id: r.id, name: r.name } }),
                ages: ev.dataValues.ages.map(r => { return { id: r.id, from: r.from, to: r.to } }),
                priceConfig: priceConfig,
                priceBrutto: parseFloat(ev.priceBrutto)
            }

            // console.log(nevent)


            return await client.update({
                method: 'POST',
                index: indexName,
                type: '_doc',
                id,
                body: nevent
            })

        } else {
            return { error: 'event_not_found' }
        }

    }


    // async searchEvents(query, indexName) {

    //     var from = 0;
    //     if (query.page && query.page != 1) {
    //         from = (query.page - 1) * limit.indexLimit
    //     }

    //     return await ElasticAdvancedSearchRepository.findEvents(query, indexName, limit.indexLimit, from)
    // }

    // async searchCatalogIndexByType(type, catalogId, all, from, size, indexName) {

    //     return await ElasticAdvancedSearchRepository.findCatalogTypeEventsByAvl(type, catalogId, all, from, size, indexName)

    // }


    async getArticleByIndexId(id) {

        await client.indices.refresh({ index: 'literacki' })
        const { body } = await client.get({
            index: 'literacki',
            type: '_doc',
            id,

        })

        return body

    }


    async deleteCreateIndexMapping(indexName) {

        var existsBool = await client.indices.exists({ index: indexName })

        if (existsBool.body) {
            await client.indices.delete({
                index: indexName
            })
        }

        await client.indices.create({
            index: indexName
        })



        return await client.indices.putMapping({
            index: indexName,
            //for FreeBSD only
            // type: '_doc',
            body: {
                properties: {
                    eid: { "type": "integer" },
                    catalogId: { "type": "integer" },
                    catalogName: { "type": "text" },
                    link: { "type": "text" },
                    name: { "type": "text" },
                    alias: { "type": "text" },
                    number: { "type": "text" },
                    image: { "type": "text" },
                    startAt: { "type": "date" },
                    endAt: { "type": "date" },
                    eventType: { "type": "text" },
                    eventSezonType: { "type": "text" },
                    daysTotal: { "type": "integer" },
                    smallDesc: { "type": "text" },
                    longDesc: { "type": "text" },
                    status: { "type": "text" },
                    microGallery: { "type": "text" },
                    daysMin: { "type": "integer" },
                    daysMax: { "type": "integer" },
                    content: {
                        type: "text",
                        "analyzer": "polish"
                    },
                    days: {
                        properties: {
                            id: { "type": "integer" },
                            daysNumber: { "type": "integer" },
                        }
                    },
                    regions: {
                        properties: {
                            id: { "type": "integer" },
                            name: { "type": "text" },
                            alias: { "type": "text" }
                        }
                    },
                    cities: {
                        properties: {
                            id: { "type": "integer" },
                            name: { "type": "text" },
                            alias: { "type": "text" }
                        }
                    },
                    attractions: {
                        properties: {
                            id: { "type": "integer" },
                            name: { "type": "text" },
                            alias: { "type": "text" }
                        }
                    },
                    themes: {
                        properties: {
                            id: { "type": "integer" },
                            name: { "type": "text" }
                        }
                    },
                    ages: {
                        properties: {
                            id: { "type": "integer" },
                            from: { "type": "integer" },
                            to: { "type": "integer" }
                        }
                    },
                    priceConfig: {
                        properties: {
                            price: { "type": "double" },
                            from: { "type": "integer" },
                            to: { "type": "integer" },
                            days: { "type": "integer" }
                        }
                    },
                    priceBrutto: { "type": "double" }
                }
            }
        })
    }


    async indexAllArticles(indexName) {

        var events = await this.prepareAllEventsForIndex()

        await map(events, async (ev, i) => {
            await client.index({
                method: 'PUT',
                index: indexName,
                type: '_doc',
                id: ev.eid,
                body: ev
            })
        })
    }


    async indexSkipTakeArticles(indexName, offset, limit) {
        var arts = await this.prepareSkipTakeEventsForIndex(offset, limit)

        await map(arts, async (a, i) => {
            await client.index({
                method: 'PUT',
                index: indexName,
                type: '_doc',
                id: a.aid,
                body: a
            })
        })
    }

    async prepareAllArticlesForIndex() {

        var evnsData = [];

        var evns = await Event.findAll({
            where: {

            }
        })


        await map(evns, async (ev, i) => {

            ev.dataValues.catalog = await ev.getCatalog({ attributes: ["id", "name", "alias"] })
            ev.dataValues.regions = await ev.getRegions({ attributes: ["id", "name", "alias"] })
            ev.dataValues.cities = await ev.getCities({ attributes: ["id", "name", "alias"] })
            ev.dataValues.attractions = await ev.getAttractions({ attributes: ["id", "name", "alias"] })
            ev.dataValues.themes = await ev.getThemes({ attributes: ["id", "name"] })
            ev.dataValues.ages = await ev.getAges({ attributes: ["id", "from", "to"] })
            ev.dataValues.days = await ev.getDays({
                attributes: ["id", 'daysNumber'],
                order: [[
                    'daysNumber', 'asc'
                ]]
            })
            var daysBorder = ElasticSearchRepository.findMinAndMaxDays(ev.dataValues.days)
            var priceConfig = JSON.parse(ev.priceConfig)

            var nevent = {
                eid: ev.id,
                catalogId: (ev.dataValues.catalog) ? ev.dataValues.catalog.id : 0,
                catalogName: (ev.dataValues.catalog) ? ev.dataValues.catalog.name : '',
                link: (ev.dataValues.catalog) ? ev.dataValues.catalog.alias + '/' + ev.alias : (ev.alias) ? ev.alias : '',
                name: ev.name,
                alais: ev.alias,
                number: ev.number,
                image: ev.image,
                startAt: (ev.startAt) ? ev.startAt : moment(new Date()).format('YYYY-MM-DD'),
                endAt: (ev.endAt) ? ev.endAt : moment(new Date()).format('YYYY-MM-DD'),
                eventType: ev.eventType,
                eventSezonType: ev.eventSezonType,
                smallDesc: ev.smallDesc,
                longDesc: ev.longDesc,
                status: ev.status,
                microGallery: ev.microGallery,
                daysMin: daysBorder.min,
                daysMax: daysBorder.max,
                content: ElasticSearchRepository.mergeEventContent(ev.smallDesc, ev.longDesc),
                days: ev.dataValues.days.map(r => { return { id: r.id, daysNumber: r.daysNumber } }),
                regions: ev.dataValues.regions.map(r => { return { id: r.id, name: r.name, alias: r.alias } }),
                cities: ev.dataValues.cities.map(r => { return { id: r.id, name: r.name, alias: r.alias } }),
                attractions: ev.dataValues.attractions.map(r => { return { id: r.id, name: r.name, alias: r.alias } }),
                themes: ev.dataValues.themes.map(r => { return { id: r.id, name: r.name } }),
                ages: ev.dataValues.ages.map(r => { return { id: r.id, from: r.from, to: r.to } }),
                priceConfig: priceConfig,
                priceBrutto: parseFloat(ev.priceBrutto)
            }

            evnsData.push(nevent)

        })

        return evnsData;
    }


    async prepareSkipTakeArticlesForIndex(offset, limit) {

        var evnsData = [];

        var evns = await Article.findAll({
            where: {

            },
            offset: offset,
            limit: limit
        })

        await map(evns, async (ev, i) => {

            ev.dataValues.catalog = await ev.getCatalog({ attributes: ["id", "name", "alias"] })
            ev.dataValues.regions = await ev.getRegions({ attributes: ["id", "name", "alias"] })
            ev.dataValues.cities = await ev.getCities({ attributes: ["id", "name", "alias"] })
            ev.dataValues.attractions = await ev.getAttractions({ attributes: ["id", "name", "alias"] })
            ev.dataValues.themes = await ev.getThemes({ attributes: ["id", "name"] })
            ev.dataValues.ages = await ev.getAges({ attributes: ["id", "from", "to"] })
            ev.dataValues.days = await ev.getDays({
                attributes: ["id", daysNumber],
                order: [[
                    'daysNumber', 'asc'
                ]]
            })

            var priceConfig = JSON.parse(ev.priceConfig)

            var nevent = {
                eid: ev.id,
                catalogId: (ev.dataValues.catalog) ? ev.dataValues.catalog.id : 0,
                catalogName: (ev.dataValues.catalog) ? ev.dataValues.catalog.name : '',
                link: (ev.dataValues.catalog) ? ev.dataValues.catalog.alias + '/' + ev.alias : (ev.alias) ? ev.alias : '',
                name: ev.name,
                alais: ev.alias,
                number: ev.number,
                image: ev.image,
                startAt: (ev.startAt) ? ev.startAt : moment(new Date()).format('YYYY-MM-DD'),
                endAt: (ev.endAt) ? ev.endAt : moment(new Date()).format('YYYY-MM-DD'),
                eventType: ev.eventType,
                eventSezonType: ev.eventSezonType,
                smallDesc: ev.smallDesc,
                longDesc: ev.longDesc,
                status: ev.status,
                daysMin: daysBorder.min,
                daysMax: daysBorder.max,
                microGallery: ev.microGallery,
                content: ElasticSearchRepository.mergeEventContent(ev.smallDesc, ev.longDesc),
                days: ev.dataValues.days.map(r => { return { id: r.id, daysNumber: r.daysNumber } }),
                regions: ev.dataValues.regions.map(r => { return { id: r.id, name: r.name, alias: r.alias } }),
                cities: ev.dataValues.cities.map(r => { return { id: r.id, name: r.name, alias: r.alias } }),
                attractions: ev.dataValues.attractions.map(r => { return { id: r.id, name: r.name, alias: r.alias } }),
                themes: ev.dataValues.themes.map(r => { return { id: r.id, name: r.name } }),
                ages: ev.dataValues.ages.map(r => { return { id: r.id, from: r.from, to: r.to } }),
                priceConfig: priceConfig,
                priceBrutto: parseFloat(ev.priceBrutto)
            }

            evnsData.push(nevent)

        })

        return evnsData;
    }


    static mergeArticleContent(intro, content) {
        var str = '';

        if (intro) {
            str += intro.replace(/(<([^>]+)>)/ig, "");
        }
        if (content) {
            str += ' ' + content.replace(/(<([^>]+)>)/ig, "");
        }

        return str
    }


}


module.exports = new ElasticSearchRepository()
