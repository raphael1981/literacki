const ElasticAdvancedSearchRepository = require('./ElasticAdvancedSearchRepository')
const ElasticSearchHelper = require('../helpers/elastic-search-helper')
const Link = require('../models/index').Link;
const Articlecontent = require('../models/index').Articlecontent
const Newspaperarticle = require('../models/index').Newspaperarticle
const Newspaper = require('../models/index').Newspaper
const Category = require('../models/index').Category
const Author = require('../models/index').Author
const Journalist = require('../models/index').Journalist
const Mediacategory = require('../models/index').Mediacategory
const Mediaresource = require('../models/index').Mediaresource
const Episode = require('../models/index').Episode
const Opus = require('../models/index').Opus
const Scenerio = require('../models/index').Scenerio
const Event = require('../models/index').Event
const Debate = require('../models/index').Debate
const Figure = require('../models/index').Figure
var limit = require('../config/limit')
const {
    Client
} = require('@elastic/elasticsearch')
const esPort = require('../config/es-port')
const client = new Client({
    node: 'http://localhost:' + esPort
})
const {
    map
} = require('p-iteration');
var moment = require('moment');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const fs = require('fs')

class UrlResourcesSearchRepository {


    async parseUrlStart(path, countP, params, query) {

        var l = await Link.findOne({
            where: { path: path, status: 1 }
        })

        if (l) {
            return {
                searchFor: 'link',
                data: l
            };
        }

        var a = await this.parseFirstArgument(path, countP, params, query);

        if (a) {
            return a;
        }

        var b = await this.parseSecondArgument(path, countP, params, query);

        if (b) {
            return b;
        }


        var c = await this.parseThirdArgument(path, countP, params, query);

        if (c) {
            return c;
        }

        var d = await this.parseFourthArgument(path, countP, params, query);

        if (d) {
            return d;
        }

        return null;

    }



    async parseFirstArgument(path, countP, params, query) {

        return null;

    }



    async parseSecondArgument(path, countP, params, query) {

        return null;

    }


    async parseThirdArgument(path, countP, params, query) {


        return null;

    }


    async parseFourthArgument(path, countP, params, query) {

        return null;

    }





}

module.exports = new UrlResourcesSearchRepository();