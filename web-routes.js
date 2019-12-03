const router = require('express').Router();
const RouteParseRepository = require('./repositories/RouteParseRepository');
const HomeController = require('./controllers/HomeController');
const PageController = require('./controllers/PageController');

const Articlecontent = require('./models/index').Articlecontent
const Newspaperarticle = require('./models/index').Newspaperarticle
const Newspaper = require('./models/index').Newspaper
const Category = require('./models/index').Category
const Author = require('./models/index').Author
const Journalist = require('./models/index').Journalist
const Mediacategory = require('./models/index').Mediacategory
const Mediaresource = require('./models/index').Mediaresource
const Episode = require('./models/index').Episode
const Opus = require('./models/index').Opus
const Scenerio = require('./models/index').Scenerio
const Event = require('./models/index').Event
const Debate = require('./models/index').Debate
const Figure = require('./models/index').Figure

// router.get('/test', (req, res) => {
//   Journalist.findOne({ where: { id: 1 } }).then(jr => {
//     jr.getNewspaperarticles({
//       attributes: ['id', 'title', 'alias', 'image', 'smallDesc', 'longDesc'],
//       include: [
//         {
//           model: Debate,
//           as: "Debates",
//           where: {
//             id: 14
//           }
//         }
//       ],
//       distinct: true

//     }).then(n => {
//       return res.json(n)
//     })
//   })

// })



router.get('/', RouteParseRepository.homeParseData, RouteParseRepository.getCacheMenus, HomeController.index)
router.get('/:a/:b?/:c?/:d?', RouteParseRepository.parseUrl, RouteParseRepository.getResourcesFullData, RouteParseRepository.getCacheMenus, PageController.indexPage)



module.exports = router;