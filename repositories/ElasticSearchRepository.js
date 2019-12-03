const ElasticAdvancedSearchRepository = require('./ElasticAdvancedSearchRepository')
const ElasticSearchArticlesRepository = require('./ElasticSearchArticlesRepository')
const ElasticSearchAuthorsRepository = require('./ElasticSearchAuthorsRepository')
const ElasticSearchJournalistsRepository = require('./ElasticSearchJournalistsRepository')
const ElasticSearchNewspaperRepository = require('./ElasticSearchNewspaperRepository')
const ElasticSearchDebatesRepository = require('./ElasticSearchDebatesRepository')
const ElasticSearchFiguresRepository = require('./ElasticSearchFiguresRepository')
const Articlecontent = require('../models/index').Articlecontent
const Newspaperarticle = require('../models/index').Newspaperarticle
const Newspaper = require('../models/index').Newspaper
const Category = require('../models/index').Category
const Author = require('../models/index').Author
const Journalist = require('../models/index').Journalist
const Mediacategory = require('../models/index').Mediacategory
const Mediaresource = require('../models/index').Mediaresource
const Episode = require('../models/index').Episode
const Opus = require('../models/index').Opus
const Scenerio = require('../models/index').Scenerio
const Event = require('../models/index').Event
var limit = require('../config/limit')
const {
    Client
} = require('@elastic/elasticsearch')
const esPort = require('../config/es-port')
const client = new Client({
    node: 'http://localhost:' + esPort
})
const {
    map
} = require('p-iteration');
var moment = require('moment');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const fs = require('fs')


class ElasticSearchRepository {

    // async putNewEvent(id, indexName) {

    //     var ev = await Event.findOne({ where: { id } });

    //     // console.log(a);
    //     // return
    //     if (ev) {

    //         ev.dataValues.catalog = await ev.getCatalog({ attributes: ["id", "name", "alias"] })
    //         ev.dataValues.regions = await ev.getRegions({ attributes: ["id", "name", "alias"] })
    //         ev.dataValues.cities = await ev.getCities({ attributes: ["id", "name", "alias"] })
    //         ev.dataValues.attractions = await ev.getAttractions({ attributes: ["id", "name", "alias"] })
    //         ev.dataValues.themes = await ev.getThemes({ attributes: ["id", "name"] })
    //         ev.dataValues.ages = await ev.getAges({ attributes: ["id", "from", "to"] })
    //         ev.dataValues.days = await ev.getDays({
    //             attributes: ["id", daysNumber],
    //             order: [[
    //                 'daysNumber', 'asc'
    //             ]]
    //         })
    //         var daysBorder = ElasticSearchRepository.findMinAndMaxDays(ev.dataValues.days)
    //         var priceConfig = JSON.parse(ev.priceConfig)



    //         var nevent = {
    //             eid: ev.id,
    //             catalogId: (ev.dataValues.catalog) ? ev.dataValues.catalog.id : 0,
    //             catalogName: (ev.dataValues.catalog) ? ev.dataValues.catalog.name : '',
    //             link: (ev.dataValues.catalog) ? ev.dataValues.catalog.alias + '/' + ev.alias : (ev.alias) ? ev.alias : '',
    //             name: ev.name,
    //             alais: ev.alias,
    //             number: ev.number,
    //             image: ev.image,
    //             startAt: (ev.startAt) ? ev.startAt : moment(new Date()).format('YYYY-MM-DD'),
    //             endAt: (ev.endAt) ? ev.endAt : moment(new Date()).format('YYYY-MM-DD'),
    //             eventType: ev.eventType,
    //             eventSezonType: ev.eventSezonType,
    //             smallDesc: ev.smallDesc,
    //             longDesc: ev.longDesc,
    //             status: ev.status,
    //             daysMin: daysBorder.min,
    //             daysMax: daysBorder.max,
    //             microGallery: ev.microGallery,
    //             content: ElasticSearchRepository.mergeEventContent(ev.smallDesc, ev.longDesc),
    //             days: ev.dataValues.days.map(r => { return { id: r.id, daysNumber: r.daysNumber } }),
    //             regions: ev.dataValues.regions.map(r => { return { id: r.id, name: r.name, alias: r.alias } }),
    //             cities: ev.dataValues.cities.map(r => { return { id: r.id, name: r.name, alias: r.alias } }),
    //             attractions: ev.dataValues.attractions.map(r => { return { id: r.id, name: r.name, alias: r.alias } }),
    //             themes: ev.dataValues.themes.map(r => { return { id: r.id, name: r.name } }),
    //             ages: ev.dataValues.ages.map(r => { return { id: r.id, from: r.from, to: r.to } }),
    //             priceConfig: priceConfig,
    //             priceBrutto: parseFloat(ev.priceBrutto)
    //         }

    //         // console.log(nevent)


