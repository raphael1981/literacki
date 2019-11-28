const Category = require("../../models/index").Category;
var slug = require('slug')
const cache = require('../../config/cache')
const CategoryRepository = require("../../repositories/CategoryRepository")
const ValidateRepository = require("../../repositories/ValidateRepository")

class CategoryController {

    getCategoryById(req, res) {
        Category.findOne({ where: { id: req.params.id } }).then((cat) => {
            return res.json(cat)
        })
    }

    getCategories(req, res) {
        Category.findAll().then((cs) => {
            return res.json(cs);
        })
    }

    getCategoryTree(req, res) {
        CategoryRepository.getTree().then(tree => {
            return res.json(tree)
        })
    }

    changeCategoryOrder(req, res) {
        CategoryRepository.categoryOrderReBuild(req.body).then(d => {
            return res.json(d)
        })

    }

    createNewCategory(req, res) {
        CategoryRepository.createCategoryCheckAliasOnLevel(req.body).then(d => {
            return res.json(req.body)
        })
    }

    deleteCategory(req, res) {
        CategoryRepository.deleteCategoryElement(req.body).then(d => {
            return res.json(d)
        })
    }

    updateCategory(req, res) {


        var category = req.body.category;
        var alias = slug(category.name, { lower: true })
        // return res.json(req.body.category)

        if (req.image) {
            category.image = req.image;
        }

        ValidateRepository.checkIsAliasFreeExceptStatic(alias, 'category', category.id).then(bool => {

            if (bool) {
                alias = alias + '-' + category.id
            }

            category.alias = alias

            Category.update(category, { where: { id: category.id } }).then(c => {
                return res.json({ success: true })
            })



        })


    }

}


module.exports = new CategoryController()