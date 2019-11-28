var Link = require('../models/index').Link;
var Menu = require('../models/index').Menu;
var Article = require('../models/index').Article;
var Gallery = require('../models/index').Gallery;
const ResourceToViewRepository = require("./ResourceToViewRepository")
const {
    map
} = require('p-iteration');


class ResourcesRepository {


    getHomeBlogData(req, res, next) {

        ResourcesRepository.getHompageData().then(d => {
            req.blog = d;
            next()
        })
    }

    async getFullResorcesArray() {

        var array = [];

        var articles = await Article.findAll()

        array.push(articles)

        return array;

    }

    static async getHompageData() {

        var blog = [];
        var homeP = await HomePage.findAsync({
            status: 1
        })


        if (homeP.length > 0) {
            var resources = JSON.parse(homeP[0].resources);
            var resData = []

            await map(resources, async (elm, i) => {

                switch (elm.type) {

                    case 'article':
                        var c = await ResourcesRepository.getArtData(elm.id)
                        if (c) {

                            resData.push({
                                data: c
                            });
                        }
                        break;

                    case 'agenda':
                        var a = await ResourcesRepository.getAgendaData(elm.id)
                        if (a) {
                            resData.push({
                                data: a
                            })
                        }
                        break;

                    case 'gallery':
                        var g = await ResourcesRepository.getGalleryData(elm.id)
                        if (g) {
                            resData.push({
                                data: g
                            })
                        }
                        break;
                }

            })
            return resData
        } else {
            return []
        }


    }


    static async getArtData(id) {

        var arts = await Content.findAsync({
            id: id
        });
        var art;

        if (arts.length > 0) {
            art = arts[0]
            var linkC = await Link.findAsync({
                content_id: art.id,
                data_type: 'article'
            })
            var linkExists = false;

            if (linkC.length > 0) {
                art.self_link = linkC[0].path;
                linkExists = true;
            } else {

                var linkCat = await Link.findAsync({
                    category_id: art.category_id,
                    data_type: 'category'
                })
                if (linkCat.length > 0) {
                    // console.log(JSON.stringify(linkCat))
                    art.self_link = linkCat[0].alias + '/' + art.alias;
                    linkExists = true;
                }
            }

            // console.log(linkExists)

            if (!linkExists) {
                art.self_link = 'artykul/' + art.alias;
            }

        }


        return art
    }

    static async getAgendaData(id) {

        var agds = await Agenda.findAsync({
            id: id
        });
        var agd;
        if (agds.length > 0) {

            agd = agds[0]
            var linkA = await Link.findAsync({
                agenda_id: agd.id
            })
            var linkExists = false;

            if (linkA.length > 0) {
                agd.self_link = linkC[0].path;
                linkExists = true;
            } else {
                var linkCat = await Link.findAsync({
                    category_id: agd.category_id,
                    data_type: 'agendas'
                })
                if (linkCat.length > 0) {
                    agd.self_link = linkCat[0].alias + '/' + agd.alias;
                    linkExists = true;
                }
            }

            if (!linkExists) {
                agd.self_link = 'oferta/' + agd.alias;
            }

        }


        return await agd
    }

    static async getGalleryData(id) {

        var gals = await Gallery.findAsync({
            id: id
        });

        var gal;

        if (gals.length > 0) {
            var linkG = await Link.findAsync({
                data_type: 'galleries'
            })
            gal = gals[0]
            var linkExists = false;

            if (linkG.length > 0) {
                gal.self_link = linkG[0].path;
                linkExists = true;
            }

            if (!linkExists) {
                gal.self_link = 'galeria/' + gal.alias;
            }

            if (gal.data != null) {
                var dGal = gal.data;
                // console.log(Gal.length)
                if (dGal.length > 0) {
                    gal.image = dGal[0].image;
                }
            }
        }

        return await gal
    }

    getResourceContent(req, res, next) {

        ResourceToViewRepository.getViewDataContent(req.params.alias).then(d => {

            if (d.is404) {
                res.status(404)
                    .send('Not found');
            }

            req.toView = d;
            next()
        })


    }

    getResourceAgenda(req, res, next) {
        ResourceToViewRepository.getViewDataAgenda(req.params.alias).then(d => {

            if (d.is404) {
                res.status(404)
                    .send('Not found');
            }

            req.toView = d;
            next()
        })
    }

    getResourceGallery(req, res, next) {
        ResourceToViewRepository.getViewDataGallery(req.params.alias).then(d => {

            if (d.is404) {
                res.status(404)
                    .send('Not found');
            }

            req.toView = d;
            next()
        })
    }

}


module.exports = new ResourcesRepository()