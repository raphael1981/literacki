const MenuRepository = require("../../repositories/MenuRepository")
const LinkRepository = require("../../repositories/LinkRepository")
const CollectHelper = require("../../helpers/collect-helper")
const Link = require("../../models/index").Link;
const Menu = require("../../models/index").Menu;
var slug = require('slug')
const cache = require('../../config/cache')

class MenuController {

    getCachedMenu(req, res) {

        var menus = [];

        cache.get('menu-1', (err, m1) => {
            menus.push(m1)
            cache.get('menu-2', (err, m2) => {
                menus.push(m2)
                cache.get('menu-3', (err, m3) => {
                    menus.push(m3)
                    return res.json(menus)
                })
            })
        })

    }


    getFullMenuListData(req, res) {
        MenuRepository.getMenus().then(data => {
            return res.json(data)
        }).catch(err => {
            console.log(err)
        })
    }

    getMenuLinks(req, res) {
        MenuRepository.getMenuLinksData(req.params.id).then(data => {
            return res.json(data.linksJson)
        }).catch(err => {
            console.log(err)
        })
    }

    getMenusFlatLinks(req, res) {
        MenuRepository.getMenusAndFlatLinks().then(response => {
            return res.json(response)
        }).catch(err => {
            console.log(err)
        })
    }


    updateMenuField(req, res) {
        var mid = req.params.id;
        var value = req.body.value;
        var field = req.body.field;
        // if (field == 'linksJson') {
        //     value = CollectHelper.filterJsonLinksData(JSON.parse(req.body.value), [])
        // }
        // return res.json(value);
        Menu.findOne({ where: { id: mid } }).then(nL => {
            nL[field] = value;
            nL.save();
            return res.json(nL);
        })
    }


    getMenu(req, res) {
        Menu.findOne({
            where: {
                id: req.params.id
            }
        }).then(m => {
            return res.json(m);
        })
    }

    addLinkToMenu(req, res) {

        var data = req.body;

        MenuRepository.addLinkToMenu(data).then(d => {
            return res.json(d);
        })


    }


    addLink(req, res, next) {

        var data = req.body;

        Link.create({
            title: data.name,
            alias: slug(data.name, {
                lower: true
            }),
            path: '',
            data_type: 'blank'
        }, (err, l) => {
            // console.log(err)
            // console.log(l)
            req.link = l;
            next()

        })


    }


    addNewLinkToMenu(req, res) {

        var data = req.body;

        MenuRepository.addNewLinkToMenu(data, req.link).then(d => {
            return res.json(d);
        }).catch(err => {
            console.log(err)
        })


    }


    linkRemoveFromJson(req, res, next) {
        MenuRepository.removeLinkFromJsons(req.params.id).then(d => {
            next()
        }).catch(err => {
            console.log(err)
        })
    }

    removeLinkFromBase(req, res) {
        Link.findOne({ where: { id: req.params.id } }).then(L => {
            L.destroy().then(d => {
                return res.json({
                    success: true
                })
            })
        })
    }


    removeLinkFromMenu(req, res) {
        var data = req.body
        MenuRepository.removeLinkFromOneMenuJson(data.linkId, data.menuId).then(d => {
            return res.json(d)
        }).catch(err => {
            console.log(err)
        })
    }

    getMenuList(req, res) {
        MenuRepository.getMenusList().then(d => {
            return res.json(d)
        })
    }

    cacheMenu(req, res) {
        MenuRepository.cacheMenuReqursive(req.params.id).then(d => {
            cache.set('menu-' + req.params.id, d, 31536000, (err, value) => {
                return res.json(req.body)
            })
        })
    }

    prepareFromTree(req, res) {


        Menu.findOne({ where: { id: req.params.id } }).then(m => {

            if (m) {
                MenuRepository.getLinksTreeMin().then(r => {

                    MenuRepository.addTreeToMenu(r, m.id).then(d => {
                        return res.json(d)
                    })

                })
            } else {
                return res.json({})
            }

        })



    }

}


module.exports = new MenuController()