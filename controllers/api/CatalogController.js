const Catalog = require("../../models/index").Catalog


class CatalogController {

    getCatalog(req, res) {
        Catalog.findOne({
            where: parseInt(req.params.id)
        }).then(c => {
            return res.json(c)
        })

    }

}

module.exports = new CatalogController()