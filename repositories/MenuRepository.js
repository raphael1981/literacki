const Menu = require("../models/index").Menu
const Link = require("../models/index").Link
const arraySort = require('array-sort');
const fs = require('fs');
const {
    map,
    forEach
} = require('p-iteration');
const ParseHelper = require('../helpers/parse-helper')

class MenuRepository {

    async getMenus() {

        var menus = await Menu.findAll();

        return await this.sortLinksMenu(menus);


    }


    async getMenusList() {

        var menus = await Menu.findAll();
        // menus.forEach((m, i) => {
        //     menus[i].linksJson = menus[i].linksJson
        // })
        return menus;

    }


    async getMenuLinksData(id) {
        var menu = await Menu.findOne({
            where: {
                id: id
            }
        });
        menu.linksJson = this.sortRec(await menu.getLinks(), null, [], 0)
        return menu;
    }


    async getLinksTree() {

        var lns = await Link.findAll()
        return this.sortRec(lns, null, [], 0)

    }


    async getLinksTreeMin() {

        var lns = await Link.findAll({
            order: [
                ['ordering', 'ASC']
            ]
        })
        return this.sortRecMin(lns, null, [], 0)

    }

    async addTreeToMenu(tree, mid) {

        var menu = await Menu.findOne({
            where: {
                id: mid
            }
        })
        var data = await this.walkRec(tree, menu)
        menu.linksJson = JSON.stringify(data.tree);
        return await menu.save();

    }


    async sortLinksMenu(menus) {

        var mns = Object.assign([], menus);


        await forEach(mns, async (el, i) => {

            mns[i].linksJson = this.sortRec(await el.getLinks(), null, [], 0)

        });

        return mns;

    }


    sortRec(lns, parent_id, array, x) {


        var toMap = this.findLinkByIdInArray(parent_id, lns);

        // console.log(parent_id)

        if (toMap.length > 0) {

            toMap.forEach((el, i) => {

                // console.log(el.linkId)

                if (el.linkId == null) {

                    el.dataValues['children'] = []
                    array.push(el)
                    // lns.splice(i,1);
                    array[i]['children'] = this.setLastAndFirstSign(array[i].dataValues['children'])
                    return this.sortRec(lns, el.id, array[i].dataValues['children'], i)


                } else {

                    el.dataValues['children'] = []
                    array.push(el)
                    // console.log(array)
                    // lns.splice(i,1); 
                    return this.sortRec(lns, el.id, array[i].dataValues['children'], i)



                }

            })

        }
        array = arraySort(array, 'ordering')
        return this.setLastAndFirstSign(array);
    }

    sortRecMin(lns, parent_id, array, x) {


        var toMap = this.findLinkByIdInArray(parent_id, lns);

        // console.log(parent_id)

        if (toMap.length > 0) {

            toMap.forEach((el, i) => {

                // console.log(el.linkId)

                if (el.linkId == null) {

                    var nEl = MenuRepository.filterLinkValues(el)
                    nEl['children'] = []
                    array.push(nEl)
                    // lns.splice(i,1);
                    return this.sortRecMin(lns, el.id, array[i]['children'], i)


                } else {
                    var nEl = MenuRepository.filterLinkValues(el)
                    nEl['children'] = []
                    array.push(nEl)
                    // console.log(array)
                    // lns.splice(i,1); 
                    return this.sortRecMin(lns, el.id, array[i]['children'], i)



                }

            })

        }
        array = arraySort(array, 'ordering')
        return array;
    }

    static filterLinkValues(l) {

        var nl = {
            id: l.id,
            title: l.title
        }


        return nl
    }

    findLinkByIdInArray(id, array) {

        var arr = [];

        array.forEach(el => {
            if (id == el.linkId) {
                arr.push(el)
            }
        })

        return arr;

    }

    setLastAndFirstSign(array) {

        var lng = array.length;

        array.map((el, i) => {
            if (i == 0) {
                array[i].dataValues.isFirst = true;
            } else {
                array[i].dataValues.isFirst = false;
            }
            if (i == (lng - 1)) {
                array[i].dataValues.isLast = true;
            } else {
                array[i].dataValues.isLast = false;
            }
        })

        return array;

    }


