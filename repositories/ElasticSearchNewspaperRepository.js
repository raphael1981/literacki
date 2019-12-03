const ElasticAdvancedSearchRepository = require('./ElasticAdvancedSearchRepository')
const ElasticSearchHelper = require('../helpers/elastic-search-helper')
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
const Debate = require('../models/index').Debate
const Figure = require('../models/index').Figure
const esindex = require('../es-models/index')
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


class ElasticSearchNewspaperRepository {

    async indexData(indexName, fromTo) {

        var responses = []

        var articles = await this.prepareForIndex(fromTo)

        await client.indices.putSettings({
            body: {
                "index.blocks.read_only_allow_delete": null
            }
        })

        await map(articles, async (el, i) => {
            try {
                responses.push(await client.index({
                    method: 'PUT',
                    index: indexName,
                    type: '_doc',
                    id: el.npid,
                    body: el
                }))
            } catch (error) {
                console.log(error)
            }

        })

        return responses;

    }



    async prepareForIndex(fromTo) {

        var dataIndex = [];

        if (fromTo) {
            var elements = await Newspaper.findAll(fromTo)
        } else {
            var elements = await Newspaper.findAll()
        }



        await map(elements, async (el, i) => {


            var newspaperArticlesAttrs = ['id', 'title', 'alias', 'image', 'smallDesc', 'longDesc']
            el.dataValues.newspaperArticles = await el.getNewspaperarticles({
                attributes: newspaperArticlesAttrs
            })
            var debatesAttrs = ['id', 'title', 'alias', 'image', 'smallDesc', 'longDesc', 'publishedAt']
            el.dataValues.debates = await el.getDebates({
                attributes: debatesAttrs
            })
            var figuresAttrs = ['id', 'title', 'alias', 'image', 'smallDesc', 'longDesc', 'figureType', 'publishedAt']
            el.dataValues.figures = await el.getFigures({
                attributes: figuresAttrs
            })
            var categoriesAttrs = ['id', 'name', 'alias', 'path', 'categoryViewType', 'intro']
            el.dataValues.categories = await el.getCategories({
                attributes: categoriesAttrs
            })


            var iel = {
                npid: el.id,
                title: el.title,
                alias: el.alias,
                image: el.image,
                number: el.number,
                metaDescription: el.metaDescription,
                metaKeywords: el.metaKeywords,
                releaseDate: el.releaseDate,
                publishedAt: el.publishedAt,
                categories: ElasticSearchHelper.makeDataFromMap(categoriesAttrs, el.dataValues.categories),
                newspaperArticles: ElasticSearchHelper.makeDataFromMap(newspaperArticlesAttrs, el.dataValues.newspaperArticles),
                debates: ElasticSearchHelper.makeDataFromMap(debatesAttrs, el.dataValues.debates),
                figures: ElasticSearchHelper.makeDataFromMap(figuresAttrs, el.dataValues.figures)
            }


            dataIndex.push(iel)

        })

        return dataIndex
    }

    async findLastNewspapers(limit) {

    }

}

module.exports = new ElasticSearchNewspaperRepository()
