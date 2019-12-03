const { Client } = require('@elastic/elasticsearch')
const esindex = require('../../es-models/index')
const esPort = require('../../config/es-port')
const client = new Client({ node: 'http://localhost:' + esPort })
const {
    map
} = require('p-iteration');
var moment = require('moment');
const indexName = 'figures';

class EsQueryFigureRepository {



}

module.exports = new EsQueryFigureRepository()