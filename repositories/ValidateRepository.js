const Article = require("../models/index").Article
const Category = require("../models/index").Category
var slug = require('slug')
const {
    map
} = require('p-iteration');

class ValidateRepository {


    checkIsAliasFree(req, res) {
        var data = req.body;
        var alias = slug(data.title, {
            lower: true
        })
        ValidateRepository.checkAliasDelegate(alias, data.type).then(b => {
            return res.json(b)
        })
    }

    checkIsAliasFreeExcept(req, res) {
        var data = req.body;
        var alias = slug(data.title, {
            lower: true
        })
        ValidateRepository.checkAliasDelegateExcept(alias, data.type, data.id).then(b => {
            return res.json(b)
        })
    }

    async checkIsArticleTitleChange(nTitle, artId) {
        var art = await Article.findOne({
            where: {
                id: artId
            }
        })

        return nTitle != art.title
    }

    async checkIsAliasFreeStatic(title, type) {
        var alias = slug(title, {
            lower: true
        })
        return await ValidateRepository.checkAliasDelegate(alias, type);
    }

    async checkIsAliasFreeExceptStatic(title, type, id) {
        var alias = slug(title, {
            lower: true
        })
        return await ValidateRepository.checkAliasDelegateExcept(alias, type, id);
    }

    static async checkAliasDelegate(alias, type) {
        var bool = true;
        switch (type) {
            case 'article':
                var bool = await ValidateRepository.checkArticleAlias(alias)
                break;

            case 'category':
                var bool = true;
                break;

        }
        return bool;
    }

    static async checkArticleAlias(alias) {
        var cnt = await Article.count({
            where: {
                alias: alias
            }
        })
        return cnt > 0;
    }


    static async checkAliasDelegateExcept(alias, type, id) {
        var bool = true;
        switch (type) {
            case 'article':
                var art = await Article.findOne({ where: { id } })
                var bool = await ValidateRepository.checkArticleAliasEx(alias, art.alias, id)
                break;

            case 'category':
                var cat = await Category.findOne({ where: { id } })
                var bool = await ValidateRepository.checkCategoryAliasEx(alias, cat.alias, id)
                break;

        }
        return bool;
    }


    static async checkArticleAliasEx(alias, old, id) {
        var cs = await Article.findAll({
            where: {
                alias: alias
            }
        })

        var fcs = cs.filter(a => a.id != id)

        return fcs.length > 0;
    }


    static async checkCategoryAliasEx(alias, old, id) {
        var cs = await Category.findAll({
            where: {
                alias: alias
            }
        })

        var fcs = cs.filter(a => a.id != id)

        return fcs.length > 0;
    }





}

module.exports = new ValidateRepository()