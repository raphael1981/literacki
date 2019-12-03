var UrlResourcesSearchRepository = require('./UrlResourcesSearchRepository');
var ResourceToViewRepository = require('./ResourceToViewRepository');
const cache = require('../config/cache');
const ParseHelper = require('../helpers/parse-helper')

class RouteParseRepository {

    parseUrl(req, res, next) {

        var dataP = ParseHelper.paramsToString(req.params)
        // return res.json(dataP)

        UrlResourcesSearchRepository.parseUrlStart(dataP.path, dataP.countP, req.params, req.query).then(d => {

            // return res.send(d)

            if (d == null) {
                res.status(404)
                    .send('Not found');
            } else {
                req.searchFor = d;
                // return res.json(req.searchFor)
                next();
            }

        })

    }



    getResourcesFullData(req, res, next) {

        // return res.send(req.searchFor)

        ResourceToViewRepository.selectMyResourceType(req.searchFor, req.query).then(d => {


            return res.json(d)

            next();

        })

    }


    homeParseData(req, res, next) {

        // ResourceToViewRepository.homeDataGet().then(d => {
        //     req.toView = d;
        //     next();
        // })

        next()

    }

    getCacheMenus(req, res, next) {

        req.menus = []

        cache.get('menu-1', (err, m1) => {
            req.menus.push(m1)
            cache.get('menu-2', (err, m2) => {
                req.menus.push(m2)
                cache.get('menu-3', (err, m3) => {
                    req.menus.push(m3)
                    next();
                })
            })
        })


    }



}

module.exports = new RouteParseRepository();