const connect = require('../config/db').poolConnect;
const cache = require('../config/cache')
const { map } = require('p-iteration');
const prefix = 'b9eaz_';
const User = require('../models/index').User
const Category = require('../models/index').Category
const Article = require('../models/index').Article
const Link = require('../models/index').Link
const Menu = require('../models/index').Menu
const Tag = require('../models/index').Tag
const fs = require('fs');
const path = require('path');
const appDir = path.dirname(require.main.filename);

class MysqlQueryImport {

    constructor() {

    }

    async createCacheMenu(menu) {

        return await this.getMenuLinks(1, 0, [], menu, 0);

    }


    async createArticleFromJoomla() {
        var array = await connect.query("select * from " + prefix + "content where state=1");
        await map(array, async (item, i) => {
            await this.createArticleFindCategory(item);
        })
    }

    async createArticleFindCategory(art) {

        var catID = this.findPairForArticle(art.catid)

        var article = await Article.create({
            title: art.title,
            alias: art.id + '-' + art.alias,
            introImage: (art.id == 10) ? "/images/head.png" : null,
            intro: art.introtext,
            content: art.fulltext,
            status: 1,
            categoryId: catID,
            ordering: art.ordering,
            publishedAt: art.publish_up
        })

        return article;

    }

    findPairForArticle(jCatId) {
        var id = null;
        var pairs = fs.readFileSync(appDir + "/pairs.json");
        pairs = JSON.parse(pairs);

        pairs.forEach((item, i) => {
            // console.log(jId, item.cat)
            if (jCatId == item.jcat) {
                id = item.cat

            }
        })
        return id;
    }


    async prepareCategoryJsonBaseStruct(parent_id, array, level, nId, pair) {

        if (parent_id == 1) {
            array = await connect.query("select * from " + prefix + "categories where parent_id=" + parent_id + " and path!='uncategorised'");
            await map(array, async (item, iter) => {
                nId = await this.createCategoryBuyJoomla(item, nId)
                pair.push({ jcat: item.id, cat: nId })
                return await this.prepareCategoryJsonBaseStruct(item.id, array[iter], level, nId, pair)
            })
        } else {
            array['children'] = await connect.query("select * from " + prefix + "categories where parent_id=" + parent_id);
            if (array['children'].length > 0) {
                level++
                await map(array['children'], async (item, iter) => {
                    nId = await this.createCategoryBuyJoomla(item, nId)
                    pair.push({ jcat: item.id, cat: nId })
                    return await this.prepareCategoryJsonBaseStruct(item.id, array['children'][iter], level, nId, pair)
                })
            }
        }

        return { array, pair };

    }


    async createCategoryBuyJoomla(jcat, nId) {

        var params = JSON.parse(jcat.params)

        var p = (jcat.path) ? jcat.path.replace('czas-emacypantek/', '') : null;

        var data = {
            name: jcat.title,
            alias: jcat.alias,
            path: p,
            image: "/" + params.image,
            intro: jcat.description,
            ordering: jcat.lft,
            categoryId: (jcat.parent_id == 35) ? null : nId
        }
        var c = await Category.create(data);
        return c.id;
    }


    async getMenuLinks(parent_id, i, array, menu, level, newParent) {


        // var res = await connect.query("select id,title,parent_id from v7ik1_menu where menutype='"+menu+"' and parent_id="+parent_id)

        if (parent_id == 1) {
            array = await connect.query("select * from " + prefix + "menu where menutype='" + menu + "' and parent_id=" + parent_id);
            // console.log(array)
            level++
            await map(array, async (item, iter) => {
                array[iter].linkData = this.parseLinkData(item.link)
                return await this.getMenuLinks(item.id, iter, array[iter], menu, level, newParent)
            })
        } else {
            array['children'] = await connect.query("select * from " + prefix + "menu where menutype='" + menu + "' and parent_id=" + parent_id);
            // console.log(array['children'].length)
            if (array['children'].length > 0) {
                // console.log(array['children'])
                level++
                await map(array['children'], async (item, iter) => {
                    array['children'][iter].linkData = this.parseLinkData(item.link)
                    return await this.getMenuLinks(item.id, iter, array['children'][iter], menu, level, newParent)
                })
            }
        }

        // await cache.set(menu, JSON.stringify(array))
        // cache.set(menu, JSON.stringify(array), function (error) {

        //     if (error) throw error;

        // })
        return array;


    }

