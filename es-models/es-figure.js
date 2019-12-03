const { Client } = require('@elastic/elasticsearch')
const esPort = require('../config/es-port')
const client = new Client({ node: 'http://localhost:' + esPort })
const {
    map
} = require('p-iteration');
var moment = require('moment');
const indexName = 'figures'


class EsFigure {
    async findFigureFirst(fid) {
        await client.indices.refresh({ index: indexName })
        const { body } = await client.search({
            index: indexName,
            body: {
                from: 0,
                size: 1,
                query: {
                    term: { fid: { value: fid } }
                }
            }
        })
        if (body.hits.total.value > 0) {
            return body.hits.hits[0]._source
        } else {
            return null
        }
    }
}

module.exports = new EsFigure()