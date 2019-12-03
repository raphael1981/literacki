const program = require('commander');
const faker = require('faker/locale/pl');
const fs = require('fs');
var moment = require('moment');
const sizeOf = require('image-size');
const paths = require('../paths')
const slug = require('slug')
const {
    map
} = require('p-iteration');

const sequelize = require('../config/sequelize')
const Link = require('../models/index').Link
const Menu = require('../models/index').Menu
const User = require('../models/index').User
const Section = require('../models/index').Section
const Category = require('../models/index').Category
const Newspaper = require('../models/index').Newspaper
const Newspaperarticle = require('../models/index').Newspaperarticle
const Author = require('../models/index').Author
const Journalist = require('../models/index').Journalist
const Articlecontent = require('../models/index').Articlecontent
const Gallery = require('../models/index').Gallery
const Episode = require('../models/index').Episode
const Mediacategory = require('../models/index').Mediacategory
const Event = require('../models/index').Event
const Mediaresource = require('../models/index').Mediaresource
const Scenerio = require('../models/index').Scenerio
const Opus = require('../models/index').Opus
const Debate = require('../models/index').Debate
const Figure = require('../models/index').Figure
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const MenuRepository = require('../repositories/MenuRepository')
const ElasticSearchRepository = require('../repositories/ElasticSearchRepository')
const ElasticSearchMappingRepository = require('../repositories/ElasticSearchMappingRepository')
const html2pug = require('html2pug')
const ParseHelper = require('../helpers/parse-helper')
const PathHelper = require('../helpers/paths-helper');
const FileSystemHelper = require('../helpers/file-system-helper')
const AngularIndexHelper = require('../helpers/angular-index-helper')

// var microGallery = [];

// var images = fs.readdirSync('../static/images/micro_gallery')
// images.forEach(img => {
//     var s = sizeOf('../static/images/micro_gallery/' + img);
//     microGallery.push({
//         image: '/images/micro_gallery/' + img,
//         width: s.width,
//         height: s.height,
//         sizeString: s.width + 'x' + s.height
//     })
// })

// console.log(microGallery)

program
    .command('sync-orm')
    .action(() => {

        sequelize.sync({
            force: true
        })
    })

program
    .command('create-users')
    .action(async () => {

    })

async function createSections() {
    var secs = fs.readFileSync(__dirname + '/sections.json');
    secs = JSON.parse(secs)
    return await Section.bulkCreate(secs)
}

program
    .command('create-sections')
    .action(async () => {
        createSections().then(r => {
            // console.log(r)
        })
    })

async function createCategory(fileName) {
    var cs = fs.readFileSync(__dirname + '/' + fileName);
    cs = JSON.parse(cs)
    return await Category.bulkCreate(cs)
}


program
    .command('create-categories')
    .action(async () => {
        createCategory('categories_newspaper.json').then(r1 => {
            createCategory('categories_program.json').then(r2 => {
                createCategory('categories_kanon.json').then(r3 => {

                })
            })
        })
    })


async function createLinks(fileName, j) {
    var lns = fs.readFileSync(__dirname + '/' + fileName);
    lns = JSON.parse(lns)
    await map(lns, async (l) => {
        j++
        l.ordering = j
        await Link.create(l)
    })

    return j
}

program
    .command('create-links')
    .action(async () => {
        createLinks('links.json', 0).then(i1 => {
            createLinks('links_newspaper.json', i1).then(i2 => {
                createLinks('links_program.json', i2).then(i3 => {
                    createLinks('links_kanon.json', i3).then(i4 => {

                    })
                })
            })
        })
    })

async function createRefsLinks(fileName, menuFile) {
    var mn = fs.readFileSync(__dirname + '/' + menuFile);
    var lns = fs.readFileSync(__dirname + '/' + fileName);
    mn = JSON.parse(mn)
    mn.linksJson = JSON.stringify(JSON.parse(lns))
    var menu = await Menu.create(mn)
    lns = JSON.parse(lns)
    await MenuRepository.createRefsFromArrayAddToMenu(lns, null, menu)
}

program
    .command('create-menus')
    .action(async () => {
        createRefsLinks('links_newspaper_tree.json', 'menu-newspaper.json').then(r1 => {
            createRefsLinks('links_program_tree.json', 'menu-kanon.json').then(r2 => {
                createRefsLinks('links_kanon_tree.json', 'menu-kanon.json').then(r3 => {

                })
            })
        })
    })


async function createJournalists() {

    await map(Array(60).fill(0), async (v, i) => {

        var name = faker.name.firstName();
        var surname = faker.name.lastName()
        var journalist = {
            name,
            surname,
            alias: slug(name + ' ' + surname + ' ' + i, {
                lower: true
            }),
            image: null,
            bio: faker.lorem.paragraphs(20)
        }

        await Journalist.create(journalist)

    })

}


program
    .command('create-journalists')
    .action(async () => {
        createJournalists().then(r => {

        })
    })

async function createAuthors() {
    var aus = fs.readFileSync(__dirname + '/authors.json');
    aus = JSON.parse(aus)
    await map(aus, async (a, i) => {
        var author = {
            name: a.name,
            surname: a.surname,
            alias: a.name + ' ' + a.surname + ' ' + i,
            image: a.image,
            bio: faker.lorem.sentence(200, 300),
            bornDate: a.bornDate,
            deathDate: a.deathDate,
            ordering: i + 1
        }
        await Author.create(author)
    })
}

program
    .command('create-authors')
    .action(async () => {
        createAuthors().then(r => {

        })
    })

async function createMediaCategory() {
    var mcs = fs.readFileSync(__dirname + '/media_categories.json');
    mcs = JSON.parse(mcs)
    await createMediaRequrce(mcs)
}

async function createMediaRequrce(array, parentId) {
    await map(array, async (mc) => {
        mc.mediacategoryId = parentId
        var nmc = await Mediacategory.create(mc)
        if (mc.children.length > 0) {
            return createMediaRequrce(mc.children, nmc.id)
        }
    })
}


