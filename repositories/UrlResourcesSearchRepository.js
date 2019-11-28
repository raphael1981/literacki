var Link = require('../models/index').Link;
var Articlecontent = require('../models/index').Articlecontent;
var Gallery = require('../models/index').Gallery;
var Event = require('../models/index').Event;
var limit = require('../config/limit')
const Sequelize = require('sequelize')
const ElasticSearchRepository = require('./ElasticSearchRepository')
const Op = Sequelize.Op;
const {
    map
} = require('p-iteration');
var moment = require('moment');

class UrlResourcesSearchRepository {

    static paramsToString(params) {
        var str = '';
        Object.keys(params).forEach((k, i) => {
            if (params[k] != undefined)
                str += params[k] + "/";
        })
        return str.slice(0, -1);
    }

    async parseUrlStart(path, countP, params, query) {

        var l = await Link.findOne({
            where: { path: path, status: 1 }
        })

        if (l) {
            return {
                searchFor: 'link',
                data: l
            };
        }

        var a = await this.parseFirstArgument(path, countP, params, query);

        if (a) {
            return a;
        }

        var b = await this.parseSecondArgument(path, countP, params, query);

        if (b) {
            return b;
        }

        return null;

    }



    async parseFirstArgument(path, countP, params, query) {

        if (countP == 1) {

            var catalog = await Catalog.findOne({
                where: { alias: params.a },
            });


            // if (catalog) {

            //     var offset = 0;

            //     if (query.page && query.page != 1) {
            //         offset = (query.page - 1) * limit.eventsLimit;
            //     }


            //     var d = await Event.findAndCountAll({
            //         where: {
            //             eventSezonType: {
            //                 [Op.not]: ['winter', 'summer']
            //             },
            //             catalogId: catalog.id
            //         },
            //         offset: offset,
            //         limit: limit.eventsLimit,
            //         include: [
            //             {
            //                 model: Region,
            //                 as: 'Regions'
            //             },
            //             {
            //                 model: Age,
            //                 as: 'Ages'
            //             },
            //         ],
            //         distinct: true
            //     })


            return {
                searchFor: 'catalog',
                dataType: 'catalog',
                data: {
                    catalog: catalog,
                    // offset: offset,
                    // limit: limit.articlesLimit,
                    // events: d
                }
            }




            // }


            var cat = await Category.findOne({
                where: {
                    alias: params.a
                },
                // attributes: {
                //     include: [[Sequelize.fn("COUNT", Sequelize.col("articles.id")), "articlesCount"]]
                // },
                // include: [{
                //     model: Article, attributes: []
                // }]
            })


            if (cat) {

                var articles = await Article.findAndCountAll({
                    where: {
                        categoryId: cat.id
                    },
                    offset: 0,
                    limit: limit.articlesLimit,
                    order: [
                        ['publishedAt', 'DESC']
                    ],
                })

                return {
                    searchFor: 'category',
                    dataType: 'catgory',
                    data: {
                        category: cat,
                        offset: 0,
                        limit: limit.articlesLimit,
                        data: articles
                    }
                };

            }


            var art = await Article.findOne({ where: { alias: params.a } })

            if (art) {
                return {
                    searchFor: 'article',
                    dataType: 'article',
                    data: art
                }
            }


            var ev = await Event.findOne({
                where: {
                    alias: params.a
                }
            })


            if (ev) {

                var event = await ElasticSearchRepository.getEventByIndexId(ev.id)

                if (ev) {
                    return {
                        searchFor: 'event',
                        dataType: 'event',
                        data: { event: event._source, ev }
                    }
                }

            }


            return null;


        }

        return null;

    }



    async parseSecondArgument(path, countP, params, query) {
        if (countP == 2) {


            var l = await Link.findOne({
                where: { path: params.a, status: 1 }
            })

            if (l) {

                switch (l.dataType) {


                    case 'articles':

                        if (l.categoryId) {

                            var art = await Article.findOne({
                                where: {
                                    alias: params.b,
                                    categoryId: l.categoryId
                                }
                            })


                            if (art) {
                                return {
                                    searchFor: 'article',
                                    dataType: 'article',
                                    data: art
                                }
                            }
                        }

                        break;


                    case 'galleries':


                        var gal = await Gallery.findOne({
                            where: {
                                alias: params.b
                            }
                        })


                        if (gal) {
                            return {
                                searchFor: 'gallery',
                                dataType: 'gallery',
                                data: gal
                            }
                        }

                        break;

                    case 'events':

                        if (l.catalogId) {

                            var ev = await Event.findOne({
                                where: {
                                    alias: params.b,
                                    catalogId: l.catalogId
                                }
                            })

                            var ev = await Event.findOne({
                                where: {
                                    alias: params.b,
                                    catalogId: l.catalogId
                                }
                            })

                            var event = await ElasticSearchRepository.getEventByIndexId(ev.id)

                            if (ev) {
                                return {
                                    searchFor: 'event',
                                    dataType: 'event',
                                    data: { event: event._source, ev }
                                }
                            }

                        }

                        break;

                    case 'catalog':


                        if (l.catalogId) {

                            var ev = await Event.findOne({
                                where: {
                                    alias: params.b,
                                    catalogId: l.catalogId
                                }
                            })



                            if (ev) {
                                var event = await ElasticSearchRepository.getEventByIndexId(ev.id)
                                return {
                                    searchFor: 'event',
                                    dataType: 'event',
                                    data: { event: event._source, ev }
                                }
                            }

                        }

                        break;

                }

            }

            var cat = await Category.findOne({
                where: {
                    alias: params.a
                }
            })

            if (cat) {

                var art = await Article.findOne({
                    where: {
                        alias: params.b,
                        categoryId: cat.id
                    }
                })


                if (art) {
                    return {
                        searchFor: 'article',
                        dataType: 'article',
                        data: art
                    }
                }

            }

            var catalog = await Catalog.findOne({
                where: {
                    alias: params.a
                }
            })

            if (catalog) {

                // console.log(catalog)

                var ev = await Event.findOne({
                    where: {
                        alias: params.b,
                        catalogId: catalog.id
                    }
                })

                if (ev) {

                    var event = await ElasticSearchRepository.getEventByIndexId(ev.id)


                    if (ev) {
                        return {
                            searchFor: 'event',
                            dataType: 'event',
                            data: { event: event._source, ev }
                        }
                    }

                }

            }

            return null;


        }

        return null;

    }





}

module.exports = new UrlResourcesSearchRepository();