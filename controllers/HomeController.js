const cache = require('../config/cache');

class HomeController {

    index(req, res) {

        return res.render('./views/home-page.pug', {
            title: '',
            menus: req.menus
        })


    }

}


module.exports = new HomeController()