    //         return await client.index({
    //             method: 'PUT',
    //             index: indexName,
    //             type: '_doc',
    //             id: ev.id,
    //             body: nevent
    //         })

    //     } else {
    //         return { error: 'event_not_found' }
    //     }
    // }

    // async updateEvent(id, indexName) {

    //     var ev = await Event.findOne({ where: { id } });

    //     // console.log(a);
    //     // return
    //     if (ev) {

    //         ev.dataValues.catalog = await ev.getCatalog({ attributes: ["id", "name", "alias"] })
    //         ev.dataValues.regions = await ev.getRegions({ attributes: ["id", "name", "alias"] })
    //         ev.dataValues.cities = await ev.getCities({ attributes: ["id", "name", "alias"] })
    //         ev.dataValues.attractions = await ev.getAttractions({ attributes: ["id", "name", "alias"] })
    //         ev.dataValues.themes = await ev.getThemes({ attributes: ["id", "name"] })
    //         ev.dataValues.ages = await ev.getAges({ attributes: ["id", "from", "to"] })
    //         ev.dataValues.days = await ev.getDays({
    //             attributes: ["id", daysNumber],
    //             order: [[
    //                 'daysNumber', 'asc'
    //             ]]
    //         })
    //         var daysBorder = ElasticSearchRepository.findMinAndMaxDays(ev.dataValues.days)
    //         var priceConfig = JSON.parse(ev.priceConfig)


    //         var nevent = {
    //             eid: ev.id,
    //             catalogId: (ev.dataValues.catalog) ? ev.dataValues.catalog.id : 0,
    //             catalogName: (ev.dataValues.catalog) ? ev.dataValues.catalog.name : '',
    //             link: (ev.dataValues.catalog) ? ev.dataValues.catalog.alias + '/' + ev.alias : (ev.alias) ? ev.alias : '',
    //             name: ev.name,
    //             alais: ev.alias,
    //             number: ev.number,
    //             image: ev.image,
    //             startAt: (ev.startAt) ? ev.startAt : moment(new Date()).format('YYYY-MM-DD'),
    //             endAt: (ev.endAt) ? ev.endAt : moment(new Date()).format('YYYY-MM-DD'),
    //             eventType: ev.eventType,
    //             eventSezonType: ev.eventSezonType,
    //             smallDesc: ev.smallDesc,
    //             longDesc: ev.longDesc,
    //             status: ev.status,
    //             daysMin: daysBorder.min,
    //             daysMax: daysBorder.max,
    //             microGallery: ev.microGallery,
    //             content: ElasticSearchRepository.mergeEventContent(ev.smallDesc, ev.longDesc),
    //             days: ev.dataValues.days.map(r => { return { id: r.id, daysNumber: r.daysNumber } }),
    //             regions: ev.dataValues.regions.map(r => { return { id: r.id, name: r.name, alias: r.alias } }),
    //             cities: ev.dataValues.cities.map(r => { return { id: r.id, name: r.name, alias: r.alias } }),
    //             attractions: ev.dataValues.attractions.map(r => { return { id: r.id, name: r.name, alias: r.alias } }),
    //             themes: ev.dataValues.themes.map(r => { return { id: r.id, name: r.name } }),
    //             ages: ev.dataValues.ages.map(r => { return { id: r.id, from: r.from, to: r.to } }),
    //             priceConfig: priceConfig,
    //             priceBrutto: parseFloat(ev.priceBrutto)
    //         }

    //         // console.log(nevent)


    //         return await client.update({
    //             method: 'POST',
    //             index: indexName,
    //             type: '_doc',
    //             id,
    //             body: nevent
    //         })

    //     } else {
    //         return { error: 'event_not_found' }
    //     }

    // }


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



    // async getAllArticles(from, size) {

    //     await client.indices.refresh({ index: 'emancypantki' })
    //     const { body } = await client.search({
    //         index: 'emancypantki',
    //         body: {
    //             from,
    //             size,
    //             query: {
    //                 match_all: {}
    //             }
    //         }
    //     })

    //     return body

    // }

    // async searchArticles(phrase, from, size) {

    //     await client.indices.refresh({ index: 'emancypantki' })
    //     const { body } = await client.search({
    //         index: 'emancypantki',
    //         body: {
    //             from,
    //             size,
    //             query: {
    //                 match_phrase_prefix: { content: phrase }
    //             },
    //             highlight: {
    //                 fields: {
    //                     content: { "pre_tags": ["<b>"], "post_tags": ["</b>"] }
    //                 }
    //             }
    //         }
    //     })

    //     return body

    // }

    // async getEventByIndexId(id) {

    //     await client.indices.refresh({ index: 'wirtur' })
    //     const { body } = await client.get({
    //         index: 'wirtur',
    //         type: '_doc',
    //         id,

    //     })

    //     return body

