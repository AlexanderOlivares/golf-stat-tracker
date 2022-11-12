import { IShotDetail } from "./roundFormatter";

export function getNonParThreeIndices(parArray: string[], sliceStart: number, sliceEnd: number) {
  return parArray
    .map((par, i) => (Number(par) > 3 ? i : null))
    .slice(sliceStart, sliceEnd)
    .filter(index => index != null);
}

export function calculateFairwaysHit(shotDetails: IShotDetail[][], frontNineFairwayIndices: (number|null)[]){
    return shotDetails.filter((shotDetail: IShotDetail[], i) => {
        return (
          shotDetail[0].result == "Hit Fairway" &&
          (frontNineFairwayIndices.includes(i))
        );
      }).length; 
}

export function calculateGreensInReg(shotDetails: IShotDetail[][], parArray: string[], sliceStart?: number, sliceEnd?: number) {
    return shotDetails
      .slice(sliceStart, sliceEnd)
      .filter((shotDetail: IShotDetail[], i) => {
        const greenInRegShotNumber: number = Number(parArray[i]) - 2;
        return shotDetail.filter((shot: IShotDetail, i) => {
          return shot.shotNumber == greenInRegShotNumber && shot.result == "Hit Green";
        }).length;
      }).length;
  }


  export function calculateTotalPutts(shotDetails: IShotDetail[][], sliceStart?: number, sliceEnd?: number) {
    return shotDetails
      .slice(sliceStart, sliceEnd)
      .map((shotDetail: IShotDetail[], i) => {
        return shotDetail.filter((shot: IShotDetail, i) => {
          return shot.club === "Putter"
        }).length
      })
  }