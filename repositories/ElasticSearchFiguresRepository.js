const ElasticAdvancedSearchRepository = require('./ElasticAdvancedSearchRepository')
const ElasticSearchHelper = require('../helpers/elastic-search-helper')
const EsQueryFigureRepository = require('./es/EsQueryFigureRepository')
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


class ElasticSearchFiguresRepository {

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
                    id: el.fid,
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
            var elements = await Figure.findAll(fromTo)
        } else {
            var elements = await Figure.findAll()
        }



        await map(elements, async (el, i) => {


            var newspaperArticlesAttrs = ['id', 'title', 'alias', 'image', 'smallDesc', 'longDesc']
            el.dataValues.newspaperArticles = await el.getNewspaperarticles({
                attributes: newspaperArticlesAttrs
            })
            el.dataValues.newspaperArticles = await this.addJournalistToCollectionNewspaperArticle(el.dataValues.newspaperArticles)
            newspaperArticlesAttrs = ['id', 'title', 'alias', 'image', 'smallDesc', 'longDesc', 'journalists']

            var authorsAttrs = ["id", "name", "surname", "alias", "bornDate", "deathDate", "image", "bio"]
            var au = await el.getAuthor({
                attributes: authorsAttrs
            })
            if (au) {
                el.dataValues.authors = [au]
            } else {
                el.dataValues.authors = []
            }

            var journalistsAttrs = ["id", "name", "surname", "alias", "image", "bio"]
            var jr = await el.getJournalist({
                attributes: journalistsAttrs
            })
            if (jr) {
                el.dataValues.journalists = [jr]
            } else {
                el.dataValues.journalists = []
            }


            var iel = {
                fid: el.id,
                title: el.title,
                alias: el.alias,
                image: el.image,
                smallDesc: el.smallDesc,
                longDesc: el.longDesc,
                figureType: el.figureType,
                releaseDate: el.releaseDate,
                publishedAt: el.releaseDate,
                metaDescription: el.metaDescription,
                metaKeywords: el.metaKeywords,
                publishedAt: el.publishedAt,
                newspaperArticles: ElasticSearchHelper.makeDataFromMap(newspaperArticlesAttrs, el.dataValues.newspaperArticles),
                authors: ElasticSearchHelper.makeDataFromMap(authorsAttrs, el.dataValues.authors),
                journalists: ElasticSearchHelper.makeDataFromMap(journalistsAttrs, el.dataValues.journalists)
            }


            dataIndex.push(iel)

        })

        return dataIndex
    }


    async addJournalistToCollectionNewspaperArticle(collection) {
        await map(collection, async (c, i) => {
            var a = await Newspaperarticle.findOne({ where: { id: c.id } })
            var j = await a.getJournalist(
                {
                    attributes: ["id", "name", "surname", "alias", "image"]
                }
            )
            collection[i].journalists = []
            collection[i].journalists.push(j.dataValues)
        })
        return collection
    }


    async findCurrentFigure() {
        var newspaper = await esindex.EsNewspaper.findLastNewspaper()
        if (newspaper.figures.length > 0) {
            return esindex.EsFigure.findFigureFirst(newspaper.figures[0].id)
        } else {
            return null;
        }
    }

}

module.exports = new ElasticSearchFiguresRepository()