program
    .command('create-media-category')
    .action(async () => {
        createMediaCategory().then((d) => {

        })
    })


async function createNewspaperarticles(newspaper, debate, figure) {

    var weekProfileCategory = await Category.findOne({
        where: {
            id: 2
        }
    })
    var debateCategory = await Category.findOne({
        where: {
            id: 1
        }
    })
    var mediaRecomendationCategory = await Category.findOne({
        where: {
            id: 3
        }
    })
    var journalists = await Journalist.findAll()
    var lastKeyJournalist = journalists.length - 1


    await map(Array(10).fill(0), async (v, i) => {

        var title = faker.lorem.sentence(4, 10)
        var newspaperarticle = {
            title,
            alias: slug(title, {
                lower: true
            }) + '-' + i,
            // newspaperarticleType: 'figure',
            smallDesc: faker.lorem.paragraphs(2),
            longDesc: faker.lorem.paragraphs(20),
            attachments: JSON.stringify([])
        }
        var nnpa = await Newspaperarticle.create(newspaperarticle)
        await newspaper.addNewspaperarticle(nnpa)
        await journalists[faker.random.number({
            min: 0,
            max: lastKeyJournalist
        })].addNewspaperarticle(nnpa)
        await weekProfileCategory.addFigure(figure)
        await figure.addNewspaperarticle(nnpa)

    })

    await map(Array(10).fill(0), async (v, i) => {

        var title = faker.lorem.sentence(4, 10)
        var newspaperarticle = {
            title,
            alias: slug(title, {
                lower: true
            }) + '-' + i,
            // newspaperarticleType: 'debate',
            smallDesc: faker.lorem.paragraphs(2),
            longDesc: faker.lorem.paragraphs(20),
            attachments: JSON.stringify([])
        }
        var nnpa = await Newspaperarticle.create(newspaperarticle)
        await newspaper.addNewspaperarticle(nnpa)
        await journalists[faker.random.number({
            min: 0,
            max: lastKeyJournalist
        })].addNewspaperarticle(nnpa)
        // await debateCategory.addNewspaperarticle(nnpa)
        await debateCategory.addDebate(debate)
        await debate.addNewspaperarticle(nnpa)


    })

    var mcRead = await Mediacategory.findAll({
        where: {
            mediacategoryId: 1
        }
    })
    var lastKeyRead = mcRead.length - 1
    await map(Array(20).fill(0), async (v, i) => {

        var keyRandom = faker.random.number(0, lastKeyRead)
        var title = faker.lorem.sentence(4, 10)
        var newspaperarticle = {
            title,
            alias: slug(title, {
                lower: true
            }) + '-' + i,
            // newspaperarticleType: 'mediaRecomendation',
            smallDesc: faker.lorem.paragraphs(2),
            longDesc: faker.lorem.paragraphs(20),
            attachments: JSON.stringify([])
        }
        var nnpa = await Newspaperarticle.create(newspaperarticle)
        await mcRead[keyRandom].addNewspaperarticle(nnpa)
        await newspaper.addNewspaperarticle(nnpa)
        await journalists[faker.random.number({
            min: 0,
            max: lastKeyJournalist
        })].addNewspaperarticle(nnpa)
        await mediaRecomendationCategory.addNewspaperarticle(nnpa)

    })

    var mcWatch = await Mediacategory.findAll({
        where: {
            MediaCategoryId: 2
        }
    })
    var lastKeyWatch = mcWatch.length - 1
    await map(Array(20).fill(0), async (v, i) => {

        var keyRandom = faker.random.number(0, lastKeyWatch)
        var title = faker.lorem.sentence(4, 10)
        var newspaperarticle = {
            title,
            alias: slug(title, {
                lower: true
            }) + '-' + i,
            // newspaperarticleType: 'mediaRecomendation',
            smallDesc: faker.lorem.paragraphs(2),
            longDesc: faker.lorem.paragraphs(20),
            attachments: JSON.stringify([])
        }
        var nnpa = await Newspaperarticle.create(newspaperarticle)
        await mcWatch[keyRandom].addNewspaperarticle(nnpa)
        await newspaper.addNewspaperarticle(nnpa)
        await journalists[faker.random.number({
            min: 0,
            max: lastKeyJournalist
        })].addNewspaperarticle(nnpa)
        await mediaRecomendationCategory.addNewspaperarticle(nnpa)

    })


    var mcListen = await Mediacategory.findAll({
        where: {
            MediaCategoryId: 3
        }
    })
    var lastKeyListen = mcListen.length - 1
    await map(Array(20).fill(0), async (v, i) => {

        var keyRandom = faker.random.number(0, lastKeyListen)
        var title = faker.lorem.sentence(4, 10)
        var newspaperarticle = {
            title,
            alias: slug(title, {
                lower: true
            }) + '-' + i,
            // newspaperarticleType: 'mediaRecomendation',
            smallDesc: faker.lorem.paragraphs(2),
            longDesc: faker.lorem.paragraphs(20),
            attachments: JSON.stringify([])
        }
        var nnpa = await Newspaperarticle.create(newspaperarticle)
        await mcListen[keyRandom].addNewspaperarticle(nnpa)
        await newspaper.addNewspaperarticle(nnpa)
        await journalists[faker.random.number({
            min: 0,
            max: lastKeyJournalist
        })].addNewspaperarticle(nnpa)
        await mediaRecomendationCategory.addNewspaperarticle(nnpa)


    })



}


async function createDebates(n) {
    var date = moment(n.releaseDate)
    date.add(1, 'h')
    date = date.format('YYYY-MM-DD HH:mm:ss')

    var title = faker.lorem.sentence(3, 10)
    var debate = {
        title,
        alias: slug(title + '-' + n.id, { lower: true }),
        image: '',
        smallDesc: faker.lorem.sentence(30, 50),
        longDesc: faker.lorem.sentence(10, 300),
        publishedAt: date
    }

    var d = await Debate.create(debate)
    await n.addDebate(d)

    return d

}

