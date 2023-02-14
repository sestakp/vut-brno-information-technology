/**
 * Author: Pavel Šesták
 */
export default function filterBase(records, filter){
     
    let prefiltered = [];
    //global filter
    if(filter.global !== ""){
    
        let val = filter.global.toString().toLowerCase();

        for (const [key, value] of Object.entries(filter)){            
            prefiltered = [...new Set([...prefiltered, ...records.filter(x => x[key]?.toString().toLowerCase().includes(val))])];
        }
    }
    else{
        prefiltered = records;
    }

    for (const [key, value] of Object.entries(filter)) {
        if(key === "global"){
            continue;
        }

        if(key === "only_valid"){
            if(value){
                prefiltered = prefiltered.filter(x => new Date(Date.parse(x.finish)) >= new Date())
            }
            continue;
        }

        if(value === "" || value === undefined) {continue;}

        let keys = key.split('.');
            
        
        let val = value.toString().toLowerCase();
        prefiltered = prefiltered.filter(x => 
            {
                var obj = x;
                var k = key;
                for(let i = 0; i < keys.length; i++){
                    k = keys[i];
                    obj = obj[k];
                }
                if(obj === null) { return false; }
                return obj.toString().toLowerCase().includes(val);
            })
    }
    
    return prefiltered;
}