var Link = require('../models/index').Link;
var Content = require('../models/index').Content;
var Gallery = require('../models/index').Gallery;
var Category = require('../models/index').Category;
var Region = require('../models/index').Region;
var City = require('../models/index').City;
var Theme = require('../models/index').Theme;
var Event = require('../models/index').Event;
var Age = require('../models/index').Age;
var Attraction = require('../models/index').Attraction
var Catalog = require('../models/index').Catalog;
var Article = require('../models/index').Article;
var Slide = require('../models/index').Slide;
var HomePage = require('../models/index').HomePage;
var Partner = require('../models/index').Partner;
var limit = require('../config/limit')
const Sequelize = require('sequelize')
const ElasticSearchRepository = require('./ElasticSearchRepository')
const Op = Sequelize.Op;
const {
    map
} = require('p-iteration');
var moment = require('moment');

class ResourceToViewRepository {

    async selectMyResourceType(d, q) {

        switch (d.searchFor) {

            case 'link':

                return await this.withLinkResource(d.data, q);

                break;

            case 'gallery':

                return d.data;

                break;

            case 'galleries':

                return d.data;

                break;

            case 'events':

                return d.data;

                break;

            case 'event':

                return d.data;

                break;

            case 'articles':

                return d.data;

                break;

            case 'article':

                return d.data;

                break;

            case 'catalog':

                return d.data;

                break;


            case 'category':

                return d.data;

                break;

        }
    }


    async withLinkResource(l, q) {

        switch (l.dataType) {

            case 'category':

                if (l.categoryId != null) {

                    var offset = 0;
                    if (q.page && q.page != 1) {
                        offset = (q.page - 1) * limit.eventsLimit;
                    }


                    var d = await Article.findAndCountAll({
                        where: {
                            categoryId: l.categoryId
                        },
                        offset,
                        limit: limit.articlesLimit,

                        include: [
                            {
                                model: Category,
                                as: 'category'
                            }
                        ],

                        // order: [
                        //     ['publishedAt', 'DESC']
                        // ],
                        distinct: true
                    })

                    return {
                        data: d,
                        category: await l.getCategory(),
                        offset,
                        limit: limit.articlesLimit
                    };

                } else {
                    return null;
                }

                break;

            case 'catalog':


                // var offset = 0;
                // if (q.page && q.page != 1) {
                //     offset = (q.page - 1) * limit.eventsLimit;
                // }


                // var d = await Event.findAndCountAll({
                //     where: {
                //         eventSezonType: {
                //             [Op.not]: ['winter', 'summer']
                //         },
                //         eventType: 'template',
                //         catalogId: l.catalogId
                //     },
                //     // order: Sequelize.literal('startAt DESC'),
                //     offset: offset,
                //     limit: limit.eventsLimit,
                //     include: [
                //         {
                //             model: Region,
                //             as: 'Regions'
                //         },
                //         {
                //             model: Age,
                //             as: 'Ages'
                //         }
                //     ],
                //     distinct: true
                // })



                return {
                    // events: d,
                    // offset: offset,
                    // limit: limit.eventsLimit,
                    catalog: await l.getCatalog()
                };

                break;

            case 'article':

                // if (l.content_id != null) {

                //     var cnt = await Content.find({
                //         id: l.content_id
                //     }).findAsync();

                //     var galleries = await Gallery.find({
                //         content_id: l.content_id
                //     }).order('published_at').findAsync();

                //     cnt[0].galleries = galleries;

                //     if (cnt[0].category_id != null) {
                //         cnt[0].category = await Category.getAsync(cnt[0].category_id);
                //     }

                //     return cnt[0];
                // } else {
                //     return null;
                // }

                break;

            case 'articles':

                if (l.categoryId) {
                    var arts = await Article.findAll({
                        where: {
                            categoryId: l.categoryId
                        },
                        order: [
                            ['ordering', 'asc']
                        ]
                    })

                    return { articles: arts, category: await l.getCategory() };

                }

                return null


                break;

            case 'galleries':


                var d;


                return d;

                break;


            case 'events':

                if (l.catalogId) {

                    var all = false;
                    if (q.hasOwnProperty('all')) {
                        all = true;
                    }

                    var iEvents = await ElasticSearchRepository.searchCatalogIndexByType(l.eventsType, l.catalogId, all, 0, 100, 'wirtur')


                    // var where = {
                    //     catalogId: l.catalogId,
                    //     eventSezonType: l.eventsType,
                    //     status: {
                    //         [Op.not]: ['arch']
                    //     }
                    // }

                    // if (!q.hasOwnProperty('all')) {
                    //     where.startAt = { [Op.gt]: new Date() }
                    // }

                    // var ev = await Event.findAll({
                    //     where,
                    //     order: Sequelize.literal('startAt ASC'),
                    //     include: [
                    //         {
                    //             model: Region,
                    //             as: 'Regions'
                    //         },
                    //         {
                    //             model: Age,
                    //             as: 'Ages'
                    //         }
                    //     ]
                    // })



                    // if (ev) {
                    //     return { events: ev, catalog: await l.getCatalog() };
                    // }


                    return { events: iEvents, catalog: await l.getCatalog() };




                } else {
                    return null;
                }
                break;


            case 'blank':


                break;


        }
    }

    static makeSelfLink(alias, linkAlias) {
        return '/' + linkAlias + '/' + alias;
    }


    async homeDataGet() {
        var homeData = {};
        homeData.slides = await Slide.findAll({
            where: {
                status: 1
            },
            order: [
                ['ordering', 'ASC']
            ]
        })

        homeData.boxes = await HomePage.findAll({
            where: {},
            order: [
                ['ordering', 'ASC']
            ]
        })

        homeData.homeArticle = await Article.findOne({
            where: {
                onHome: 1
            },
            include: [
                {
                    model: Category,
                    as: 'category'
                }
            ]
        })

        homeData.currentCatalog = await Catalog.findOne({
            where: {
                current: true
            }
        })


        homeData.partners = await Partner.findAll({
            order: [
                ['ordering', 'asc']
            ]
        })



        return homeData;
    }


}

module.exports = new ResourceToViewRepository();