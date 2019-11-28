const cache = require('../config/cache');

class HomeController {

    index(req, res) {

        return res.render('./views/home-page.pug', {
            title: '',
            menus: req.menus,
            slides: req.toView.slides,
            boxes: req.toView.boxes,
            homeArticle: req.toView.homeArticle,
            currentCatalog: req.toView.currentCatalog,
            partners: req.toView.partners,
            meta_desc: '',
            controller: '/controllers/home.controller.js'
        })


    }

}


module.exports = new HomeController()