    async getCreateMenuLinks(parent_id, i, array, menu, level, newParent) {


        // var res = await connect.query("select id,title,parent_id from v7ik1_menu where menutype='"+menu+"' and parent_id="+parent_id)
        // console.log(parent_id)

        if (parent_id == 1) {
            array = await connect.query("select * from " + prefix + "menu where menutype='" + menu + "' and parent_id=" + parent_id);
            // console.log(array)
            level++
            await map(array, async (item, iter) => {
                // array[iter].linkData = this.parseLinkData(item.link)
                newParent = await this.createFromJoomlaObjectLink(array[iter], newParent)
                return await this.getCreateMenuLinks(item.id, iter, array[iter], menu, level, newParent)
            })
        } else {
            array['children'] = await connect.query("select * from " + prefix + "menu where menutype='" + menu + "' and parent_id=" + parent_id);
            // console.log(array['children'].length)
            if (array['children'].length > 0) {
                // console.log(array['children'])
                level++
                await map(array['children'], async (item, iter) => {
                    // array['children'][iter].linkData = this.parseLinkData(item.link)
                    newParent = await this.createFromJoomlaObjectLink(array['children'][iter], newParent)
                    return await this.getCreateMenuLinks(item.id, iter, array['children'][iter], menu, level, newParent)
                })
            }
        }

        // await cache.set(menu, JSON.stringify(array))
        // cache.set(menu, JSON.stringify(array), function (error) {

        //     if (error) throw error;

        // })
        return array;


    }

    async getMenuTypes() {
        var menus = await connect.query("select * from " + prefix + "menu_types");
        return menus;
    }

    parseLinkData(link) {

        var sLink = link.split('&');

        var dataLink = {

        }

        if (sLink.length == 2) {

            dataLink.type = sLink[1].split("=")[1];

        } else if (sLink.length == 3) {

            dataLink.subView = null;
            dataLink.type = sLink[sLink.length - 2].split("=")[1]

        } else if (sLink.length == 4) {

            var subView = sLink[2].split('=')[1].split(':')[1];

            dataLink.subView = subView;
            dataLink.type = sLink[sLink.length - 3].split("=")[1] + ""

        }


        if (dataLink.type != 'featured' && dataLink.type != 'archive') {
            dataLink.id = sLink[sLink.length - 1].split("=")[1]
        } else {
            dataLink.id = null;
        }

        return dataLink;
    }


    async createMenuForLinks(menutype) {
        var menu = await connect.query("select * from " + prefix + "menu_types where menutype='" + menutype + "'");
        // console.log(menu[0])
    }

    async createFromJoomlaObjectLink(jlink, parentId) {
        // console.log(parentId)
        var nCID = null;
        var homePath = false;

        if (jlink && jlink.published == 1) {
            jlink.linkId = parentId;
            var dt = await this.parseJoomlaLinkForDataType(jlink.link)

            if (dt.cat) {
                nCID = this.findPair(dt.cat.id);
            }

            if (jlink.home == 1) {
                homePath = true;
            }

            var newL = {
                title: jlink.title,
                alias: jlink.alias,
                linkId: parentId,
                path: (homePath) ? '' : jlink.path,
                ordering: jlink.lft,
                dataType: (homePath) ? 'home' : dt.type,
                categoryId: nCID,
                articleId: (homePath) ? 5 : null,
                homeCategoriesArticles: (homePath) ? '[5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29]' : null
            }
            var l = await Link.create(newL)
            // console.log(l.title)
            return l.id;
        }
        return null;
    }


    findPair(jId) {
        var id = null;
        var pairs = fs.readFileSync(appDir + "/pairs.json");
        pairs = JSON.parse(pairs);

        pairs.forEach((item, i) => {
            // console.log(jId, item.cat)
            if (jId == item.jcat) {
                id = item.cat

            }
        })
        return id;
    }


    async parseJoomlaLinkForDataType(link) {
        var spl = link.split('&');
        var isCategory = false;
        var isArticle = false;
        var type = null;

        spl.forEach(element => {
            switch (element) {

                case 'view=categories':
                    isCategory = true;
                    type = 'categories'
                    break;

                case 'view=category':
                    isCategory = true;
                    type = 'category'
                    break;
                case 'view=article':
                    isArticle = true;
                    type = 'article'
                    break;
            }
        });

        if (isCategory) {
            // console.log(spl[spl.length - 1])
            var spCatId = spl[spl.length - 1].split('=')
            // console.log(spCatId)
            var cat = await connect.query("select * from " + prefix + "categories where id='" + spCatId[1] + "'");
            if (cat.length > 0) {
                return { cat: cat[0], article: null, type }
            }
        }

        if (isArticle) {
            // var spArtId = spl[spl.length - 1].split('=')
            // var art = await connect.query("select * from " + prefix + "content where id='" + spArtId[1] + "'");
            // if (art.length > 0) {
            //     return { cat: null, article: art[0], type };
            // }

        }


        return { cat: null, article: null, type };
    }




}


module.exports = new MysqlQueryImport();