    async getMenusAndFlatLinks() {
        var menus = await Menu.findAll();
        // menus.forEach((m, i) => {
        //     menus[i].linksJson = JSON.parse(menus[i].linksJson)
        // })
        // await map(menus, async (el, i) => {

        //     var jsonMenu = await this.setJsonInMenu(el);
        //     menus[i].linksJson = JSON.parse(el.linksJson)

        // })

        return menus
    }


    async setJsonInMenu(el) {

        var m = await Menu.findOne({
            where: {
                id: el.id
            }
        })

        // el.links.map((l,i)=>{
        //     el.links[i]['children']=[]
        // })

        m.linksJson = JSON.stringify(await m.getLinks())
        await m.save()
        return m;



    }


    async recurranceMenuJsonUpdate(l, ms) {

        await map(ms, async (menu, i) => {


            var struct = this.changeJsonMenu(l, menu, menu.linksJson)
            var m = await Menu.findOne({
                where: {
                    id: ms[0].id
                }
            })
            m.linksJson = JSON.stringify(struct)
            await m.save()
            ms[i] = m;

        })
        return ms;
    }


    async recurranceMenuJsonUpdateType(l, ms) {

        // console.log(ms)

        if (ms) {
            await map(ms, async (menu, i) => {


                var struct = this.changeJsonMenuType(l, menu, menu.linksJson)
                var m = await Menu.findOne({
                    where: {
                        id: ms[0].id
                    }
                })
                m.linksJson = JSON.stringify(struct)
                await m.save()
                ms[i] = m;
            })
        }
        return ms;

    }


    changeJsonMenu(link, m, struct) {

        if (struct) {
            struct.forEach((el, i) => {

                if (el.id == link.id) {
                    // console.log(link.title)
                    var ch = el.children
                    struct[i].title = link.title;
                    struct[i].metaKeywords = link.metaKeywords;
                    struct[i].metaDesc = link.metaDesc;
                    struct[i].path = link.path;
                    struct[i].view = link.view;
                    struct[i].metaTitle = link.metaTitle;
                    struct[i].children = ch;
                    return struct;
                } else {
                    return this.changeJsonMenu(link, m, struct[i].children)
                }
            })

        }

        return struct;

    }


    changeJsonMenuType(link, m, struct) {

        if (struct) {
            struct.forEach((el, i) => {

                if (el.id == link.id) {
                    // console.log(link.title)
                    var ch = el.children
                    struct[i].categoryId = link.categorId;
                    struct[i].articleId = link.contentId;
                    struct[i].dataType = link.dataType;
                    struct[i].children = ch;
                    return struct;
                } else {
                    return this.changeJsonMenuType(link, m, struct[i].children)
                }
            })

        }

        return struct;

    }


    async addLinkToMenu(data) {

        var l = await Link.findOne({
            where: {
                id: data.link.id
            }
        })
        var m = await Menu.findOne({
            where: {
                id: data.menuId
            }
        })


        if (m.linksJson == null) {
            m.linksJson = []
        }

        if (m.all_linksJson == null) {
            m.all_linksJson = []
        }

        await m.addLinks([l]);

        m.linksJson = JSON.stringify(this.pushLinkToDataMenuJson(m.linksJson, l))
        m.all_linksJson = JSON.stringify(this.pushLinkToDataMenuJson(m.all_linksJson, l))

        await m.save()

        return m;

    }


    async addNewLinkToMenu(data, link) {


        var l = await Link.findOne({
            where: {
                id: data.link.id
            }
        })
        var m = await Menu.getAsync({
            where: {
                id: data.menuId
            }
        })


        if (m.linksJson == null) {
            m.linksJson = []
        }

        // await m.addLinks([l]);

        if (m.all_linksJson == null) {
            m.all_linksJson = []
        }


        m.linksJson = JSON.stringify(this.pushLinkToDataMenuJson(m.linksJson, l))
        m.all_linksJson = JSON.stringify(this.pushLinkToDataMenuJson(m.all_linksJson, l))

        await m.save()

        return m;

    }


    pushLinkToDataMenuJson(mj, l) {
        mj.push({
            id: l.id,
            title: l.title,
            children: []
        })
        return mj
    }