async function createFigures(n) {

    var authors = await Author.findAll()
    var auLastKey = authors.length - 1
    var journs = await Journalist.findAll()
    var joLastKey = journs.length - 1


    var types = ['author', 'journalist', 'any'];
    var date = moment(n.releaseDate)
    date.add(1, 'h')
    date = date.format('YYYY-MM-DD HH:mm:ss')

    var selectType = types[faker.random.number({ min: 0, max: 2 })]

    var title = faker.lorem.sentence(3, 10)
    var figure = {
        title,
        alias: slug(title + '-' + n.id, { lower: true }),
        image: '',
        smallDesc: faker.lorem.sentence(30, 50),
        longDesc: faker.lorem.sentence(10, 300),
        figureType: selectType,
        publishedAt: date
    }

    var f = await Figure.create(figure)

    switch (selectType) {
        case 'any':

            break;
        case 'journalist':

            var jo = journs[faker.random.number({ min: 0, max: joLastKey })]
            await jo.addFigure(f)

            break;

        case 'author':

            var au = authors[faker.random.number({ min: 0, max: auLastKey })]
            await au.addFigure(f)
            break;
    }

    await n.addFigure(f)

    return f

}


async function createNewspaper() {
    var start = moment([2019, 5, 3]);

    map(Array(20).fill(0), async (v, i) => {
        start = start.add(7, 'days')
        var newspaper = {
            title: 'Tygodnik ' + (i + 1),
            alias: slug('Tygodnik ' + (i + 1), {
                lower: true
            }),
            number: i + 1,
            releaseDate: start.format('YYYY-MM-DD')
        }
        var n = await Newspaper.create(newspaper)
        var d = await createDebates(n)
        var f = await createFigures(n)
        await n.setCategories(await Category.findAll({
            where: {
                categoryViewType: {
                    [Op.or]: ['debate', 'figure', 'recomendation']
                }
            }
        }))
        await createNewspaperarticles(n, d, f)

    })
}

program
    .command('create-newspapers')
    .action(async () => {
        createNewspaper().then(d => {

        })
    })

async function createEpisodes() {

    var categories = await Category.findAll({
        where: {
            categoryViewType: 'program'
        }
    })
    var journalists = await Journalist.findAll()
    var lastKeyJ = journalists.length - 1
    var lastKeyC = categories.length - 1
    var start = moment([2019, 5, 3]);

    var movies = [{
        type: 'local',
        path: '/movies/mis-woda-brzozowa.mp4'
    },
    {
        type: 'yt',
        path: '',
        ytId: 'SLFOunyoMFs'
    },
    {
        type: 'embed',
        path: '/movies/mis-woda-brzozowa.mp4'
    }
    ]

    await map(Array(80).fill(0), async (v, i) => {

        var c = categories[faker.random.number({
            min: 0,
            max: lastKeyC
        })]
        var j = journalists[faker.random.number({
            min: 0,
            max: lastKeyJ
        })]
        var ord = i + 1
        var name = faker.lorem.sentence(3, 10)
        start = start.add(1, 'days')
        var eps = {
            name: name,
            alias: slug(name, {
                lower: true
            }),
            image: null,
            smallDesc: faker.lorem.paragraph(2),
            longDesc: faker.lorem.paragraph(10),
            movie: JSON.stringify(movies[faker.random.number({
                min: 0,
                max: 2
            })]),
            ordering: ord,
            releaseDate: start.format('YYYY-MM-DD')
        }
        var epsObj = await Episode.create(eps)
        await c.addEpisode(epsObj)
        await j.addEpisode(epsObj)


    })
}

program
    .command('create-episodes')
    .action(async () => {
        createEpisodes().then(d => {

        })
    })

async function createArticles() {

    var cs = await Category.findAll({
        where: {
            categoryViewType: 'kanon_articles'
        }
    })
    var journalists = await Journalist.findAll({})
    var newspapersArts = await Newspaperarticle.findAll();
    var episodes = await Episode.findAll()
    var lastKey = cs.length - 1
    var lastKeyJournalist = journalists.length - 1
    var lastKeyNewsPaper = newspapersArts.length - 1
    var lastKeyEpisode = episodes.length - 1;

    await map(Array(900).fill(0), async (v, i) => {

        var c = cs[faker.random.number({
            nin: 0,
            max: lastKey
        })]
        var j = journalists[faker.random.number({
            nin: 0,
            max: lastKeyJournalist
        })]
        var nart = newspapersArts[faker.random.number({
            nin: 0,
            max: lastKeyNewsPaper
        })]
        var ep = episodes[faker.random.number({
            nin: 0,
            max: lastKeyEpisode
        })]
        var title = faker.lorem.sentence(2, 10)

        var art = {
            title,
            alias: slug(title, {
                lower: true
            }) + '-' + i,
            smallDesc: faker.lorem.sentence(30, 50),
            longDesc: faker.lorem.sentence(80, 300),
            attachments: JSON.stringify([]),
            ordering: i + 1
        }

        var artObj = await Articlecontent.create(art)
        await c.addArticlecontent(artObj)
        await j.addArticlecontent(artObj)
        await nart.addArticlecontent(artObj)
        await ep.addArticlecontent(artObj)


    })

}

program
    .command('create-articles')
    .action(async () => {
        createArticles().then(r => {

        })
    })


