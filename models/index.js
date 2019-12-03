const sequelize = require('../config/sequelize')
const User = require('./user')
const Link = require('./link')
const Menu = require('./menu')
const Episode = require('./episode')
const Section = require('./section');
const Newspaper = require('./newspaper')
const Debate = require('./debate')
const Newspaperarticle = require('./newspaper-article')
const Author = require('./author')
const Journalist = require('./journalist')
const Articlecontent = require('./article-content')
const Gallery = require('./gallery')
const Category = require('./category')
const Mediacategory = require('./media-category')
const Event = require('./event')
const Historicalevents = require('./historical-events')
const Opus = require('./opus')
const Mediaresource = require('./media-resource')
const Scenerio = require('./scenerio')
const Figure = require('./figure')

Link.belongsTo(Link)
Link.belongsTo(Section, {
    foreignKey: 'sectionId',
    constraints: false,
    as: 'section'
})
Link.belongsTo(Category, {
    foreignKey: 'categoryId',
    constraints: false,
    as: 'category'
})
Link.belongsTo(Newspaperarticle, {
    foreignKey: 'newspaperarticleId',
    constraints: false,
    as: 'newspaperarticle'
})
Link.belongsTo(Newspaper, {
    foreignKey: 'newspaperId',
    constraints: false,
    as: 'newspaper'
})
Link.belongsToMany(Menu, {
    as: 'Menus',
    through: 'link_menu',
    foreignKey: 'linkId'
})



Menu.belongsToMany(Link, {
    as: 'Links',
    through: 'link_menu',
    foreignKey: 'menuId'
})



Section.hasMany(Link)
Section.hasMany(Category)

Category.hasMany(Link)
Category.hasMany(Category)
Category.belongsTo(Category)
Category.hasMany(Event)
Category.hasMany(Episode)
Category.hasMany(Debate)
Category.hasMany(Figure)
Category.belongsTo(Section)
Category.belongsToMany(Articlecontent, {
    as: 'Articlecontents',
    through: 'category_articlecontent',
    foreignKey: 'categoryId'
})
Category.belongsToMany(Newspaperarticle, {
    as: 'Newspaperarticles',
    through: 'category_newspaperarticle',
    foreignKey: 'categoryId'
})
Category.belongsToMany(Newspaper, {
    as: 'Newspapers',
    through: 'category_newspaper',
    foreignKey: 'categoryId'
})


Mediacategory.hasMany(Mediacategory)
Mediacategory.hasMany(Newspaperarticle)
Mediacategory.belongsTo(Mediacategory)

Newspaper.hasMany(Link)
Newspaper.hasMany(Newspaperarticle)
Newspaper.hasMany(Debate)
Newspaper.hasMany(Figure)
Newspaper.belongsToMany(Category, {
    as: 'Categories',
    through: 'category_newspaper',
    foreignKey: 'newspaperId'
})

Debate.belongsTo(Newspaper)
Debate.belongsTo(Category)
Debate.belongsToMany(Newspaperarticle, {
    as: 'Newspaperarticles',
    through: 'debate_newspaperarticle',
    foreignKey: 'debateId'
})

Figure.belongsTo(Newspaper)
Figure.belongsTo(Author)
Figure.belongsTo(Journalist)
Figure.belongsTo(Category)
Figure.belongsToMany(Newspaperarticle, {
    as: 'Newspaperarticles',
    through: 'figure_newspaperarticle',
    foreignKey: 'figureId'
})

Newspaperarticle.hasMany(Gallery)
Newspaperarticle.belongsTo(Mediacategory)
Newspaperarticle.belongsTo(Newspaper)
Newspaperarticle.hasMany(Mediaresource)
Newspaperarticle.belongsTo(Journalist)
Newspaperarticle.belongsToMany(Category, {
    as: 'Categories',
    through: 'category_newspaperarticle',
    foreignKey: 'newspaperarticleId'
})
Newspaperarticle.belongsToMany(Debate, {
    as: 'Debates',
    through: 'debate_newspaperarticle',
    foreignKey: 'newspaperarticleId'
})
Newspaperarticle.belongsToMany(Figure, {
    as: 'Figures',
    through: 'figure_newspaperarticle',
    foreignKey: 'newspaperarticleId'
})
Newspaperarticle.belongsToMany(Historicalevents, {
    as: 'Historicalevents',
    through: 'historicalevent_newspaperarticle',
    foreignKey: 'newspaperarticleId'
})
Newspaperarticle.belongsToMany(Articlecontent, {
    as: 'Articlecontents',
    through: 'newspaperarticle_articlecontent',
    foreignKey: 'newspaperarticleId'
})
Newspaperarticle.belongsToMany(Author, {
    as: 'Authors',
    through: 'newspaperarticle_author',
    foreignKey: 'newspaperarticleId'
})
Newspaperarticle.belongsToMany(Episode, {
    as: 'Episodes',
    through: 'episode_newspaperarticle',
    foreignKey: 'newspaperarticleId'
})
Newspaperarticle.belongsToMany(Opus, {
    as: 'Opuses',
    through: 'opus_newspaperarticle',
    foreignKey: 'newspaperarticleId'
})


