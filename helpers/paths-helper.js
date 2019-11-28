const paths = require('../paths')

class PathHelper {

    static pathGet(string) {

        return paths.root + '/' + string + '/'
    }

}

module.exports = PathHelper;