async function createOpus() {

    var authors = await Author.findAll()
    var lastAuthorKey = authors.length - 1
    var opusCount = authors.length * 10

    await map(Array(opusCount).fill(0), async (el, i) => {

        var au = authors[faker.random.number({
            min: 0,
            max: lastAuthorKey
        })]
        var title = faker.random.words(3)
        var ops = {
            title: title,
            alias: slug(title, {
                lower: true
            }) + '-' + i,
            description: faker.lorem.sentence(30, 90),
            opusType: 'book'
        }
        var opusOb = await Opus.create(ops)
        await au.addOpus(opusOb)
        await createOpusSecenerios(opusOb)
    })

}

async function createOpusSecenerios(opus) {

    await map(Array(12).fill(0), async (el, i) => {

        var title = faker.random.words(3)
        var sc = {
            title: title,
            alias: slug(title, {
                lower: true
            }) + '-' + i,
            file: '/lorem.pdf'
        }

        var scOb = await Scenerio.create(sc)
        opus.addScenerio(scOb)

    })

}






program
    .command('create-opus')
    .action(async () => {
        createOpus().then(r => {

        })
    })

async function createNewspaperarticlesAuthors() {
    var npas = await Newspaperarticle.findAll()
    var aus = await Author.findAll()
    var lastAuthorKey = aus.length - 1
    await map(npas, async (npa, i) => {

        var au = aus[faker.random.number({
            min: 0,
            max: lastAuthorKey
        })]
        npa.addAuthor(au)
        if (faker.random.boolean) {
            var au2 = aus[faker.random.number({
                min: 0,
                max: lastAuthorKey
            })]
            if (au.id != au2) {
                npa.addAuthor(au2)
            }
        }


    })
}

async function createArticlesAuthors() {
    var as = await Articlecontent.findAll()
    var aus = await Author.findAll()
    var lastAuthorKey = aus.length - 1
    await map(as, async (a, i) => {

        var au = aus[faker.random.number({
            min: 0,
            max: lastAuthorKey
        })]
        a.addAuthor(au)
        if (faker.random.boolean) {
            var au2 = aus[faker.random.number({
                min: 0,
                max: lastAuthorKey
            })]
            if (au.id != au2) {
                a.addAuthor(au2)
            }
        }


    })
}

async function createEpisodsAuthors() {

    var eps = await Episode.findAll()
    var aus = await Author.findAll()
    var lastAuthorKey = aus.length - 1
    await map(eps, async (e, i) => {

        var au = aus[faker.random.number({
            min: 0,
            max: lastAuthorKey
        })]
        e.addAuthor(au)
        if (faker.random.boolean) {
            var au2 = aus[faker.random.number({
                min: 0,
                max: lastAuthorKey
            })]
            if (au.id != au2) {
                e.addAuthor(au2)
            }
        }


    })

}

program
    .command('create-authors-relations')
    .action(async () => {
        createNewspaperarticlesAuthors().then(r1 => {
            createArticlesAuthors().then(r2 => {
                createEpisodsAuthors().then(r3 = {

                })
            })
        })
    })


program
    .command('make-index-articles')
    .action(() => {

        ElasticSearchMappingRepository.makeMappingsFromJson('articles', 'articles_any.json').then(r => {
            console.log(r)
        })

    })

program
    .command('index-articles-content <offset> <limit>')
    .action((offset, limit) => {
        //morfologik
        ElasticSearchRepository.indexContentArts('articles', { offset: parseInt(offset), limit: parseInt(limit) }).then(r => {
            console.log(offset, limit)
        })


    })

program
    .command('index-articles-news <offset> <limit>')
    .action((offset, limit) => {
        //morfologik

        ElasticSearchRepository.indexNewsArts('articles', { offset: parseInt(offset), limit: parseInt(limit) }).then(r => {
            console.log(offset, limit)
        })


    })


program
    .command('make-index-authors')
    .action(() => {

        ElasticSearchMappingRepository.makeMappingsFromJson('authors', 'authors.json').then(r => {
            console.log(r)
        })

    })

program
    .command('index-authors <offset> <limit>')
    .action((offset, limit) => {
        //morfologik

        ElasticSearchRepository.indexAuthors('authors', { offset: parseInt(offset), limit: parseInt(limit) }).then(r => {
            console.log(offset, limit)
        })


    })

program
    .command('make-index-journalists')
    .action(() => {

        ElasticSearchMappingRepository.makeMappingsFromJson('journalists', 'journalists.json').then(r => {
            console.log(r)
        })

    })

program
    .command('index-journalists <offset> <limit>')
    .action((offset, limit) => {
        //morfologik

        ElasticSearchRepository.indexAuthors('journalists', { offset: parseInt(offset), limit: parseInt(limit) }).then(r => {
            console.log(offset, limit)
        })


    })

program
    .command('make-index-newspapers')
    .action(() => {

        ElasticSearchMappingRepository.makeMappingsFromJson('newspapers', 'newspapers.json').then(r => {
            console.log(r)
        })

    })


program
    .command('index-newspapers <offset> <limit>')
    .action((offset, limit) => {
        //morfologik

        ElasticSearchRepository.indexNewspapers('newspapers', { offset: parseInt(offset), limit: parseInt(limit) }).then(r => {
            console.log(offset, limit)
        })


    })

program
    .command('make-index-debates')
    .action(() => {

        ElasticSearchMappingRepository.makeMappingsFromJson('debates', 'debates.json').then(r => {
            console.log(r)
        })

    })

program
    .command('index-debates <offset> <limit>')
    .action((offset, limit) => {
        //morfologik

        ElasticSearchRepository.indexDebates('debates', { offset: parseInt(offset), limit: parseInt(limit) }).then(r => {
            console.log(offset, limit)
        })


    })

program
    .command('make-index-figures')
    .action(() => {

        ElasticSearchMappingRepository.makeMappingsFromJson('figures', 'figures.json').then(r => {
            console.log(r)
        })

    })

program
    .command('index-figures <offset> <limit>')
    .action((offset, limit) => {
        //morfologik

        ElasticSearchRepository.indexFigures('figures', { offset: parseInt(offset), limit: parseInt(limit) }).then(r => {
            console.log(offset, limit)
        })


    })

