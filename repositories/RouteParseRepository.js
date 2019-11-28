var UrlResourcesSearchRepository = require('./UrlResourcesSearchRepository');
var ResourceToViewRepository = require('./ResourceToViewRepository');
var Menu = require('../models/index').Menu;
const cache = require('../config/cache');

class RouteParseRepository {

    parseUrl(req, res, next) {

        // console.log(req.query)

        var dataP = RouteParseRepository.paramsToString(req.params)

        UrlResourcesSearchRepository.parseUrlStart(dataP.path, dataP.countP, req.params, req.query).then(d => {

            return res.send(d)

            if (d == null) {
                res.status(404)
                    .send('Not found');
            } else {
                req.viewData = d;
                next();
            }

        })

    }


    static paramsToString(params) {
        var str = '';
        var countP = 0;
        Object.keys(params).forEach((k, i) => {
            if (params[k] != undefined && params[k] != "") {
                str += params[k] + "/";
                countP++;
            }
        })
        return {
            countP: countP,
            path: str.slice(0, -1)
        };
    }

    getResourcesFullData(req, res, next) {
        ResourceToViewRepository.selectMyResourceType(req.viewData, req.query).then(d => {

            var data = {

            }

            if (req.viewData.searchFor == 'link') {

                data.searchFor = req.viewData.searchFor;
                data.dataType = req.viewData.data.dataType
                data.link = req.viewData.data

                req.toView = {
                    resource: d,
                    data: data
                };

                // return res.json(req.viewData)

            } else {


                data.searchFor = req.viewData.searchFor;
                data.dataType = req.viewData.searchFor;

                req.toView = {
                    resource: d,
                    data: data
                };

                // return res.json(req.viewData)

            }

            // return res.json({ d, reqData: req.viewData })

            next();

        })

    }


    homeParseData(req, res, next) {

        ResourceToViewRepository.homeDataGet().then(d => {
            req.toView = d;
            next();
        })


    }

    getCacheMenus(req, res, next) {

        Menu.findAll().then(mns => {

            req.mns = mns;
            req.menus = [];

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


            // return RouteParseRepository.getMenusAndThenCache(req, res, next, (mns.length + 1))

        })

    }

    static getMenusAndThenCache(req, res, next, j) {

        for (var i = 0; i < req.mns.length; i++) {

            cache.get('menu-' + req.mns[i].id, (err, menu) => {

                j--;
                req.menus.push(menu)

                if (j <= 0) {
                    next();
                } else {
                    return RouteParseRepository.getMenusAndThenCache(req, res, next, j)
                }

            })



        }
    }

    getCustomData(req, res, next) {
        Partner.findAll({
            order: [
                ['ordering', 'asc']
            ]
        }).then(ps => {
            req.partners = ps;
            next()
        })
    }

}

module.exports = new RouteParseRepository();