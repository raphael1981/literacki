const router = require('express').Router();

const LinksController = require("./controllers/api/LinksController")
const MenuController = require("./controllers/api/MenuController")
const SearchController = require("./controllers/SearchController")
const MediaRepository = require("./repositories/MediaRepository")


router.get('/search/index', SearchController.index)
router.get('/get/search/criteria', SearchController.getCriteria)
router.get('/cache/search/criteria', SearchController.cacheCriteria)
router.get('/get/cached/menu', MenuController.getCachedMenu)


router.get('/get/links/full/data', LinksController.getLinksListFullData)
router.get('/get/links', LinksController.getLinksList)
router.get('/get/links/tree', LinksController.getTree)
router.get('/get/menu/:id', MenuController.getMenu);
router.get('/get/menus/full', MenuController.getFullMenuListData)
router.get('/get/menus/flat/links', MenuController.getMenusFlatLinks)
router.get('/get/menu/links/:id', MenuController.getMenuLinks)
router.get('/get/menus/list', MenuController.getMenuList);
router.get('/get/link/resource/:id', LinksController.getLinkResource)
router.get('/get/data/resources', LinksController.getResourcesData)
router.put('/update/menu/field/:id', MenuController.updateMenuField)
router.post('/change/link/order', LinksController.changeLinksOrder)
router.post('/create/new/link', LinksController.createNewLink)
router.post('/check/is/link/path/free', LinksController.checkIsPathFree)
router.post('/delete/link/recfactor', LinksController.removeLinkRefactor)
router.post('/update/link/refactor/menus', LinksController.updateLinkData, LinksController.updateMenusAfterLinkChange)
router.post('/change/link/type', LinksController.linkUpdateType, LinksController.updateMenusAfterLinkChangeType)
router.post('/add/link/to/menu', MenuController.addLinkToMenu)
router.delete('/remove/link/:id', MenuController.linkRemoveFromJson, MenuController.removeLinkFromBase)
router.post('/menu/remove/link', MenuController.removeLinkFromMenu)
router.post('/menu/requre/cache/:id', MenuController.cacheMenu)
router.get('/menu/prepare/from/tree/:id', MenuController.prepareFromTree)








/*

var upload = MediaRepository.prepareImageStorageUpload();
router.post('/upload/gallery/images', MediaRepository.beforePrepareDataToGallery, upload.array('file'), MediaRepository.afterUplaodGallery)


*/












// router.get('/get/category/:id', CategoryController.getCategoryById)
// router.get('/get/categories', CategoryController.getCategories)


// router.post('/get/limit/contents', ContentController.getLimitContents)
// router.post('/update/content/data', MediaRepository.uploadImageIfExists, ContentController.updateContent)
// router.post('/create/content', MediaRepository.uploadImageIfExists, ContentController.createContent)
// router.delete('/delete/content/:id', ContentController.deleteContent)
// router.post('/change/content/status', ContentController.changeStatus)


// router.post('/get/limit/agendas', AgendaController.getLimitAgendas)
// router.post('/update/agenda/data', MediaRepository.uploadImagesAgIfExists, AgendaController.updateAgenda)
// router.post('/create/agenda', MediaRepository.uploadImagesAgIfExists, AgendaController.createAgenda)
// router.post('/change/agenda/status', AgendaController.changeStatus)
// router.delete('/delete/agenda/:id', AgendaController.deleteAgenda)

// router.get('/get/slides', SlidesController.getSlides)
// router.post('/slide/status/change', SlidesRepository.statusChange, SlidesController.getSlides)
// router.post('/slides/order/change', SlidesRepository.slidesOrderChange, SlidesController.getSlides)
// router.post('/create/slide', MediaRepository.uploadImageIfExists, SlidesController.createNewSlide);
// router.post('/update/slide', MediaRepository.uploadImageIfExists, SlidesController.updateSlide);
// router.delete('/delete/slide/:id', SlidesController.deleteSlide);


// router.get('/get/content/galleries/:id', GalleryController.getContentGalleries)
// router.get('/get/galleries', GalleryController.getGalleries)
// router.get('/get/galleries/by/phrase', GalleryController.getGalleriesByPhrase)
// router.get('/get/free/galleries', GalleryController.getFreeGalleries)
// var upload = MediaRepository.prepareImageStorageUpload();
// router.post('/upload/gallery/images', MediaRepository.beforePrepareDataToGallery, upload.array('file'), MediaRepository.afterUplaodGallery)
// router.post('/create/gallery', GalleryController.createGallery)
// router.post('/update/gallery', GalleryController.updateGallery)
// router.post('/set/gallery/to/content', GalleryController.setGalleryToContent)
// router.delete('/deatch/gallery/:id', GalleryController.detachGallery)
// router.get('/get/gallery/:id', GalleryController.getGallery)
// router.post('/change/gallery/status', GalleryController.changeStatus)
// router.delete('/delete/gallery/:id', GalleryController.deleteGallery)


// router.get('/get/resources/pack', ResourcesPackController.getResourcesPack)
// router.get('/get/home/resources/first', HomePageController.getHomePageResourceFirst)
// router.post('/update/first/homepage', HomePageController.updateFirstHomoPage)

// var uploadSimple = MediaRepository.prepareImageStorageSimpleUpload();
// router.post('/upload/simple/images/:folder', MediaRepository.beforePrepareDataToFolder, uploadSimple.array('file'), MediaRepository.afterUplaodFolder);

// router.get('/get/files/from/:folder', MediaRepository.getFolderFiles)
// router.post('/remove/file', MediaRepository.removeFile)

// router.post('/check/is/alias/free', ValidateRepository.checkIsAliasFree)
// router.post('/check/except/is/alias/free', ValidateRepository.checkIsAliasFreeExcept)



// router.post('/send/email', EmailController);


module.exports = router;