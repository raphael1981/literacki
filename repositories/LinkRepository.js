const MenuRepository = require("./MenuRepository")
var Link = require('../models/index').Link
var Menu = require('../models/index').Menu
const Content = require("../models/index").Content
const Category = require("../models/index").Category
const Gallery = require("../models/index").Gallery
const {
    map
} = require('p-iteration');
var slug = require('slug')
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const ParseHelper = require('../helpers/parse-helper')

class LinkRepository {

    async linkOrderReBuild(data) {

        await map(data.links, async (el, i) => {
            if (el.id != null) {
                var ToUpdate = await Link.findOne({ where: { id: el.id } });
                // console.log(ToUpdate)
                ToUpdate.ordering = i + 1;
                ToUpdate.save()
            } else {
                const newRecord = {
                    linkId: el.linkId,
                    title: el.title,
                    alias: slug(el.title, {
                        lower: true
                    }),
                    path: '',
                    dataType: 'article',
                    ordering: i
                }
                var link = await Link.create(newRecord)
                // var menu = await Menu(data.menu_id)
                var l = await Link.findOne({ where: { id: link.id } })

                // menu.addLinks([l],function(err) {
                //      console.log(err)
                // })

            }

            // console.log(ToUpdate.ordering,ToUpdate.title)
        })

    }

    async createNewLink(data) {
        console.log(data)
        var sl = slug(data.title, { lower: true })
        var path = await this.createPathForLink(sl, data.linkId, [])
        const newRecord = {
            linkId: data.linkId,
            title: data.title,
            alias: sl,
            path: path,
            dataType: 'blank',
            ordering: 1
        }
        var link = await Link.create(newRecord)
        // var menu = await Menu(data.menu_id)
        // var l = await Link(link.id)

        // menu.addLinks([l],function(err) {
        //      console.log(err)
        // })
    }

    async createPathForLink(alias, parentId, pathArray) {

        pathArray.push(alias);

        if (parentId) {
            var prn = await Link.findOne({ where: { id: parentId } });
            return this.createPathForLink(prn.alias, prn.linkId, pathArray)
        }
        pathArray.reverse()
        return pathArray.join('/');

    }

    //article,course,school,category,course-list

    async getLinksWithDataFull() {
        var ls = await Link.findAll()
        await map(ls, async (el, i) => {
            ls[i].dataValues.resource = await this.getLinkData(el.id)
        })
        return ls;
    }

    async getLinkData(id) {

        var l = await Link.findOne({
            where: {
                id
            },
            include: [
                {
                    model: Menu,
                    as: 'Menus'
                }
            ]
        })

        // var linkedMenus = await this.getMenusLinkedIfExits(l.linkedMenus)
        // l.dataValues.linkedMenus = linkedMenus;

        // console.log(l.dataType, l.id, l.articleId)

        switch (l.dataType) {

            case 'article':
                // console.log('zzz', l.dataType, l.id, l.articleId)
                var a = await l.getArticle();
                if (a) {
                    // var a = await Article.findOne({ where: { id: l.articleId } });

                    return {
                        type: 'article',
                        data: a,
                        link: l
                    }
                } else {

                    return {
                        type: 'article',
                        data: null,
                        link: l
                    }
                }
                break;


            case 'category':

                var c = await l.getCategory();

                if (c) {
                    // var c = await Category.findOne({ where: { id: l.categoryId } });
                    return {
                        type: 'category',
                        data: c,
                        link: l
                    }
                } else {
                    return {
                        type: 'category',
                        data: null,
                        link: l
                    }
                }
                break;

            case 'categories':

                var c = await l.getCategory();

                if (c) {
                    // var c = await Category.findOne({ where: { id: l.categoryId } });
                    return {
                        type: 'categories',
                        data: c,
                        link: l
                    }
                } else {
                    return {
                        type: 'categories',
                        data: null,
                        link: l
                    }
                }
                break;



            case 'external-link':
                return {
                    type: 'external-link',
                    data: c,
                    link: l
                }
                break;

            case 'contact':
                return {
                    type: 'contact',
                    data: null,
                    link: l
                }
                break;

            case 'blank':
                return {
                    type: 'blank',
                    data: null,
                    link: l
                }
                break;

            default:
                return {
                    type: '404',
                    data: null,
                    link: l
                }
                break;
        }

    }