// async function createCategoriesFormJson(json) {

//     var cats = JSON.parse(json)
//     return await Category.bulkCreate(cats);

// }

// program
//     .command('create-categories')
//     .action(() => {

//         var cats = fs.readFileSync('./categories.json')

//         createCategoriesFormJson(cats).then(r => {
//             // console.log(r)
//         })

//     })


// async function createPartnersFormJson(json) {

//     var ptns = JSON.parse(json)
//     return await Partner.bulkCreate(ptns);

// }

// program
//     .command('create-partners')
//     .action(() => {

//         var ptns = fs.readFileSync('./partners.json')

//         createPartnersFormJson(ptns).then(r => {
//             // console.log(r)
//         })

//     })


// async function createCatalogs() {
//     var cats = fs.readFileSync('./catalogs.json')
//     cats = JSON.parse(cats)
//     return await Catalog.bulkCreate(cats)
// }

// program
//     .command('create-catalogs')
//     .action(() => {

//         createCatalogs().then(d => {

//         })

//     })


// async function createArticles() {

//     var cats = await Category.findAll();
//     var lastK = cats.length - 1;

//     await map(Array(80).fill(0), async (v, i) => {

//         var t = faker.lorem.sentence(2, 3);

//         var art = await Article.create({
//             title: t,
//             alias: slug(t, { lower: true }),
//             image: '/images/default.jpg',
//             smallDesc: faker.lorem.sentence(60, 100),
//             longDesc: faker.lorem.sentence(300, 500)
//         })

//         cats[faker.random.number({ min: 0, max: lastK })].addArticle(art)

//     })

//     var countArts = await Article.count();
//     // console.log(countArts)
//     var id = faker.random.number({ min: 1, max: countArts });
//     // console.log(id)
//     await Article.update({ onHome: true }, { where: { id } });

// }

// async function makeHomeArticle() {
//     var countArts = await Article.count();
//     var id = faker.random.number({ min: 1, max: countArts });
//     await Article.update({ onHome: true }, { where: { id } });
// }

// program
//     .command('create-articles')
//     .action(() => {

//         createArticles().then((d) => {
//             makeHomeArticle()
//         })

//     })


// async function createFilters() {

//     await map(Array(20).fill(0), async (v, i) => {

//         var r = await Region.create({
//             name: faker.address.country()
//         })


//         await map(Array(10).fill(0), async (v2, i2) => {

//             var c = await City.create({
//                 name: faker.address.city()
//             })


//             r.addCity(c)

//             await map(Array(6).fill(0), async (v3, i3) => {

//                 var a = await Attraction.create({
//                     name: faker.commerce.productMaterial(),
//                     lat: faker.address.latitude(),
//                     lng: faker.address.longitude()
//                 })

//                 c.addAttraction(a)

//             })

//         })

//     })

//     var ages = fs.readFileSync(__dirname + '/ages.json');
//     var d = JSON.parse(ages)
//     await Age.bulkCreate(d)

//     await map(Array(30).fill(0), async (v, i) => {

//         Theme.create({
//             name: faker.commerce.color()
//         })

//     })

// }

// async function createFiltersMin() {

//     var attrTypes = ['any', 'park', 'muzeum', 'monument', 'sacral', 'nature', 'aqua']

//     await map(Array(20).fill(0), async (v, i) => {

//         var rname = faker.address.country() + ' ' + i

//         var r = await Region.create({
//             name: rname,
//             // alias: slug(rname, { lower: true }),
//             lat: faker.address.latitude(),
//             lng: faker.address.longitude()
//         })


//         await map(Array(4).fill(0), async (v2, i2) => {

//             var cname = faker.address.city() + ' ' + i2;

//             var c = await City.create({
//                 name: cname,
//                 // alias: slug(cname, { lower: true }),
//                 lat: faker.address.latitude(),
//                 lng: faker.address.longitude()
//             })


//             r.addCity(c)

//             await map(Array(6).fill(0), async (v3, i3) => {

//                 var aname = faker.commerce.productMaterial() + ' ' + i3;

//                 var a = await Attraction.create({
//                     name: aname,
//                     // alias: slug(aname, { lower: true }),
//                     lat: faker.address.latitude(),
//                     lng: faker.address.longitude(),
//                     attractionType: faker.random.number({ min: 0, max: attrTypes.length - 1 })
//                 })

//                 c.addAttraction(a)
//                 r.addAttraction(a)

//             })

//         })

//     })

//     var ages = fs.readFileSync(__dirname + '/ages.json');
//     var d = JSON.parse(ages)
//     await Age.bulkCreate(d)

//     await map(Array(30).fill(0), async (v, i) => {

//         var color = faker.commerce.color()

//         Theme.create({
//             name: color + i,
//             // alias: slug(color, { lower: true }) + i,
//         })

//     })

//     var days = [
//         1, 2, 3, 5, 7, 14
//     ]

//     await map(days, async (dn, i) => {
//         await Day.create({
//             daysNumber: dn
//         })
//     })
// }


// function createBruttoFromNettoTax(price) {

//     var percent = 21;
//     var tax = Math.ceil((percent / 100) * parseFloat(price))

//     return { pb: Math.ceil(parseFloat(price) + tax), tax: tax };

// }


// async function createEvents(microGallery) {


//     var microGallery = [{
//         image: '/images/micro_gallery/kolonie1.jpg',
//         width: 1000,
//         height: 1000,
//         sizeString: '1000x1000'
//     },
//     {
//         image: '/images/micro_gallery/kolonie13.jpg',
//         width: 1000,
//         height: 1000,
//         sizeString: '1000x1000'
//     },
//     {
//         image: '/images/micro_gallery/kolonie6.jpg',
//         width: 1000,
//         height: 1000,
//         sizeString: '1000x1000'
//     },
//     {
//         image: '/images/micro_gallery/kolonie7.jpg',
//         width: 1000,
//         height: 1000,
//         sizeString: '1000x1000'
//     }]


