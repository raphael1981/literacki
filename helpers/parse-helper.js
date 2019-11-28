const {
    map
} = require('p-iteration');
const Link = require('../models/index').Link;
const Category = require('../models/index').Category;
const Article = require('../models/index').Article;
const Sequelize = require('sequelize')
const paths = require('../paths')
const Op = Sequelize.Op;
const fs = require('fs');

class ParseHelper {
    static paramsToStringExcludeLast(params) {
        var str = '';
        var countP = 0;
        var obL = Object.keys(params).length
        Object.keys(params).forEach((k, i) => {
            if (params[k] != undefined) {
                if (i != (obL - 1))
                    str += params[k] + "/";

                countP++;
            }
        })
        return {
            countP: countP,
            path: str.slice(0, -1)
        };
    }

    static paramsToString(params) {
        var str = '';
        var countP = 0;
        Object.keys(params).forEach((k, i) => {
            if (params[k] != undefined) {
                str += params[k] + "/";
                countP++;
            }
        })
        return {
            countP: countP,
            path: str.slice(0, -1)
        };
    }

    static getCanonical(uri) {
        return uri.split('?')[0]
    }

    static makePathSign(path) {
        var ex = path.split('/');
        // console.log(ex)
        var sign = ex.join('#');
        // console.log(sign)
        return String(sign);
    }

    static convertSignToPath(sign) {
        var ex = sign.split('#');
        var path = ex.join('/');
        return path;
    }

    static replaceToCurrentActiveMenu(menu, path) {
        var sign = ParseHelper.makePathSign(path)
        // console.log(menu)
        menu = menu.replace('sign-' + sign, 'active');
        return menu;
    }


    async makeBreadcrumbsObject(params) {

        var array = [];

        var bElement = {}

        // console.log(Object.values(params))

        if (params.a) {
            bElement = await this.parseFirst(params, params.a);
            // console.log(bElement)
            array.push(bElement)
        }

        if (params.b) {
            bElement = await this.parseSecond(params, params.b, array[0]);
            // console.log(array[0])
            array.push(bElement)
        }

        if (params.c) {
            bElement = await this.parseThird(params, params.c, array[0], array[1]);
            // console.log(array[1])
            array.push(bElement)
        }


        return array

    }

    async parseFirst(params, p) {

        var d = await Link.findOne({
            where: {
                [Op.or]: [{
                    alias: p
                },
                {
                    path: p
                }
                ]
            }
        })

        if (d)
            return {
                d,
                type: 'link'
            };

        var a = await Article.findOne({
            where: {
                alias: p
            }
        })

        if (a)
            return {
                a,
                type: 'article'
            };

        var c = await Category.findOne({
            where: {
                [Op.or]: [{
                    alias: p
                },
                {
                    path: p
                }
                ]
            }
        })

        if (c)
            return {
                a,
                type: 'category'
            };

    }

    async parseSecond(params, p, b1) {

        var d = await Link.findOne({
            where: {
                [Op.or]: [{
                    alias: p
                },
                {
                    path: params.a + '/' + params.b
                }
                ]
            }
        })

        if (d)
            return {
                d,
                type: 'link'
            };

        if (b1) {

            if ((b1.type == 'link' || b1.type == 'category') && b1.type != 'article') {

                var cId = 0;

                if (b1.type == 'link')
                    cId = b1.d.categoryId

                if (b1.type == 'category')
                    cId = b1.d.id

                var a = await Article.findOne({
                    where: {
                        alias: p,
                        categoryId: cId
                    }
                })

                if (a)
                    return {
                        d: a,
                        type: 'article'
                    };
            }

            if (b1.type != 'article') {

                var c = await Category.findOne({
                    where: {
                        [Op.or]: [{
                            alias: p
                        },
                        {
                            path: params.a + '/' + params.b
                        }
                        ]
                    }
                })

                if (c)
                    return {
                        d: c,
                        type: 'category'
                    };

            }

        }

    }

    async parseThird(params, p, b1, b2) {

        // console.log(b2)

        var d = await Link.findOne({
            where: {
                [Op.or]: [{
                    alias: p
                },
                {
                    path: params.a + '/' + params.b + '/' + params.c
                }
                ]
            }
        })

        if (d)
            return {
                d,
                type: 'link'
            };


        if (b2) {

            if (b2.type == 'link' || b2.type == 'category')

                var a = await Article.findOne({
                    where: {
                        alias: p
                    }
                })



            if (a)
                return {
                    d: a,
                    type: 'article'
                };

            var c = await Category.findOne({
                where: {
                    [Op.or]: [{
                        alias: p
                    },
                    {
                        path: params.a + '/' + params.b + '/' + params.c
                    }
                    ]
                }
            })

            if (c)
                return {
                    d: a,
                    type: 'category'
                };

        }

    }


}

module.exports = ParseHelper;