Episode.belongsTo(Category)
Episode.belongsTo(Journalist)
Episode.belongsToMany(Author, {
    as: 'Authors',
    through: 'episode_author',
    foreignKey: 'episodeId'
})
Episode.belongsToMany(Articlecontent, {
    as: 'Articlecontents',
    through: 'episode_articlecontent',
    foreignKey: 'episodeId'
})
Episode.belongsToMany(Newspaperarticle, {
    as: 'Newspaperarticles',
    through: 'episode_newspaperarticle',
    foreignKey: 'episodeId'
})

Author.hasMany(Opus)
Author.hasMany(Figure)
Author.belongsToMany(Episode, {
    as: 'Episodes',
    through: 'episode_author',
    foreignKey: 'authorId'
})
Author.belongsToMany(Newspaperarticle, {
    as: 'Newspaperarticles',
    through: 'newspaperarticle_author',
    foreignKey: 'authorId'
})
Author.belongsToMany(Articlecontent, {
    as: 'Articlecontents',
    through: 'articlecontent_author',
    foreignKey: 'authorId'
})

Journalist.hasMany(Articlecontent)
Journalist.hasMany(Newspaperarticle)
Journalist.hasMany(Episode)
Journalist.hasMany(Scenerio)
Journalist.hasMany(Figure)

Articlecontent.hasMany(Gallery)
Articlecontent.belongsTo(Journalist)
Articlecontent.belongsTo(Author)
Articlecontent.belongsTo(Category)
Articlecontent.hasMany(Mediaresource)
Articlecontent.belongsToMany(Historicalevents, {
    as: 'Historicalevents',
    through: 'historicalevent_articlecontent',
    foreignKey: 'articlecontentId'
})
Articlecontent.belongsToMany(Opus, {
    as: 'Opuses',
    through: 'opus_articlecontent',
    foreignKey: 'articlecontentId'
})
Articlecontent.belongsToMany(Newspaperarticle, {
    as: 'Newspaperarticles',
    through: 'newspaperarticle_articlecontent',
    foreignKey: 'articlecontentId'
})
Articlecontent.belongsToMany(Author, {
    as: 'Authors',
    through: 'articlecontent_author',
    foreignKey: 'articlecontentId'
})
Articlecontent.belongsToMany(Category, {
    as: 'Categories',
    through: 'category_articlecontent',
    foreignKey: 'articlecontentId'
})
Articlecontent.belongsToMany(Episode, {
    as: 'Episodes',
    through: 'episode_articlecontent',
    foreignKey: 'articlecontentId'
})


Gallery.belongsTo(Articlecontent)
Gallery.belongsTo(Newspaperarticle)

Event.belongsTo(Category)

Historicalevents.belongsToMany(Articlecontent, {
    as: 'Articlecontents',
    through: 'historicalevent_articlecontent',
    foreignKey: 'historicaleventsId'
})

Historicalevents.belongsToMany(Newspaperarticle, {
    as: 'Newspaperarticles',
    through: 'historicalevent_newspaperarticle',
    foreignKey: 'historicaleventsId'
})


Mediacategory.hasMany(Newspaperarticle)

Mediaresource.belongsTo(Newspaperarticle)
Mediaresource.belongsTo(Articlecontent)

Opus.belongsToMany(Articlecontent, {
    as: 'Articlecontents',
    through: 'opus_articlecontent',
    foreignKey: 'opusId'
})
Opus.belongsToMany(Newspaperarticle, {
    as: 'Newspaperarticles',
    through: 'opus_newspaperarticle',
    foreignKey: 'opusId'
})
Opus.hasMany(Scenerio)
Opus.belongsTo(Author)


Scenerio.belongsTo(Opus)
Scenerio.belongsTo(Journalist)

module.exports = {
    User,
    Link,
    Menu,
    Section,
    Newspaper,
    Newspaperarticle,
    Author,
    Articlecontent,
    Gallery,
    Category,
    Episode,
    Category,
    Mediacategory,
    Event,
    Opus,
    Scenerio,
    Mediaresource,
    Journalist,
    Historicalevents,
    Debate,
    Figure
}