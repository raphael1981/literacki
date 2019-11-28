const MenuRepository = require('../repositories/MenuRepository');
const cache = require('../config/cache');
var ParseHelper = require('../helpers/parse-helper');
const fs = require('fs')
const parser = new ParseHelper()
var moment = require('moment');
const paths = require('../paths')

class PageController {

    indexPage(req, res) {


        var canonical = ParseHelper.getCanonical(req.path);

        var oUrl = req.originalUrl
        oUrl = oUrl.substr(1, oUrl.length - 1)

        var menus = req.menus;
        menus[0] = ParseHelper.replaceToCurrentActiveMenu(menus[0], oUrl)
        menus[1] = ParseHelper.replaceToCurrentActiveMenu(menus[1], oUrl)
        // return res.json(req.toView);

        return PageController.switchToResourceView(req, res, canonical, menus);



    }





    static switchToResourceView(req, res, canonical, menus) {

        var url = req.protocol + '://' + req.hostname + req.path;
        var domain = req.protocol + '://' + req.hostname;

        switch (req.toView.data.dataType) {

            case 'article':

                // var imagesGallery = null;

                // if (req.toView.data.imagesGallery) {
                //     imagesGallery = JSON.parse(req.toView.data.imagesGallery)
                // }

                return res.json(req.toView)
                // return res.json(breadc)
                // res.header('Cache-Control', 'no-cache, no-store, must-revalidate')
                return res.render('./views/resources/article', {
                    controller: '/controllers/page.controller.js',
                    title: '',
                    canonical: canonical,
                    meta_desc: '',
                    meta_keywords: '',
                    menu: menu,
                    article: req.toView.data,
                    cits,
                    path: req.path,
                    breadc,
                    url,
                    domain,
                    imagesGallery,
                    link: req.toView.link
                })

                break;

            case 'articles':


                // return res.json(req.toView)
                // return res.json(breadc)
                // res.header('Cache-Control', 'no-cache, no-store, must-revalidate')
                return res.render('./views/resources/articles', {
                    controller: '/controllers/page.controller.js',
                    title: '',
                    canonical: canonical,
                    meta_desc: '',
                    meta_keywords: '',
                    menus,
                    articles: req.toView.resource.articles,
                    path: req.path,
                    category: req.toView.resource.category,
                    url,
                    domain,
                    link: req.toView.link
                })

                break;


            case 'category':

                // return res.json(breadc)
                // return res.json(req.toView)

                // res.header('Cache-Control', 'no-cache, no-store, must-revalidate')
                return res.render('./views/resources/category-one-column', {
                    controller: '/controllers/page.controller.js',
                    title: '',
                    canonical: canonical,
                    meta_desc: '',
                    meta_keywords: '',
                    menus,
                    partners: req.partners,
                    category: req.toView.data.category,
                    blog: {
                        articles: req.toView.resource.data.rows,
                        total: req.toView.resource.data.count,
                        offset: req.toView.resource.offset,
                        limit: req.toView.resource.limit
                    },
                    path: req.path,
                    page: (req.query.page) ? req.query.page : 1,
                    url,
                    domain,
                    category: req.toView.resource.category,
                    link: req.toView.data.link
                })

                break;

            case 'events':

                // return res.json(req.toView)

                return res.render('./views/resources/events-index', {
                    controller: '/controllers/page.controller.js',
                    title: '',
                    canonical: canonical,
                    meta_desc: '',
                    meta_keywords: '',
                    menus: menus,
                    path: req.path,
                    url,
                    domain,
                    partners: req.partners,
                    all: (req.query.all == ''),
                    link: req.toView.data.link,
                    events: req.toView.resource.events.hits.hits,
                    catalog: req.toView.resource.catalog,
                    moment
                })

                break;


            case 'event':

                // return res.json(req.toView)

                return res.render('./views/resources/event-modern', {
                    controller: '/controllers/page.controller.js',
                    title: '',
                    canonical: canonical,
                    meta_desc: '',
                    meta_keywords: '',
                    menus: menus,
                    path: req.path,
                    url,
                    domain,
                    partners: req.partners,
                    event: req.toView.resource.event,
                    eventBase: req.toView.resource.ev,
                    link: req.toView.data.link,
                    event: req.toView.resource.event,
                    moment
                })

                break;

            case 'catalog':

                // return res.json(req.toView)
                var filename = 'index';
                if (req.toView.data.searchFor == 'link') {
                    filename = req.toView.data.link.path.replace(new RegExp('\\/', 'g'), '-')
                } else {
                    filename = req.toView.resource.catalog.alias
                }

                var baseHref = canonical;

                if (baseHref.substr(-1, 1) == '/') {
                    baseHref = baseHref.substr(0, canonical.length - 1)
                }

                if (!req.query.catalog || req.query.catalog != req.toView.resource.catalog.id) {
                    return res.redirect(301, baseHref + "/?catalog=" + req.toView.resource.catalog.id)
                }

                return res.render('./dist/browser/' + filename + '.html', {
                    req: req,
                    res: res
                });

                // return res.json(req.toView)

                // return res.render('./views/resources/catalog', {
                //     controller: '/controllers/page.controller.js',
                //     title: '',
                //     canonical: canonical,
                //     meta_desc: '',
                //     meta_keywords: '',
                //     menus: menus,
                //     path: req.path,
                //     url,
                //     domain,
                //     link: req.toView.data.link
                // })

                break;

            case 'map':

                // return res.json(req.toView)

                return res.render('./dist/browser/warto-zobaczyc.html', {
                    req: req,
                    res: res
                });

                break


            case 'contact':

                return this.showCustomView(req, res, canonical, menus, url, domain)

                break


            default:
                // return res.status(404)
                //     .render('404', {
                //         menus
                //     });
                break;

        }

    }

    static showCustomView(req, res, canonical, menus, url, domain) {

        return res.json(req.toView);
        // res.header('Cache-Control', 'no-cache, no-store, must-revalidate')
        return res.render('custom/' + req.toView.link.view, {
            controller: '/controllers/' + req.toView.link.view + '.controller.js',
            title: '',
            canonical: canonical,
            meta_desc: '',
            meta_keywords: '',
            menu: menu,
            path: req.path,
            breadc,
            url,
            domain,
            link: req.toView.link
        })
    }

    searchIndexShow(req, res) {
        var canonical = ParseHelper.getCanonical(req.path);
        var url = req.protocol + '://' + req.hostname + req.path;
        var domain = req.protocol + '://' + req.hostname;
        return res.render('browser/index', {
            req: req,
            res: res,
            title: '',
            canonical: canonical,
            meta_desc: '',
            meta_keywords: '',
            menus: req.menus,
            path: req.path,
            url,
            domain
        });
    }

}


module.exports = new PageController()