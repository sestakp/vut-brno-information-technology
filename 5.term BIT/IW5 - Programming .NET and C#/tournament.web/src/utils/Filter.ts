export default function filterBase(records: any[], filter:any){
     
    let prefiltered:any[] = [];
    //global filter
    if(filter.global !== ""){
    
        let val = filter.global.toString().toLowerCase();
        for (const [key, value] of Object.entries(filter)) {
            
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
        if(value === "") {continue;}

        let val = (value as any).toString().toLowerCase();
        prefiltered = prefiltered.filter(x => x[key]?.toString().toLowerCase().includes(val));
    }
    
    return prefiltered;
}