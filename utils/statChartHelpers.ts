import { IRoundPreview } from "../pages/[username]/profile";

export function getNumeratorOfFairwaysHit(fairwaysHit: string){
    if (fairwaysHit == "--") return 0;
    return Number(fairwaysHit.split("/")[0]);
}

export function getStatAverage(array: number[]){
    const rawAvg = array.reduce((a:number,c)=> a + Number(c), 0) / array.length
    return Number(rawAvg.toFixed(2));
}

export function scoreCountByNameArray(roundPreviews: IRoundPreview[], pieStatKeys: (keyof IRoundPreview)[]){
    let dataArray = Array.from({ length: 9}, ()=> 0)
    let countByNameMap = new Map();
    roundPreviews.forEach((roundPreview: IRoundPreview) => {
        pieStatKeys.forEach((statKey)=> {
            if (roundPreview[statKey]){
                countByNameMap.set(statKey, countByNameMap.get(statKey) + roundPreview[statKey] || roundPreview[statKey]);
            }
        })
    })
    for (let [key, val] of countByNameMap.entries()){
        const targetIndex = pieStatKeys.indexOf(key);
         dataArray[targetIndex] = val;
    }
    return dataArray;
}