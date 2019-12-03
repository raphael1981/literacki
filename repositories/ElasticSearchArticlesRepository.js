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


class ElasticSearchArticlesRepository {

    async indexContentArticles(indexName, fromTo) {

        var responses = []

        var articles = await this.prepareAllArticleContentsForIndex(fromTo)

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
                    id: 'art_' + el.aid,
                    body: el
                }))
            } catch (error) {
                console.log(error)
            }

        })

        return responses;

    }

    async indexNewsArticles(indexName, fromTo) {

        var responses = []

        var naricles = await this.prepareAllNewspaperArticlesForIndex(fromTo)

        await client.indices.putSettings({
            body: {
                "index.blocks.read_only_allow_delete": null
            }
        })

        await map(naricles, async (el, i) => {
            try {
                responses.push(await client.index({
                    method: 'PUT',
                    index: indexName,
                    type: '_doc',
                    id: 'nart_' + el.aid,
                    body: el
                }))
            } catch (error) {
                console.log(error)
            }

        })

        return responses

    }


    async prepareAllArticleContentsForIndex(fromTo) {

        var dataIndex = [];

        if (fromTo) {
            var elements = await Articlecontent.findAll(fromTo)
        } else {
            var elements = await Articlecontent.findAll()
        }



        await map(elements, async (el, i) => {

            var authorsAttrs = ["id", "name", "surname", "alias", "bornDate", "deathDate", "image", "bio"]
            el.dataValues.authors = await el.getAuthors({
                attributes: authorsAttrs
            })
            var journalistsAttrs = ["id", "name", "surname", "alias", "image", "bio"]
            var jr = await el.getJournalist({
                attributes: journalistsAttrs
            })
            if (jr) {
                el.dataValues.journalists = [jr]
            } else {
                el.dataValues.journalists = []
            }


            var newspaperArticlesAttrs = ['id', 'title', 'alias', 'image', 'smallDesc', 'longDesc']
            el.dataValues.newspaperArticles = await el.getNewspaperarticles({
                attributes: newspaperArticlesAttrs
            })
            el.dataValues.newspaperArticles = await this.addJournalistToCollectionNewspaperArticle(el.dataValues.newspaperArticles)
            newspaperArticlesAttrs = ['id', 'title', 'alias', 'image', 'smallDesc', 'longDesc', 'journalists']

            // var articleContentsAttrs = ['id', 'title', 'alias', 'image', 'smallDesc', 'longDesc']
            // el.dataValues.articleContents = await el.getNewspaperarticles({
            //     attributes: articleContentsAttrs
            // })

            el.dataValues.articleContents = []


            var categoriesAttrs = ['id', 'name', 'alias', 'path', 'categoryViewType', 'intro']
            el.dataValues.categories = await el.getCategories({
                attributes: categoriesAttrs
            })

            var mediaresourcesAttrs = ['id', 'title', 'alias', 'dataJson']
            el.dataValues.mediaresources = [await el.getMediaresources({
                attributes: mediaresourcesAttrs
            })]
            // var mediacategoriesAttrs = ['id', 'name', 'alias']
            // el.dataValues.mediacategories = await el.getMediacategory({
            //     attributes: mediacategoriesAttrs
            // })

            el.dataValues.mediacategories = []

            var opusesAttrs = ['id', 'title', 'alias', 'opusType']
            el.dataValues.opuses = await el.getOpuses({
                attributes: opusesAttrs
            })


            var episodesAttrs = ['id', 'name', 'alias', 'image', 'smallDesc', 'longDesc', 'movie', 'releaseDate']
            el.dataValues.episodes = await el.getEpisodes({
                attributes: episodesAttrs
            })

            var galleriesAttrs = ['id', 'name', 'alias', 'galleryImages']
            el.dataValues.galleries = [await el.getGalleries({
                attributes: galleriesAttrs
            })]
            // var debatesAttrs = ['id', 'title', 'alias', 'image', 'smallDesc', 'longDesc', 'publishedAt']
            // el.dataValues.debates = await el.getDebates({
            //     attributes: debatesAttrs
            // })
            el.dataValues.debates = []

            var historicaleventsAttrs = ['id', 'name', 'alias', 'image', 'smallDesc', 'longDesc', 'fromDate', 'toDate']
            el.dataValues.historicalevents = await el.getHistoricalevents({
                attributes: historicaleventsAttrs
            })
            // var figuresAttrs = ['id', 'title', 'alias', 'image', 'smallDesc', 'longDesc', 'figureType', 'publishedAt']
            // el.dataValues.figures = await el.getFigures({
            //     attributes: figuresAttrs
            // })
            el.dataValues.figures = []

            var iel = {
                aid: el.id,
                artType: "articlecontent",
                title: el.title,
                alias: el.alias,
                image: el.image,
                smallDesc: el.smallDesc,
                longDesc: el.longDesc,
                content: ElasticSearchHelper.mergeContent(el.smallDesc, el.longDesc),
                onHome: el.onHome,
                metaDescription: el.metaDescription,
                metaKeywords: el.metaKeywords,
                publishedAt: el.publishedAt,
                attachments: [],
                authors: ElasticSearchHelper.makeDataFromMap(authorsAttrs, el.dataValues.authors),
                journalists: ElasticSearchHelper.makeDataFromMap(journalistsAttrs, el.dataValues.journalists),
                newspaperArticles: ElasticSearchHelper.makeDataFromMap(newspaperArticlesAttrs, el.dataValues.newspaperArticles),
                articleContents: [],
                categories: ElasticSearchHelper.makeDataFromMap(categoriesAttrs, el.dataValues.categories),
                mediaresources: ElasticSearchHelper.makeDataFromMap(mediaresourcesAttrs, el.dataValues.mediaresources),
                mediacategories: [],
                opuses: ElasticSearchHelper.makeDataFromMap(opusesAttrs, el.dataValues.opuses),
                episodes: ElasticSearchHelper.makeDataFromMap(episodesAttrs, el.dataValues.episodes),
                galleries: ElasticSearchHelper.makeDataFromMap(galleriesAttrs, el.dataValues.galleries),
                debates: el.dataValues.debates,
                figures: el.dataValues.figures,
                historicalevents: ElasticSearchHelper.makeDataFromMap(historicaleventsAttrs, el.dataValues.historicalevents)
            }


            dataIndex.push(iel)

        })

        return dataIndex
    }

    async prepareAllNewspaperArticlesForIndex(fromTo) {

        var dataIndex = [];

        if (fromTo) {
            var elements = await Newspaperarticle.findAll(fromTo)
        } else {
            var elements = await Newspaperarticle.findAll()
        }



        await map(elements, async (el, i) => {

            var authorsAttrs = ["id", "name", "surname", "alias", "bornDate", "deathDate", "image", "bio"]
            el.dataValues.authors = await el.getAuthors({
                attributes: authorsAttrs
            })

            var journalistsAttrs = ["id", "name", "surname", "alias", "image", "bio"]
            var jr = await el.getJournalist({
                attributes: journalistsAttrs
            })
            if (jr) {
                el.dataValues.journalists = [jr]
            } else {
                el.dataValues.journalists = []
            }

            // var newspaperArticlesAttrs = ['id', 'title', 'alias', 'image', 'smallDesc', 'longDesc', 'newspaperArticleType']
            // el.dataValues.newspaperArticles = await el.getNewspaperarticles({
            //     attributes: newspaperArticlesAttrs
            // })
            el.dataValues.newspaperArticles = []

            var articleContentsAttrs = ['id', 'title', 'alias', 'image', 'smallDesc', 'longDesc']
            el.dataValues.articleContents = await el.getArticlecontents({
                attributes: articleContentsAttrs
            })
            el.dataValues.articleContents = await this.addJournalistToCollectionArticleContent(el.dataValues.articleContents)
            articleContentsAttrs = ['id', 'title', 'alias', 'image', 'smallDesc', 'longDesc', 'journalists']


            var categoriesAttrs = ['id', 'name', 'alias', 'path', 'categoryViewType', 'intro']
            el.dataValues.categories = await el.getCategories({
                attributes: categoriesAttrs
            })

            var mediaresourcesAttrs = ['id', 'title', 'alias', 'dataJson']
            el.dataValues.mediaresources = [await el.getMediaresources({
                attributes: mediaresourcesAttrs
            })]

            var mediacategoriesAttrs = ['id', 'name', 'alias']
            var mdcat = await el.getMediacategory({
                attributes: mediacategoriesAttrs
            })
            if (mdcat) {
                el.dataValues.mediacategories = [mdcat]
            } else {
                el.dataValues.mediacategories = []
            }


            el.dataValues.mediacategories = []
            var opusesAttrs = ['id', 'title', 'alias', 'opusType']
            el.dataValues.opuses = await el.getOpuses({
                attributes: opusesAttrs
            })

            var episodesAttrs = ['id', 'name', 'alias', 'image', 'smallDesc', 'longDesc', 'movie', 'releaseDate']
            el.dataValues.episodes = await el.getEpisodes({
                attributes: episodesAttrs
            })

            var galleriesAttrs = ['id', 'name', 'alias', 'galleryImages']
            el.dataValues.galleries = [await el.getGalleries({
                attributes: galleriesAttrs
            })]

            var debatesAttrs = ['id', 'title', 'alias', 'image', 'smallDesc', 'longDesc', 'publishedAt']
            el.dataValues.debates = await el.getDebates({
                attributes: debatesAttrs
            })

            var figuresAttrs = ['id', 'title', 'alias', 'image', 'smallDesc', 'longDesc', 'figureType', 'publishedAt']
            el.dataValues.figures = await el.getFigures({
                attributes: figuresAttrs
            })

            var historicaleventsAttrs = ['id', 'name', 'alias', 'image', 'smallDesc', 'longDesc', 'fromDate', 'toDate']
            el.dataValues.historicalevents = await el.getHistoricalevents({
                attributes: historicaleventsAttrs
            })


            var iel = {
                aid: el.id,
                artType: "newspaperarticle",
                title: el.title,
                image: el.image,
                smallDesc: el.smallDesc,
                longDesc: el.longDesc,
                content: '',
                onHome: el.onHome,
                metaDescription: el.metaDescription,
                metaKeywords: el.metaKeywords,
                publishedAt: el.publishedAt,
                attachments: [],
                authors: ElasticSearchHelper.makeDataFromMap(authorsAttrs, el.dataValues.authors),
                journalists: ElasticSearchHelper.makeDataFromMap(journalistsAttrs, el.dataValues.journalists),
                newspaperArticles: [],
                articleContents: ElasticSearchHelper.makeDataFromMap(articleContentsAttrs, el.dataValues.articleContents),
                categories: ElasticSearchHelper.makeDataFromMap(categoriesAttrs, el.dataValues.categories),
                mediaresources: ElasticSearchHelper.makeDataFromMap(mediaresourcesAttrs, el.dataValues.mediaresources),
                mediacategories: ElasticSearchHelper.makeDataFromMap(mediacategoriesAttrs, el.dataValues.mediacategories),
                opuses: ElasticSearchHelper.makeDataFromMap(opusesAttrs, el.dataValues.opuses),
                episodes: ElasticSearchHelper.makeDataFromMap(episodesAttrs, el.dataValues.episodes),
                galleries: ElasticSearchHelper.makeDataFromMap(galleriesAttrs, el.dataValues.galleries),
                debates: ElasticSearchHelper.makeDataFromMap(debatesAttrs, el.dataValues.debates),
                figures: ElasticSearchHelper.makeDataFromMap(figuresAttrs, el.dataValues.figures),
                historicalevents: ElasticSearchHelper.makeDataFromMap(historicaleventsAttrs, el.dataValues.historicalevents)
            }


            dataIndex.push(iel)

        })

        return dataIndex

    }


    async addJournalistToCollectionArticleContent(collection) {
        await map(collection, async (c, i) => {
            var a = await Articlecontent.findOne({ where: { id: c.id } })
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

}

module.exports = new ElasticSearchArticlesRepository()
