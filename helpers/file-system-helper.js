const {
    map
} = require('p-iteration');
const paths = require('../paths')
const fs = require('fs');
const PathHelper = require('./paths-helper');


class FileSystemHelper {

    static findRelativeFromRoutePath(path) {
        var array = path.split('/')
        if (array.length > 0) {
            if (array[0] == '') {
                return './'
            }

            var countRel = array.length;
            var pathPrefix = ''


            Array(countRel).fill(0).forEach(i => {
                pathPrefix += '../'
            })

            return pathPrefix;


        }
        return './'
    }

    static getPathRelativeData(path) {

        var array = path.split('/')
        var data = {}
        data.prefix = FileSystemHelper.findRelativeFromRoutePath(path)
        data.deepCount = array.length;

        return data;

    }


    static createFoldersFromArrayExceptLast(array, rootPath) {

        var pathsData = {
            rootPath,
            relative: ''
        }

        var lastKey = array.length - 1

        array.forEach((fl, i) => {

            if (i != lastKey) {
                pathsData.rootPath += '/' + fl
                pathsData.relative += (i != 0) ? '/' : '' + fl
                if (!fs.existsSync(pathsData.rootPath))
                    fs.mkdirSync(pathsData.rootPath)
            }

        })

        return pathsData;

    }


    static createFoldersFromArray(array, rootPath) {

        var pathsData = {
            rootPath,
            relative: ''
        }

        array.forEach((fl, i) => {

            pathsData.rootPath += '/' + fl
            pathsData.relative += (i != 0) ? '/' : '' + fl
            // console.log(paths.root + '/' + root)
            if (!fs.existsSync(pathsData.rootPath))
                fs.mkdirSync(pathsData.rootPath)


        })

        return pathsData;

    }

    static copyFilesFromTo(from, to) {

        var resourcesList = fs.readdirSync(PathHelper.pathGet(from), { withFileTypes: true })

        resourcesList.forEach(rel => {
            if (!rel.isDirectory()) {
                fs.copyFileSync(PathHelper.pathGet(from) + rel.name, PathHelper.pathGet(to) + rel.name)
            }
        })

    }

}

module.exports = FileSystemHelper