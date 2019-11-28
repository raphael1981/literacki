var Link = require('../models/index').Link;
var Menu = require('../models/index').Menu;
var Article = require('../models/index').Article;
var Gallery = require('../models/index').Gallery;
var Category = require('../models/index').Category;
const arraySort = require('array-sort');
const slug = require('slug')
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const {
    map
} = require('p-iteration');



class CategoryRepository {

    async getTree() {

        var cats = await Category.findAll();
        var tree = this.sortRec(cats, null, []);
        return tree;

    }

    sortRec(cats, parent_id, array) {


        var toMap = this.findCategoryByIdInArray(parent_id, cats);


        if (toMap.length > 0) {

            toMap.forEach((el, i) => {


                if (el.categoryId == null) {

                    el.dataValues['children'] = []
                    array.push(el)
                    array[i].dataValues['children'] = this.setLastAndFirstSign(array[i].dataValues['children'])
                    return this.sortRec(cats, el.id, array[i].dataValues['children'], i)


                } else {

                    el.dataValues['children'] = []
                    array.push(el)
                    return this.sortRec(cats, el.id, array[i].dataValues['children'], i)



                }

            })

        }
        array = arraySort(array, 'ordering')
        return this.setLastAndFirstSign(array);
    }

    findCategoryByIdInArray(id, array) {

        var arr = [];

        array.forEach(el => {
            if (id == el.categoryId) {
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

    async categoryOrderReBuild(data) {

        await map(data.categories, async (el, i) => {
            if (el.id != null) {
                var ToUpdate = await Category.findOne({ where: { id: el.id } });
                // console.log(ToUpdate)
                ToUpdate.ordering = i + 1;
                ToUpdate.save()
            } else {

                var nalias = slug(el.name, {
                    lower: true
                })

                var isAliasExist = this.isCategoryAliasExitsOnLevel(nalias, data.categories)
                // console.log(isAliasExist)

                if (isAliasExist) {

                    const newRecord = {
                        categoryId: el.categoryId,
                        name: el.name,
                        path: '',
                        ordering: i
                    }
                    var category = await Category.create(newRecord)
                    category.alias = nalias + '-' + category.id;
                    await category.save()

                } else {

                    const newRecord = {
                        categoryId: el.categoryId,
                        name: el.name,
                        alias: nalias,
                        path: '',
                        ordering: i
                    }
                    var category = await Category.create(newRecord)

                }

            }
        })

        return data;

    }

    isCategoryAliasExitsOnLevel(alias, cats) {

        var exist = false;

        cats.forEach((c, i) => {
            if (c.alias == alias) {
                exist = true;
            }
        })

        return exist;
    }

    async createCategoryCheckAliasOnLevel(data) {

        var nalias = slug(data.name, {
            lower: true
        })

        var isAExist = await this.checkIsAliasOnLevelByParent(nalias, data.categoryId)

        var category = {
            name: data.name
        }

        if (isAExist) {

            var c = await Category.create({ name: data.name, categoryId: data.categoryId })
            nalias = nalias + '-' + c.id;
            var npath = await this.createPathForCategory(nalias, data.categoryId, [])
            c.alias = nalias;
            c.path = npath;
            c.save()

        } else {

            var npath = await this.createPathForCategory(nalias, data.categoryId, [])
            // console.log(npath)
            var c = await Category.create({ name: data.name, alias: nalias, categoryId: data.categoryId, path: npath })

        }

        return c;

    }


    async checkIsAliasOnLevelByParent(alias, parentId) {
        var cats = await Category.count(
            {
                where: {
                    categoryId: parentId,
                    alias
                }
            }
        )

        return cats > 0
    }

    async createPathForCategory(alias, parentId, pathArray) {

        pathArray.push(alias);

        if (parentId) {
            var prn = await Category.findOne({ where: { id: parentId } });
            return this.createPathForCategory(prn.alias, prn.categoryId, pathArray)
        }
        pathArray.reverse()
        return pathArray.join('/');

    }


    async deleteCategoryElement(data) {
        switch (data.action) {
            case 'ALL':
                var array = await this.recDeleteCategoryAll(data.category, [])
                var ids = []
                array.forEach((c) => {
                    ids.push({ id: c.id })
                })
                await Category.destroy({ where: { [Op.or]: ids } })

                return ids;
                break;

            case 'ONE':
                return await this.recDeleteCategoryOne(data.category)
                break;
        }
    }


    async recDeleteCategoryAll(c, array) {

        var c = await Category.findOne({ where: { id: c.id } })
        array.push(c)
        var isChs = await CategoryRepository.isHasChildren(c.id)

        if (isChs) {

            var cats = await Category.findAll({ where: { categoryId: c.id } });

            await map(cats, async (cs, i) => {
                return await this.recDeleteCategoryAll(cs, array)
            })

        }
        return array

    }

    async recDeleteCategoryOne(c) {

        await Category.destroy({ where: { id: c.id } })

        var categoryId = c.categoryId;
        var isChs = await CategoryRepository.isHasChildren(c.id)

        if (isChs) {
            var cats = await Category.findAll({ where: { categoryId: c.id } });

            await map(cats, async (cs, i) => {
                await Category.update({ categoryId: categoryId }, { where: { id: cs.id } })
                return await this.recDeleteCategoryOne(cs)
            })

        }
        return c
    }

    static async isHasChildren(id) {
        var countCs = await Category.count({ where: { categoryId: id } })
        return countCs > 0;
    }


}


module.exports = new CategoryRepository()