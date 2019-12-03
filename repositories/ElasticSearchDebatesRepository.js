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


class ElasticSearchDebatesRepository {

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
                    id: el.did,
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
            var elements = await Debate.findAll(fromTo)
        } else {
            var elements = await Debate.findAll()
        }



        await map(elements, async (el, i) => {


            var newspaperArticlesAttrs = ['id', 'title', 'alias', 'image', 'smallDesc', 'longDesc']
            el.dataValues.newspaperArticles = await el.getNewspaperarticles({
                attributes: newspaperArticlesAttrs
            })

            var journalists = await this.groupNewspapersJournalist(el.dataValues.newspaperArticles);
            journalists = await this.getJournalistNewspaperArticles(journalists, el)


            var newspapersAttrs = ['id', 'title', 'alias', 'number', 'releaseDate', 'publishedAt']
            var deb = await el.getNewspaper({
                attributes: newspapersAttrs
            })
            if (deb) {
                el.dataValues.newspapers = [deb]
            } else {
                el.dataValues.newspapers = []
            }


            var categoriesAttrs = ['id', 'name', 'alias', 'path', 'categoryViewType', 'intro']
            var cat = await el.getCategory({
                attributes: categoriesAttrs
            })
            if (cat) {
                el.dataValues.categories = [cat]
            } else {
                el.dataValues.categories = []
            }



            var iel = {
                did: el.id,
                title: el.title,
                alias: el.alias,
                image: el.image,
                smallDesc: el.smallDesc,
                longDesc: el.longDesc,
                releaseDate: el.releaseDate,
                publishedAt: el.releaseDate,
                metaDescription: el.metaDescription,
                metaKeywords: el.metaKeywords,
                publishedAt: el.publishedAt,
                newspaperArticles: ElasticSearchHelper.makeDataFromMap(newspaperArticlesAttrs, el.dataValues.newspaperArticles),
                newspapers: ElasticSearchHelper.makeDataFromMap(newspapersAttrs, el.dataValues.newspapers),
                journalists: journalists,
                categories: ElasticSearchHelper.makeDataFromMap(categoriesAttrs, el.dataValues.categories)
            }


            dataIndex.push(iel)

        })

        return dataIndex
    }


    async groupNewspapersJournalist(nwps) {


        var journalists = []

        await map(nwps, async (nw, i) => {

            var bool = true
            var n = await Newspaperarticle.findOne({ where: { id: nw.id } })
            var j = await n.getJournalist({
                attributes: ["id", "name", "surname", "alias", "bio", "image"]
            })

            journalists.map(jr => {
                if (jr.id == j.id) {
                    bool = false;
                }
            })

            if (bool && j) {
                journalists.push(j.dataValues)
            }

        })

        return journalists;

    }


    async getJournalistNewspaperArticles(journalists, debate) {


        await map(journalists, async (j, i) => {

            var jr = await Journalist.findOne({ where: { id: j.id } })

            var newspaperArticles = await jr.getNewspaperarticles({
                attributes: ['id', 'title', 'alias', 'image', 'smallDesc', 'longDesc'],
                include: [
                    {
                        model: Debate,
                        as: "Debates",
                        where: {
                            id: debate.id
                        }
                    }
                ],
                distinct: true
            })

            journalists[i].newspaperArticles = newspaperArticles.map(n => {
                return { 'id': n.id, 'title': n.title, 'alias': n.alias, 'image': n.image, 'smallDesc': n.smallDesc, 'longDesc': n.longDesc, 'newspaperArticleType': n.newspaperArticleType }
            });



        })


        return journalists

    }


}

module.exports = new ElasticSearchDebatesRepository()