    // }



    async indexContentArts(indexName, fromTo) {
        return await ElasticSearchArticlesRepository.indexContentArticles(indexName, fromTo)
    }

    async indexNewsArts(indexName, fromTo) {
        return await ElasticSearchArticlesRepository.indexNewsArticles(indexName, fromTo)
    }

    async indexAuthors(indexName, fromTo) {
        return await ElasticSearchAuthorsRepository.indexData(indexName, fromTo)
    }

    async indexJournalists(indexName, fromTo) {
        return await ElasticSearchJournalistsRepository.indexData(indexName, fromTo)
    }


    async indexNewspapers(indexName, fromTo) {
        return await ElasticSearchNewspaperRepository.indexData(indexName, fromTo)
    }

    async indexDebates(indexName, fromTo) {
        return await ElasticSearchDebatesRepository.indexData(indexName, fromTo)
    }

    async indexFigures(indexName, fromTo) {
        return await ElasticSearchFiguresRepository.indexData(indexName, fromTo)
    }



    // async indexSkipTakeArticles(indexName, offset, limit) {
    //     var arts = await this.prepareSkipTakeEventsForIndex(offset, limit)

    //     await map(arts, async (a, i) => {
    //         await client.index({
    //             method: 'PUT',
    //             index: indexName,
    //             type: '_doc',
    //             id: a.aid,
    //             body: a
    //         })
    //     })
    // }



    // async prepareSkipTakeEventsForIndex(offset, limit) {

    //     var evnsData = [];

    //     var evns = await Article.findAll({
    //         where: {

    //         },
    //         offset: offset,
    //         limit: limit
    //     })

    //     await map(evns, async (ev, i) => {

    //         ev.dataValues.catalog = await ev.getCatalog({ attributes: ["id", "name", "alias"] })
    //         ev.dataValues.regions = await ev.getRegions({ attributes: ["id", "name", "alias"] })
    //         ev.dataValues.cities = await ev.getCities({ attributes: ["id", "name", "alias"] })
    //         ev.dataValues.attractions = await ev.getAttractions({ attributes: ["id", "name", "alias"] })
    //         ev.dataValues.themes = await ev.getThemes({ attributes: ["id", "name"] })
    //         ev.dataValues.ages = await ev.getAges({ attributes: ["id", "from", "to"] })
    //         ev.dataValues.days = await ev.getDays({
    //             attributes: ["id", daysNumber],
    //             order: [[
    //                 'daysNumber', 'asc'
    //             ]]
    //         })
    //         var daysBorder = ElasticSearchRepository.findMinAndMaxDays(ev.dataValues.days)
    //         var priceConfig = JSON.parse(ev.priceConfig)

    //         var nevent = {
    //             eid: ev.id,
    //             catalogId: (ev.dataValues.catalog) ? ev.dataValues.catalog.id : 0,
    //             catalogName: (ev.dataValues.catalog) ? ev.dataValues.catalog.name : '',
    //             link: (ev.dataValues.catalog) ? ev.dataValues.catalog.alias + '/' + ev.alias : (ev.alias) ? ev.alias : '',
    //             name: ev.name,
    //             alais: ev.alias,
    //             number: ev.number,
    //             image: ev.image,
    //             startAt: (ev.startAt) ? ev.startAt : moment(new Date()).format('YYYY-MM-DD'),
    //             endAt: (ev.endAt) ? ev.endAt : moment(new Date()).format('YYYY-MM-DD'),
    //             eventType: ev.eventType,
    //             eventSezonType: ev.eventSezonType,
    //             smallDesc: ev.smallDesc,
    //             longDesc: ev.longDesc,
    //             status: ev.status,
    //             daysMin: daysBorder.min,
    //             daysMax: daysBorder.max,
    //             microGallery: ev.microGallery,
    //             content: ElasticSearchRepository.mergeEventContent(ev.smallDesc, ev.longDesc),
    //             days: ev.dataValues.days.map(r => { return { id: r.id, daysNumber: r.daysNumber } }),
    //             regions: ev.dataValues.regions.map(r => { return { id: r.id, name: r.name, alias: r.alias } }),
    //             cities: ev.dataValues.cities.map(r => { return { id: r.id, name: r.name, alias: r.alias } }),
    //             attractions: ev.dataValues.attractions.map(r => { return { id: r.id, name: r.name, alias: r.alias } }),
    //             themes: ev.dataValues.themes.map(r => { return { id: r.id, name: r.name } }),
    //             ages: ev.dataValues.ages.map(r => { return { id: r.id, from: r.from, to: r.to } }),
    //             priceConfig: priceConfig,
    //             priceBrutto: parseFloat(ev.priceBrutto)
    //         }

    //         evnsData.push(nevent)

    //     })

    //     return evnsData;
    // }




}


module.exports = new ElasticSearchRepository()