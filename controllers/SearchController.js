const CriteriaRepository = require('../repositories/CriteriaRepository');
const ElasticSearchRepository = require('../repositories/ElasticSearchRepository')
const indexName = 'wirtur';
const cache = require('../config/cache');
class SearchController {

    index(req, res) {

        ElasticSearchRepository.searchEvents(req.query, indexName).then(d => {
            return res.json(d)
        })

    }

    getCriteria(req, res) {

        // CriteriaRepository.getCriteria().then(cs => {
        //     return res.json(cs)
        // })

        cache.get('criteria', (err, value) => {
            return res.json(JSON.parse(value))
        })

    }

    cacheCriteria(req, res) {

        CriteriaRepository.getCriteria().then(cs => {
            cache.set('criteria', JSON.stringify(cs), 31536000, (err, value) => {
                return res.json(value)
            })
        })

    }
}


module.exports = new SearchController()