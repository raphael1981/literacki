const ElasticAdvancedSearchRepository = require('./ElasticAdvancedSearchRepository')
const ElasticSearchHelper = require('../helpers/elastic-search-helper')
const ElasticSearchHelperFiguresRepository = require('./ElasticSearchFiguresRepository')
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

class ResourceToViewRepository {

    async selectMyResourceType(d, q) {

        switch (d.searchFor) {

            case 'link':

                return await this.withLinkResource(d.data, q);

                break;


        }
    }


    async withLinkResource(l, q) {


        switch (l.dataType) {

            case 'section_newspaper':

                break;
            case 'category_debate':

                break;
            case 'category_figure':

                var data = await ElasticSearchHelperFiguresRepository.findCurrentFigure()
                if (data) {
                    return data
                }

                break;
            case 'category_recomendations':

                break;
            case 'section_program':

                break;
            case 'category_program':

                break;
            case 'section_kanon':

                break;
            case 'category_intro':

                break;
            case 'category_articles_series':

                break;
            case 'category_articles_single':

                break;
            case 'category_authors':

                break;
            case 'category_scenerio_index':

                break;
            case 'category_events':

                break;
            case 'custom_view':

                break;

        }

    }


}

module.exports = new ResourceToViewRepository();