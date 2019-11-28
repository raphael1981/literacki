const {
    map
} = require('p-iteration');
var Content = require('../models/index').Content;
var Category = require('../models/index').Category;
var Link = require('../models/index').Link;

class ContentHelper {

    async getContentRoute(content) {

        var linkTo = '/';
        var l = await Link.findAll({
            content_id: content.id
        })
        if (l.length > 0) {
            linkTo += l[0].path;
        } else {
            var c = await Category.findAll({
                id: content.category_id
            })
            if (c.length > 0) {
                linkTo += c.alias + "/" + content.alias;
            } else {
                linkTo += "content/" + content.alias;
            }

        }

        return linkTo;

    }

}

module.exports = new ContentHelper();