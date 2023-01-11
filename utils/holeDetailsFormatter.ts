import { IScoreCountByName } from "../context/RoundContext";
import { IShotDetail } from "./roundFormatter";
import { NON_HOLE_ROWS } from "./scoreCardFormatter";

export function getNonParThreeIndices(parArray: string[], sliceStart: number, sliceEnd: number) {
  return parArray
    .map((par, i) => (Number(par) > 3 ? i : null))
    .slice(sliceStart, sliceEnd)
    .filter(index => index != null);
}

export function calculateFairwaysHit(
  shotDetails: IShotDetail[][],
  frontNineFairwayIndices: (number | null)[]
) {
  return shotDetails.filter((shotDetail: IShotDetail[], i) => {
    return shotDetail[0].result == "Hit Fairway" && frontNineFairwayIndices.includes(i);
  }).length;
}

export function calculateGreensInReg(
  shotDetails: IShotDetail[][],
  parArray: string[],
  sliceStart?: number,
  sliceEnd?: number
) {
  return shotDetails.slice(sliceStart, sliceEnd).filter((shotDetail: IShotDetail[], i) => {
    const frontOrBackParArray = parArray.slice(sliceStart, sliceEnd);
    const greenInRegShotNumber: number = Number(frontOrBackParArray[i]) - 2;
    return shotDetail.filter((shot: IShotDetail) => {
      return shot.shotNumber == greenInRegShotNumber && shot.result == "Hit Green";
    }).length;
  }).length;
}

export function calculateTotalPutts(
  shotDetails: IShotDetail[][],
  sliceStart?: number,
  sliceEnd?: number
) {
  return shotDetails.slice(sliceStart, sliceEnd).map((shotDetail: IShotDetail[], i) => {
    return shotDetail.filter((shot: IShotDetail) => {
      return shot.club === "Putter";
    }).length;
  });
}

export function sliceSum(arr: number[], start: number, end: number) {
  return arr.slice(start, end).reduce((a, c) => a + c, 0);
}

export function getScoreCountByName(holeScores: number[], parArray: string[]) {
    const scoreCount: IScoreCountByName = {
        ace: 0,
        albatross: 0,
        eagle: 0,
        birdie: 0,
        parCount: 0,
        bogey: 0,
        doubleBogey: 0,
        tripleBogey: 0,
        quadBogeyOrWorse: 0,
    }
    holeScores.forEach((score: number, i: number)=> {
        if (i in NON_HOLE_ROWS) return;
        const par = Number(parArray[i]);
        // par minus score is the amount of strokes away from par 
        const parMinusScore = par - score;

        if (parMinusScore === 0) {
            scoreCount.parCount++;
            return;
        }
        if (parMinusScore === 1) {
            scoreCount.birdie++;
            return;
        }

        if (parMinusScore === -1) {
            scoreCount.bogey++;
            return;
        }

        if (parMinusScore === -2) {
            scoreCount.doubleBogey++;
            return;
        }

        if (parMinusScore === -3) {
            scoreCount.tripleBogey++;
            return;
        }

        if (parMinusScore <= -4) {
            scoreCount.quadBogeyOrWorse++;
            return;
        }

        if (par === 3){
            if (parMinusScore === 2) scoreCount.ace++;
        }

        if (par === 4 || par === 5){
            if (parMinusScore === 2) scoreCount.eagle++;
            if (parMinusScore === 3) scoreCount.albatross++;
        }
    });
    return scoreCount;
};