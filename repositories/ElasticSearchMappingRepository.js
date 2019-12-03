const ElasticAdvancedSearchRepository = require('./ElasticAdvancedSearchRepository')
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

class ElasticSearchMappingRepository {

    async makeMappingsFromJson(indexName, indexFile) {

        var bodyIndex = await fs.readFileSync('../mappings/' + indexFile)
        bodyIndex = JSON.parse(bodyIndex)
        var existsBool = await client.indices.exists({
            index: indexName
        })

        if (existsBool.body) {
            await client.indices.delete({
                index: indexName
            })
        }

        await client.indices.create({
            index: indexName
        })


        var createResponse = await client.indices.putMapping({
            index: indexName,
            //for FreeBSD only
            // type: '_doc',
            body: {
                properties: bodyIndex
            }
        })

        await client.indices.putSettings({
            body: {
                "index.blocks.read_only_allow_delete": null
            }
        })

        return createResponse
    }

}


module.exports = new ElasticSearchMappingRepository()