//     var eventsList = [];
//     var configPrice = [
//         {
//             "from": 5,
//             "to": 10,
//             "price": 300.20
//         },
//         {
//             "from": 11,
//             "to": 15,
//             "price": 240.20
//         },
//         {
//             "from": 16,
//             "to": 22,
//             "price": 200.20
//         },
//         {
//             "from": 23,
//             "to": 35,
//             "price": 170.20
//         },
//         {
//             "from": 36,
//             "to": 50,
//             "price": 110.20
//         }
//     ]
//     configPrice = JSON.stringify(configPrice);

//     await map(Array(100).fill(0), async (v, i) => {

//         var n = faker.lorem.sentence(3) + ` ${i}`;
//         var isPrice = false;
//         var pNetto = null;
//         var pBrutto = null;
//         var tax = null;
//         var eventType = 'template'
//         var st = null;
//         var end = null;
//         var daysTotal = null;
//         var eventSezonType = 'any';
//         var img = '/img/default-event-image.png';
//         if (faker.random.boolean()) {
//             img = '/images/default.jpg';
//         }

//         if (faker.random.boolean()) {

//             isPrice = true;
//             pNetto = faker.commerce.price()
//             var taxBrutto = createBruttoFromNettoTax(pNetto)
//             pBrutto = taxBrutto.pb;
//             tax = taxBrutto.tax;
//             eventType = 'organize'
//             daysTotal = faker.random.number({ min: 1, max: 14 })
//             st = (faker.random.boolean()) ? faker.date.future() : faker.date.past();
//             end = moment(st).add(daysTotal, 'day')

//             if (faker.random.boolean()) {
//                 eventSezonType = 'winter'
//             } else {
//                 eventSezonType = 'summer'
//             }

//         } else {


//             daysTotal = faker.random.number({ min: 1, max: 14 })
//             eventType = 'template'
//         }

//         configPrice = JSON.parse(JSON.stringify(configPrice));
//         var nrEv = (faker.random.boolean()) ? faker.date.future() : faker.date.past();

//         var ev = await Event.create({
//             number: 'NR' + i + '' + moment(nrEv).format('DDMMYYYY'),
//             name: n,
//             alias: slug(n, { lower: true }),
//             smallDesc: faker.lorem.sentence(80),
//             longDesc: faker.lorem.sentence(100),
//             priceNetto: pNetto,
//             priceBrutto: pBrutto,
//             tax: tax,
//             priceConfig: configPrice,
//             eventType: eventType,
//             eventSezonType,
//             microGallery: (true) ? JSON.stringify(microGallery) : JSON.stringify([]),
//             startAt: st,
//             endAt: end,
//             daysTotal: daysTotal,
//             status: (faker.random.boolean()) ? 'avl' : 'noavl',
//             image: img
//         })

//         eventsList.push(ev);


//         var ages = await Age.findAll({})

//         await map(ages, async (ag, ia) => {

//             if (faker.random.boolean()) {

//                 await ev.addAge(ag)

//             }

//         })



//         var thms = await Theme.findAll({})

//         await map(thms, async (tm, it) => {

//             if (faker.random.boolean()) {

//                 await ev.addTheme(tm)

//             }

//         })


//         var regs = await Region.findAll()

//         await map(regs, async (r, j) => {


//             if (faker.random.boolean()) {


//                 await ev.addRegion(r);


//                 var cs = await r.getCities()

//                 await map(cs, async (c, k) => {

//                     if (faker.random.boolean()) {

//                         await ev.addCity(c)

//                         var attrs = await c.getAttractions()


//                         await map(attrs, async (a, l) => {

//                             if (faker.random.boolean()) {

//                                 await ev.addAttraction(a)

//                             }

//                         })

//                     }

//                 })

//             }

//         })




//     })


// }


// async function createEventsMin() {


//     var microGallery = [{
//         image: '/images/micro_gallery/kolonie1.jpg',
//         width: 1000,
//         height: 1000,
//         sizeString: '1000x1000'
//     },
//     {
//         image: '/images/micro_gallery/kolonie13.jpg',
//         width: 1000,
//         height: 1000,
//         sizeString: '1000x1000'
//     },
//     {
//         image: '/images/micro_gallery/kolonie6.jpg',
//         width: 1000,
//         height: 1000,
//         sizeString: '1000x1000'
//     },
//     {
//         image: '/images/micro_gallery/kolonie7.jpg',
//         width: 1000,
//         height: 1000,
//         sizeString: '1000x1000'
//     }]


//     var eventsList = [];
//     var configPrice = [
//         {
//             "from": 5,
//             "to": 10,
//             "price": 300.20,
//             "days": 2
//         },
//         {
//             "from": 11,
//             "to": 15,
//             "price": 240.20,
//             "days": 2
//         },
//         {
//             "from": 16,
//             "to": 22,
//             "price": 200.20,
//             "days": 2
//         },
//         {
//             "from": 23,
//             "to": 35,
//             "price": 170.20,
//             "days": 2
//         },
//         {
//             "from": 36,
//             "to": 50,
//             "price": 110.20,
//             "days": 2
//         },
//         {
//             "from": 5,
//             "to": 10,
//             "price": 300.20,
//             "days": 3
//         },
//         {
//             "from": 11,
//             "to": 15,
//             "price": 240.20,
//             "days": 3
//         },
//         {
//             "from": 16,
//             "to": 22,
//             "price": 200.20,
//             "days": 3
//         },
//         {
//             "from": 23,
//             "to": 35,
//             "price": 170.20,
//             "days": 3
//         },
//         {
//             "from": 36,
//             "to": 50,
//             "price": 110.20,
//             "days": 3
//         }
//     ]
//     configPrice = JSON.stringify(configPrice);

