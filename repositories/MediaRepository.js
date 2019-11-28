const sizeOf = require('image-size');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

class MediaRepository {


    uploadImageIfExists(req, res, next) {

        const regex = /^data:((\w+)\/(\w+));base64,(.*)$/
        if (req.body.image != '' && regex.test(req.body.image)) {

            var date = new Date()
            var imageName = req.imageFor + '-' + date.getFullYear() + '' + date.getMonth() + '' + date.getDate() + '' + date.getHours() + '' + date.getMinutes() + '' + date.getSeconds() + '' + date.getMilliseconds() + ".jpg"
            var imgSource = req.body.image.match(regex)[4];
            if (!fs.existsSync('./static/images/uploads/' + req.body.folder)) {
                fs.mkdirSync('./static/images/uploads/' + req.body.folder)
            }
            var imageUri = '/images/uploads/' + req.body.folder + '/' + imageName;
            var b = fs.writeFileSync('./static' + imageUri, imgSource, {
                encoding: 'base64'
            })
            req.image = imageUri;
        } else {
            req.image = null;
        }
        next()

    }


    uploadFullImageIfExists(req, res, next) {

        const regex = /^data:((\w+)\/(\w+));base64,(.*)$/
        if (req.body.imageFull != '' && regex.test(req.body.imageFull)) {

            var date = new Date()
            var imageName = req.imageFor + '-' + date.getFullYear() + '' + date.getMonth() + '' + date.getDate() + '' + date.getHours() + '' + date.getMinutes() + '' + date.getSeconds() + '' + date.getMilliseconds() + ".jpg"
            var imgSource = req.body.imageFull.match(regex)[4];
            if (!fs.existsSync('./static/images/uploads/' + req.body.folder)) {
                fs.mkdirSync('./static/images/uploads/' + req.body.folder)
            }
            var imageUri = '/images/uploads/' + req.body.folder + '/' + imageName;
            var b = fs.writeFileSync('./static' + imageUri, imgSource, {
                encoding: 'base64'
            })
            req.fullImage = imageUri;
        } else {
            req.fullImage = null;
        }
        next()

    }

    uploadImageIntroIfExists(req, res, next) {

        // console.log(req.body.imageIntro)

        const regex = /^data:((\w+)\/(\w+));base64,(.*)$/
        if (req.body.imageIntro != '' && regex.test(req.body.imageIntro)) {

            var date = new Date()
            var imageName = req.imageFor + '-' + date.getFullYear() + '' + date.getMonth() + '' + date.getDate() + '' + date.getHours() + '' + date.getMinutes() + '' + date.getSeconds() + '' + date.getMilliseconds() + ".jpg"
            var imgSource = req.body.imageIntro.match(regex)[4];
            if (!fs.existsSync('./static/images/uploads/' + req.body.folder)) {
                fs.mkdirSync('./static/images/uploads/' + req.body.folder)
            }
            var imageUri = '/images/uploads/' + req.body.folder + '/' + imageName;
            var b = fs.writeFileSync('./static' + imageUri, imgSource, {
                encoding: 'base64'
            })
            req.introImage = imageUri;
        } else {
            req.introImage = null;
        }
        next()

    }


    beforePrepareDataToGallery(req, res, next) {
        var d = new Date();
        var folder = d.getFullYear() + '' +
            d.getMonth() + '' +
            d.getDate() + '' +
            d.getHours() + '' +
            d.getMinutes() + '' +
            d.getSeconds() + '' +
            d.getMilliseconds();

        req.galleryPath = './static/images/uploads/galleries/' + folder;
        req.images = [];
        next()
    }


    beforePrepareDataToFolder(req, res, next) {
        var d = new Date();
        var folder = d.getFullYear() + '' +
            d.getMonth() + '' +
            d.getDate() + '' +
            d.getHours() + '' +
            d.getMinutes() + '' +
            d.getSeconds() + '' +
            d.getMilliseconds();

        req.galleryPath = './static/images/uploads/' + req.params.folder;
        req.images = [];
        next()
    }


    afterUplaodGallery(req, res) {

        var images = Object.assign(req.images);
        var imagesPlus = [];

        images.forEach((element, i) => {
            var size = sizeOf('./static' + element.image);
            imagesPlus.push({
                image: element.image,
                imageThumb: element.imageThumb,
                imageDesc: element.imageDesc,
                dimensions: size,
                stringDimensions: size.width + "x" + size.height
            })

        });

        // console.log(imagesPlus)

        return res.json(imagesPlus)
    }

    afterUplaodFolder(req, res) {
        return res.json(req.images)
    }

    prepareImageStorageUpload() {


        var storage = multer.diskStorage({

            destination: function (req, file, cb, res) {

                if (!fs.existsSync(req.galleryPath)) {
                    fs.mkdirSync(req.galleryPath)
                }
                var minPath = req.galleryPath.replace('./', '')
                cb(null, minPath);

            },

            filename: function (req, file, cb, res) {
                var d = new Date();
                var name = file.fieldname + '-' +
                    d.getFullYear() + '' +
                    d.getMonth() + '' +
                    d.getDate() + '' +
                    d.getHours() + '' +
                    d.getMinutes() + '' +
                    d.getSeconds() + '' +
                    d.getMilliseconds() +
                    path.extname(file.originalname);
                var imageLink = req.galleryPath.replace('./static', '')
                cb(null, name);
                req.images.push({
                    image: imageLink + '/' + name,
                    imageThumb: imageLink + '/' + name,
                    imageDesc: ''
                })
                return name;
            }
        });

        var upload = multer({
            storage: storage
        });

        return upload;

    }

    prepareImageStorageSimpleUpload() {


        var storage = multer.diskStorage({

            destination: function (req, file, cb, res) {

                if (!fs.existsSync(req.galleryPath)) {
                    fs.mkdirSync(req.galleryPath)
                }
                var minPath = req.galleryPath.replace('./', '')
                cb(null, minPath);

            },

            filename: function (req, file, cb, res) {
                var d = new Date();
                var name = file.fieldname + '-' +
                    d.getFullYear() + '' +
                    d.getMonth() + '' +
                    d.getDate() + '' +
                    d.getHours() + '' +
                    d.getMinutes() + '' +
                    d.getSeconds() + '' +
                    d.getMilliseconds() +
                    path.extname(file.originalname);

                var imageLink = req.galleryPath.replace('./static', '')

                cb(null, name);

                req.images.push(imageLink + '/' + name)

                return name;
            }
        });

        var upload = multer({
            storage: storage
        });

        return upload;

    }

    getFolderFiles(req, res) {
        var files = []
        var folder = req.params.folder;
        fs.readdirSync('./static/images/uploads/' + folder).forEach(file => {
            files.push('/images/uploads/' + folder + '/' + file)
        })
        return res.json(files);
    }

    removeFile(req, res) {
        var file = req.body.file;
        var path = './static' + file;
        fs.unlinkSync(path)
        return res.json({
            success: true
        })
    }

}

module.exports = new MediaRepository()