    async removeLinkFromJsons(id) {

        var menus = await Menu.findAll()

        await map(menus, async (m, i) => {

            var links_copy = Object.assign([], m.linksJson)
            var all_links_copy = Object.assign([], m.all_linksJson)
            var lns = this.removeLinkFromJsonIfExist(links_copy, id, [])
            var all_lns = all_links_copy.map(el => el.id != id)
            // await Menu(m.id).removeLink(id)
            var nm = await Menu.findOne({
                where: {
                    id: m.id
                }
            })
            nm.linksJson = JSON.stringify(lns)
            nm.all_linksJson = JSON.stringify(all_lns)
            await nm.save()

        })

        // console.log(menus[3].linksJson)

        return id;

    }


    async removeLinkFromOneMenuJson(id, menuId) {

        var m = await Menu.findOne({
            where: {
                id: menuId
            }
        })

        var links_copy = Object.assign([], m.linksJson)
        var all_links_copy = Object.assign([], m.all_linksJson)
        var lns = this.removeLinkFromJsonIfExist(links_copy, id, [])
        var all_lns = all_links_copy.filter(el => el.id != id)

        await m.removeLink(id)

        var nm = await Menu.findOne({
            where: {
                id: m.id
            }
        })
        nm.linksJson = JSON.stringify(lns)
        nm.all_linksJson = JSON.stringify(all_lns)
        await nm.save()

        return m;

    }



    removeLinkFromJsonIfExist(links, id, array) {



        links.forEach((l, i) => {

            if (l.id != id) {
                array[i] = l;
                array[i].children = this.removeLinkFromJsonIfExist(l.children, id, array[i].children).filter((el) => {
                    return el.id != id;
                });
            } else {

            }

        })


        // return array.filter(function(el) { return el; });
        return array.filter((el) => {
            return el.id != id;
        });;

    }


    async cacheMenuReqursive(id) {
        var menu = await Menu.findOne({
            where: {
                id: id
            }
        });
        var fullMenu = await this.prepareMenuBeforeHtml(menu.linksJson, []);
        var html = await this.prepareMenuHtml(fullMenu, '')
        return '<ul class="menu ' + menu.alias + '">' + html + '</ul>';
    }

    async cacheMenuReqursiveFromJson(json) {
        var menu = JSON.parse(json)
        var html = await this.prepareMenuHtml(menu, '')
        return '<ul class="menu">' + html + '</ul>';
    }


    async prepareMenuBeforeHtml(links) {

        await map(links, async (l, i) => {

            var getL = await Link.findOne({
                where: {
                    id: links[i].id
                }
            });
            if (getL) {
                links[i].path = getL.path;
                if (links[i].children.length > 0) {
                    links[i].children = await this.prepareMenuBeforeHtml(links[i].children)
                }
            }

        })

        return links;

    }


    prepareMenuHtml(links, htmlStr) {

        links.forEach((item, i) => {
            var sign = ParseHelper.makePathSign(item.path);
            if (item.path == '') {
                sign = 'home'
            }
            var classP = (item.children.length > 0) ? 'has-parent' : '';
            htmlStr += '<li class="' + classP + ' sign-' + sign + '"><a href="/' + item.path + '">' + item.title + '</a>';
            if (item.children.length > 0) {
                htmlStr += '<ul class="child-menu">' + this.prepareMenuHtml(item.children, '') + '</ul>';
            }
            htmlStr += '</li>'
        })

        return htmlStr;

    }



    async walkRec(tree, menu) {
        await map(tree, async (el) => {
            var l = await Link.findOne({
                where: {
                    id: el.id
                }
            })
            await menu.addLink(l)
            if (el.children.length > 0) {
                return this.walkRec(el.children, menu)
            }
        });

        return {
            tree,
            menu
        };
    }


    async createRefsFromArray(array, parentId) {
        await map(array, async (l) => {
            await Link.update({ linkId: parentId }, { where: { id: l.id } })
            if (l.children.length > 0) {
                await this.createRefsFromArray(l.children, l.id)
            }
        })
    }

    async createRefsFromArrayAddToMenu(array, parentId, menu) {
        await map(array, async (l) => {
            await Link.update({ linkId: parentId }, { where: { id: l.id } })
            var link = await Link.findOne({ where: { id: l.id } })
            await menu.addLink(link.id)
            if (l.children.length > 0) {
                return await this.createRefsFromArrayAddToMenu(l.children, l.id, menu)
            }
        })
    }


}

module.exports = new MenuRepository()