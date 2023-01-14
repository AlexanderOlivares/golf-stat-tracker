export function getNumeratorOfFairwaysHit(fairwaysHit: string){
    if (fairwaysHit == "--") return 0;
    return Number(fairwaysHit.split("/")[0]);
}

export function getStatAverage(array: number[]){
    const rawAvg = array.reduce((a:number,c)=> a + Number(c), 0) / array.length
    return Number(rawAvg.toFixed(2));
}
