import { IShotDetail } from "./roundFormatter";

export function getNonParThreeIndices(parArray: string[], sliceStart: number, sliceEnd: number) {
  return parArray
    .map((par, i) => (Number(par) > 3 ? i : null))
    .slice(sliceStart, sliceEnd)
    .filter(index => index != null);
}

export function getFrontFairwaysHit(shotDetails: IShotDetail[][], frontNineFairwayIndices: (number|null)[]){
    return shotDetails.filter((shotDetail: IShotDetail[], i) => {
        return (
          shotDetail[0].result == "Hit Fairway" &&
          (frontNineFairwayIndices.includes(i))
        );
      }).length; 
}