//     await map(Array(200).fill(0), async (v, i) => {

//         var n = faker.lorem.sentence(3) + ` ${i}`;
//         var isPrice = false;
//         var pNetto = null;
//         var pBrutto = null;
//         var tax = null;
//         var eventType = 'template'
//         var st = null;
//         var end = null;
//         var daysTotal = null;
//         var eventSezonType = 'any';
//         var img = '/img/default-event-image.png';
//         if (faker.random.boolean()) {
//             img = '/images/default.jpg';
//         }

//         if (faker.random.boolean()) {

//             isPrice = true;
//             pNetto = faker.commerce.price()
//             var taxBrutto = createBruttoFromNettoTax(pNetto)
//             pBrutto = taxBrutto.pb;
//             tax = taxBrutto.tax;
//             eventType = 'organize'
//             st = (faker.random.boolean()) ? faker.date.future() : faker.date.past();
//             end = moment(st).add(daysTotal, 'day')

//             if (faker.random.boolean()) {
//                 eventSezonType = 'winter'
//             } else {
//                 eventSezonType = 'summer'
//             }

//         } else {


//             daysTotal = faker.random.number({ min: 1, max: 14 })
//             eventType = 'template'
//         }

//         configPrice = JSON.parse(JSON.stringify(configPrice));
//         var nrEv = (faker.random.boolean()) ? faker.date.future() : faker.date.past();

//         var ev = await Event.create({
//             number: 'NR' + i + '' + moment(nrEv).format('DDMMYYYY'),
//             name: n,
//             alias: slug(n, { lower: true }),
//             smallDesc: faker.lorem.sentence(80),
//             longDesc: faker.lorem.sentence(100),
//             priceNetto: pNetto,
//             priceBrutto: pBrutto,
//             tax: tax,
//             priceConfig: configPrice,
//             eventType: eventType,
//             eventSezonType,
//             microGallery: (true) ? JSON.stringify(microGallery) : JSON.stringify([]),
//             startAt: st,
//             endAt: end,
//             daysTotal: daysTotal,
//             status: (faker.random.boolean()) ? 'avl' : 'noavl',
//             image: img
//         })

//         eventsList.push(ev);


//         var ages = await Age.findAll({})

//         await map(ages, async (ag, ia) => {

//             if (faker.random.boolean()) {

//                 await ev.addAge(ag)

//             }

//         })



//         var thms = await Theme.findAll({})
//         var countTh = 0;

//         await map(thms, async (tm, it) => {

//             if (faker.random.boolean()) {

//                 if (countTh < 3) {

//                     await ev.addTheme(tm)

//                 }

//                 await countTh++;

//             }

//         })


//         var regs = await Region.findAll()
//         var countRegs = 0;

//         await map(regs, async (r, j) => {


//             if (faker.random.boolean()) {


//                 if (countRegs < 2) {
//                     await ev.addRegion(r);

//                     var cs = await r.getCities()
//                     var countCit = 0;

//                     await map(cs, async (c, k) => {

//                         if (faker.random.boolean()) {

//                             if (countCit < 3) {

//                                 await ev.addCity(c)

//                                 var attrs = await c.getAttractions()

//                                 var attrsCount = 0;

//                                 await map(attrs, async (a, l) => {

//                                     if (faker.random.boolean()) {

//                                         if (attrsCount < 5) {

//                                             await ev.addAttraction(a)

//                                         }

//                                         await attrsCount++

//                                     }

//                                 })

//                             }

//                         }

//                     })

//                     await countRegs++;

//                 }

//                 await countRegs++

//             }



//         })




//     })


// }



// async function addEventsToCatalog() {

//     var catalogs = await Catalog.findAll();
//     var eventsList = await Event.findAll()

//     await map(eventsList, async (ev, i) => {

//         var cNr = faker.random.number({ min: 0, max: catalogs.length - 1 })
//         await catalogs[cNr].addEvent(ev)

//     })

// }

// async function addEventsDays() {

//     var events = await Event.findAll()

//     var days = await Day.findAll();
//     var lastId = days.length - 1


//     await map(events, async (ev, i) => {

//         var fD1 = faker.random.number({ min: 1, max: lastId })
//         var fD2 = faker.random.number({ min: 1, max: lastId })
//         var d1 = await Day.findOne({ where: { id: fD1 } })
//         var d2 = await Day.findOne({ where: { id: fD2 } })

//         if (ev.eventType == 'template') {

//             await ev.addDay(d1)
//             await ev.addDay(d2)

//         } else {

//             await ev.addDay(d1)

//         }

//     })

// }

// program
//     .command('create-events')
//     .action(() => {

//         createFiltersMin().then((v) => {
//             createEventsMin().then(events => {

//             })
//         })


//     })


// program
//     .command('create-events-next')
//     .action(() => {


//         addEventsToCatalog().then((v) => {
//             addEventsDays().then(v => {

//             })
//         })


//     })




// program
//     .command('create-galleries')
//     .action(async () => {


//         var ages = fs.readFileSync(__dirname + '/galleries.json');
//         var d = JSON.parse(ages)
//         await Gallery.bulkCreate(d)


//     })






// async function createLinks() {

//     var links = fs.readFileSync('./links.json')
//     var ls = JSON.parse(links)

//     await map(ls, async (l, i) => {

//         await Link.create(l)

//     })

// }


// async function createMenu(fileMenu, fileLinks) {

//     var m = fs.readFileSync('./' + fileMenu)
//     var mJ = fs.readFileSync('./' + fileLinks)
//     var menu = JSON.parse(m)
//     var nMenu = Object.assign(menu);
//     nMenu[0].linksJson = JSON.stringify(JSON.parse(mJ));

//     var mn = await Menu.create(nMenu[0])

//     await map(JSON.parse(mJ), async (el) => {
//         var ln = await Link.findOne({ where: { id: el.id } })
//         await mn.addLink(ln)
//     });