    async getMenusLinkedIfExits(lm) {

        if (lm == null || lm == undefined) {
            return null;
        }
        var arr = JSON.parse(lm)
        var collect = []
        await map(arr, async (id) => {
            var m = await Menu.findOne({
                where: {
                    id
                }
            })
            m.linksJson = JSON.parse(m.linksJson)
            collect.push(m)
        })

        return collect;

    }

    async isPathExist(path, oldPath) {
        // console.log(oldPath)
        var l = await Link.findAll({
            where: {
                path: path
            }
        });

        if (l.length > 0) {

            var bool = false;

            await map(l, async link => {
                if (link.path == oldPath) {
                    bool = true;
                }
            })

            return {
                bool: bool,
                l: l
            }
        } else {
            return {
                bool: true
            }
        }

    }

    async updateLinkDataByType(data) {

        if (data.type == "external-link") {

            var l = await Link.findOne(
                {
                    where: { id: data.id },
                    include: {
                        model: Menu,
                        as: 'Menus'
                    }
                });
            l.title = data.title;
            l.title = slug(data.title, {
                lower: true
            });
            l.externalLink = data.externalLink;
            await l.save()

        } else {
            var l = await Link.findOne(
                {
                    where: { id: data.id },
                    include: {
                        model: Menu,
                        as: 'Menus'
                    }
                });

            l.title = data.title;
            l.alias = slug(data.title, {
                lower: true
            });
            // console.log('lsd', data.linkedMenus)
            l.path = data.path;
            l.view - data.view;
            l.metaDesc = data.metaDesc;
            l.metaKeywords = data.metaKeywords;
            l.metaTitle = data.metaTitle;
            l.linkedMenus = this.getOnlyMenusId(data.linkedMenus)
            l.view = data.view;
            await l.save()
            await l.setMenus([])
            // console.log(data.linkedMenus)
            await map(data.linkedMenus, async (m) => {
                var mn = await Menu.findOne({ where: { id: m.id } })
                await l.addMenu(mn)
            })
        }

        return l;

    }

    getOnlyMenusId(ms) {
        if (ms == null)
            return null;

        var collect = []
        ms.forEach(element => {
            collect.push(element.id)
        });
        // console.log(collect)
        return JSON.stringify(collect)
    }

    async updateLinkDataType(data) {

        var l = await Link.findOne({ where: { id: data.id } });

        // console.log(data.type)
        switch (data.type) {

            case 'article':

                l.articleId = data.data.id;
                l.dataType = 'article';
                await l.save();

                break;


            case 'category':
                l.categoryId = data.data.id;
                l.dataType = 'category';
                await l.save();
                break;

            case 'categories':
                l.categoryId = data.data.id;
                l.dataType = 'categories';
                await l.save();
                break;

            case 'contact':
                l.dataType = 'contact';
                await l.save();
                break;

            case 'external-link':
                // console.log(data)
                l.externalLink = data.data;
                l.dataType = 'external-link';
                await l.save();

                break;

            case 'blank':

                break;

            default:

                break;
        }

        return l;
    }


    async removeLinkTreeRefactor(data) {

        switch (data.action) {
            case 'ALL':
                var array = await this.recDeleteLinkAll(data.link, [])
                var ids = []
                array.forEach((c) => {
                    ids.push({ id: c.id })
                })
                // console.log(ids)
                await Link.destroy({ where: { [Op.or]: ids } })

                return ids;
                break;

            case 'ONE':
                return await this.recDeleteLinkOne(data.link)
                break;
        }

    }

    async recDeleteLinkAll(l, array) {

        var ln = await Link.findOne({ where: { id: l.id } })
        array.push(ln)
        var isChs = await LinkRepository.isHasChildren(ln.id)

        if (isChs) {

            var lns = await Link.findAll({ where: { linkId: ln.id } });

            await map(lns, async (link, i) => {
                return await this.recDeleteLinkAll(link, array)
            })

        }
        return array

    }

    async recDeleteLinkOne(l) {

        await Link.destroy({ where: { id: l.id } })

        var linkId = l.linkId;
        var isChs = await LinkRepository.isHasChildren(l.id)

        if (isChs) {
            var lns = await Link.findAll({ where: { linkId: l.id } });

            await map(lns, async (ln, i) => {
                await Link.update({ linkId }, { where: { id: cs.id } })
                return await this.recDeleteCategoryOne(ln)
            })

        }
        return l
    }

    static async isHasChildren(id) {
        var countCs = await Link.count({ where: { linkId: id } })
        return countCs > 0;
    }

}


module.exports = new LinkRepository();