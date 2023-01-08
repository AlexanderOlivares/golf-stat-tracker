export function getNumeratorOfFairwaysHit(fairwaysHit: string){
    return Number(fairwaysHit.split("/")[0]);
}

export function getStatAverage(array: number[]){
    return array.reduce((a:number,c)=> a + Number(c), 0) / array.length
}