// }

// program
//     .command('create-menu')
//     .action(() => {

//         createLinks().then((v) => {
//             createMenu('menu-left.json', 'links_json_left.json').then((v2) => {
//                 createMenu('menu-right.json', 'links_json_right.json').then(v3 => {
//                     createMenu('menu-bottom.json', 'links_json_bottom.json')
//                 })
//             })
//         })


//     })


// async function createSlides() {

//     var slides = fs.readFileSync('./slides.json');
//     var data = JSON.parse(slides);
//     await Slide.bulkCreate(data)

// }


// program
//     .command('create-slides')
//     .action(() => {

//         createSlides().then(d => {

//         })


//     })


// async function createHomePage() {

//     var slides = fs.readFileSync('./homepage.json');
//     var data = JSON.parse(slides);
//     await HomePage.bulkCreate(data)

// }


// program
//     .command('create-homepage')
//     .action(() => {

//         createHomePage().then(d => {

//         })


//     })


// program
//     .command('test')
//     .action(() => {

//         Newspaper.findOne({ where: { id: 1 } }).then(n => {
//             var date = moment(n.releaseDate)
//             date.add(1, 'h')
//             console.log(date.format('YYYY-MM-DD HH:mm:ss'))
//         })

//     })



// program
//     .command('make-events-index')
//     .action(() => {

//         ElasticSearchRepository.indexAllEvents('wirtur').then(result => {
//             console.log(result)
//         }).catch(err => {
//             console.log(err)
//         })

//     })

// program
//     .command('make-one-event-index')
//     .action(() => {

//         ElasticSearchRepository.putNewEvent(30, 'wirtur').then(result => {
//             console.log(result)
//         }).catch(err => {
//             console.log(err)
//         })

//     })

// program
//     .command('create-index-pug')
//     .action(() => {

//         const html = fs.readFileSync(paths.root + '/dist/browser/index.html').toString('utf8');
//         let pugCatalog = html2pug(html, { tabs: true });
//         pugCatalog = pugCatalog.replace('app-root', 'app-root(catalog=catalogId)')
//         pugCatalog = pugCatalog.replace('href=\'/wyszukiwanie\'', 'href=baseHref')
//         fs.writeFileSync(paths.root + '/dist/browser/catalog.pug', pugCatalog)


//     })


// async function makeFilesForAngularCatalogs() {

//     var filesList = []
//     var resourcesList = []

//     var html = fs.readFileSync(paths.root + '/dist/browser/index.html').toString('utf8');
//     resourcesList = fs.readdirSync(paths.root + '/dist/browser/', { withFileTypes: true })

//     var links = await Link.findAll({
//         where: {
//             dataType: 'catalog'
//         }
//     })


//     await map(links, async (l, i) => {
//         var baseUrl = l.path;
//         var filename = l.path.replace(new RegExp('\\/', 'g'), '-')
//         var pathRel = FileSystemHelper.getPathRelativeData(baseUrl)

//         var catalog = await l.getCatalog()

//         var folders = baseUrl.split('/')

//         if (folders.length > 1) {

//             var pathsScan = FileSystemHelper.createFoldersFromArrayExceptLast(folders, paths.root + '/dist/browser')
//             FileSystemHelper.copyFilesFromTo('dist/browser', 'dist/browser/' + pathsScan.relative)
//             AngularIndexHelper.createAngularIndexInDirectory('index', PathHelper.pathGet('dist/browser') + pathsScan.relative, catalog.id, 'catalog', baseUrl, pathRel, html, true)

//         }
//         AngularIndexHelper.createAngularIndexInDirectory(filename, PathHelper.pathGet('dist/browser'), catalog.id, 'catalog', baseUrl, pathRel, html, false)

//         filesList.push(filename + '.html')


//     })

//     var linksM = await Link.findAll({
//         where: {
//             dataType: 'map'
//         }
//     })

//     await map(linksM, async (l, i) => {

//         var baseUrl = l.path;
//         var filename = l.path.replace(new RegExp('\\/', 'g'), '-')
//         var pathRel = FileSystemHelper.getPathRelativeData(baseUrl)
//         var folders = baseUrl.split('/')

//         if (folders.length > 1) {

//             var pathsScan = FileSystemHelper.createFoldersFromArrayExceptLast(folders, paths.root + '/dist/browser')
//             FileSystemHelper.copyFilesFromTo('dist/browser', 'dist/browser/' + pathsScan.relative)
//             AngularIndexHelper.createAngularIndexInDirectoryMap('index', PathHelper.pathGet('dist/browser') + pathsScan.relative, catalog.id, 'map', baseUrl, pathRel, html, true)

//         }

//         AngularIndexHelper.createAngularIndexInDirectoryMap(filename, PathHelper.pathGet('dist/browser'), 'map', baseUrl, pathRel, html, false)


//         filesList.push(filename + '.html')

//     })


//     var catalogs = await Catalog.findAll()

//     await map(catalogs, async (c, i) => {
//         var htmlContent = ''
//         var baseUrl = c.alias;
//         var filename = c.alias
//         filesList.push(filename + '.html')
//         // htmlContent = html.replace('<base href="/wyszukiwanie">', '<base href="/' + baseUrl + '">')
//         // htmlContent = htmlContent.replace('<app-root></app-root>', '<app-root viewType="catalog" catalogId="' + c.id + '"></app-root>')
//         fs.writeFileSync(paths.root + '/dist/browser/' + filename + '.html', htmlContent)

//         AngularIndexHelper.createAngularIndexInDirectory(filename, PathHelper.pathGet('dist/browser'), c.id, 'catalog', baseUrl, null, html, false)
//     })

//     return { resourcesList, filesList }

// }

// program
//     .command('create-catalogs-index')
//     .action(() => {

//         makeFilesForAngularCatalogs().then(r => {
//             console.log(r)
//         })


//     })




program.parse(process.argv)