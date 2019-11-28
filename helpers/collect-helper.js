const { map } = require('p-iteration');

class CollectHelper{

    checkArrayLevelChildren(array){
        var level = 1;
        return this.makeIterateMap(array,level);
    }

    makeIterateMap(array,level){

        array.forEach(element => {
            if(element.children.length>0){
                level++;
                level = this.makeIterateMap(element.children,level)
            }
        });

        return level;

    }

    filterJsonLinksData(struct,array){
        struct.forEach((item,i)=>{
            array[i] = {id:item.id,title:item.title,children:[]}
            if(item.children){
                array[i]['children'] = this.filterJsonLinksData(item.children,array[i]['children'])
            }
        })
        return array;
    }

}


module.exports = new CollectHelper()