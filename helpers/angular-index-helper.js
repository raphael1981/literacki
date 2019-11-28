const PathHelper = require('./paths-helper');
const paths = require('../paths')
const fs = require('fs');

class AngularIndexHelper {

    static createAngularIndexInDirectory(filename, destinationPath, catalogId, type, baseUrl, pathRel, html, isRelativePath) {
        var htmlContent = ''
        htmlContent = html.replace('<base href="/wyszukiwanie">', '<base href="/' + baseUrl + '">')
        if (isRelativePath) {
            htmlContent = htmlContent.replace('<link rel="stylesheet" href="', '<link rel="stylesheet" href="' + pathRel.prefix)
            htmlContent = htmlContent.replace(new RegExp('\<script type\=\"text\/javascript\" src\=\"', 'g'), '<script type="text/javascript" src="' + pathRel.prefix)
        }
        var newRoot = '<app-root viewType="' + type + '" '
        newRoot += (type == "catalog") ? 'catalogId="' + catalogId + '"' : ''
        newRoot += ' type="template"'

        htmlContent = htmlContent.replace('<app-root', newRoot)
        if (fs.existsSync(destinationPath + filename + '.html'))
            fs.unlinkSync(destinationPath + filename + '.html')
        htmlContent = fs.writeFileSync(destinationPath + filename + '.html', htmlContent)
    }

    static createAngularIndexInDirectoryMap(filename, destinationPath, type, baseUrl, pathRel, html, isRelativePath) {
        var htmlContent = ''
        // htmlContent = html.replace('<base href="/wyszukiwanie">', '<base href="/' + baseUrl + '">')
        htmlContent = html.replace('<base href="/wyszukiwanie">', '<base href="/">')
        if (isRelativePath) {
            htmlContent = htmlContent.replace('<link rel="stylesheet" href="', '<link rel="stylesheet" href="' + pathRel.prefix)
            htmlContent = htmlContent.replace(new RegExp('\<script type\=\"text\/javascript\" src\=\"', 'g'), '<script type="text/javascript" src="' + pathRel.prefix)
        }
        var newRoot = '<app-root viewType="' + type + '" '


        htmlContent = htmlContent.replace('<app-root', newRoot)
        if (fs.existsSync(destinationPath + filename + '.html'))
            fs.unlinkSync(destinationPath + filename + '.html')
        htmlContent = fs.writeFileSync(destinationPath + filename + '.html', htmlContent)
    }

}

module.exports = AngularIndexHelper