const sequelize = require('../config/sequelize')
const User = require('./user')
const Link = require('./link')
const Menu = require('./menu')
const Episode = require('./episode')
const Section = require('./section');
const NewsPaper = require('./newspaper')
const NewsPaperArticle = require('./newspaper-article')
const Author = require('./author')
const Articlecontent = require('./article-content')
const Gallery = require('./gallery')
const Category = require('./category')
const MediaCategory = require('./media-category')
const Event = require('./event')
const HistoricalEvents = require('./historical-events')
const Opus = require('./opus')
const Movie = require('./movie')
const Scenerio = require('./scenerio')

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
Link.belongsTo(NewsPaperArticle, {
    foreignKey: 'newspaperarticleId',
    constraints: false,
    as: 'newspaperarticle'
})
Link.belongsTo(NewsPaper, {
    foreignKey: 'newsPaperId',
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
Category.hasMany(Event)
Category.hasMany(NewsPaperArticle)
Category.hasMany(Episode)
// Category.hasMany(Article)
Category.belongsTo(Section)
Category.belongsTo(Category)
Category.belongsToMany(Articlecontent, {
    as: 'Articlecontents',
    through: 'category_articlecontent',
    foreignKey: 'categoryId'
})


MediaCategory.hasMany(MediaCategory)
MediaCategory.hasMany(NewsPaperArticle)
MediaCategory.belongsTo(MediaCategory)

NewsPaper.hasMany(NewsPaperArticle)
NewsPaper.belongsTo(Category)

NewsPaperArticle.hasMany(Gallery)
NewsPaperArticle.belongsTo(Category)
NewsPaperArticle.belongsTo(MediaCategory)
NewsPaperArticle.belongsTo(NewsPaper)
// NewsPaperArticle.belongsTo(Author)
NewsPaperArticle.belongsToMany(Articlecontent, {
    as: 'Articlecontents',
    through: 'newspaperarticle_articlecontent',
    foreignKey: 'newspaperarticleId'
})
NewsPaperArticle.belongsToMany(Author, {
    as: 'Authors',
    through: 'newspaperarticle_author',
    foreignKey: 'newspaperarticleId'
})


Episode.belongsTo(Category)
Episode.belongsTo(Author)
Episode.belongsToMany(Articlecontent, {
    as: 'Articlecontents',
    through: 'episode_articlecontent',
    foreignKey: 'episodeId'
})

Author.hasMany(Articlecontent)
// Author.hasMany(NewsPaperArticle)
Author.hasMany(Opus)
Author.hasMany(Episode)
Author.belongsToMany(NewsPaperArticle, {
    as: 'Newspaperarticles',
    through: 'newspaperarticle_author',
    foreignKey: 'authorId'
})

Articlecontent.hasMany(Gallery)
Articlecontent.belongsTo(Author)
Articlecontent.belongsTo(Category)
Articlecontent.belongsTo(HistoricalEvents)
Articlecontent.hasMany(Movie)
Articlecontent.hasMany(Opus)
Articlecontent.belongsToMany(NewsPaperArticle, {
    as: 'NewsPaperArticles',
    through: 'newspaperarticle_articlecontent',
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
Gallery.belongsTo(NewsPaperArticle)

Event.belongsTo(Category)

HistoricalEvents.hasMany(Articlecontent)

MediaCategory.hasMany(NewsPaperArticle)

Movie.belongsTo(Articlecontent)

Opus.belongsTo(Articlecontent)
Opus.hasMany(Scenerio)
Opus.belongsTo(Author)

Scenerio.belongsTo(Opus)

module.exports = {
    User,
    Link,
    Menu,
    Section,
    NewsPaper,
    NewsPaperArticle,
    Author,
    Articlecontent,
    Gallery,
    Category,
    Episode,
    Category,
    MediaCategory,
    Event,
    Opus,
    Scenerio,
    Movie
}