
class ElasticSearchHelper {


    static makeDataFromMap(keys, values) {
        var array = []
        values.forEach(v => {
            var el = {}
            keys.forEach(k => {
                el[k] = v[k]
            })
            array.push(el)
        })

        return array;
    }

    static mergeContent(intro, content) {
        var str = '';

        if (intro) {
            str += intro.replace(/(<([^>]+)>)/ig, "");
        }
        if (content) {
            str += ' ' + content.replace(/(<([^>]+)>)/ig, "");
        }

        return str
    }


}

module.exports = ElasticSearchHelper;