import { IRoundContext, IRoundState, IScoreCountByName } from "../context/RoundContext";
import { IShotDetail } from "./roundFormatter";
import { NON_HOLE_ROWS } from "./scoreCardFormatter";

export enum FrontBackOrTotal {
    FRONT = "front",
    BACK = "back",
    TOTAL = "total",
}

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


export function getFairwaysHit(roundContext: IRoundContext, frontBackOrTotal: FrontBackOrTotal) {
    const { par, holeShotDetails } = roundContext.state;
    const frontNineFairwayIndices = getNonParThreeIndices(par, 0, 9);
    const backNineFairwayIndices = getNonParThreeIndices(par, 10, 19);
    const totalFairways = frontNineFairwayIndices.length + backNineFairwayIndices.length;
    const frontFairwaysHit = calculateFairwaysHit(
        holeShotDetails,
        frontNineFairwayIndices
    );
    const backFairwaysHit = calculateFairwaysHit(
        holeShotDetails,
        backNineFairwayIndices
    );
    if (frontBackOrTotal == "front") return `${frontFairwaysHit}/${frontNineFairwayIndices.length}`;
    if (frontBackOrTotal == "back") return `${backFairwaysHit}/${backNineFairwayIndices.length}`;
    return `${frontFairwaysHit + backFairwaysHit}/${totalFairways}`;
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

export function getGreensInReg(roundContext: IRoundContext, frontBackOrTotal: FrontBackOrTotal) {
    const { holeShotDetails, par } = roundContext.state;
    if (frontBackOrTotal == "front") return calculateGreensInReg(holeShotDetails, par, 0, 9);
    if (frontBackOrTotal == "back") return calculateGreensInReg(holeShotDetails, par, 10, 19);
    return calculateGreensInReg(holeShotDetails, par);
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

export function getFrontBackOrTotalPutts(holeShotDetails: IShotDetail[][], frontBackOrTotal: FrontBackOrTotal) {
    const sum = (arr: number[]) => arr.reduce((a, c) => a + c, 0);
    if (frontBackOrTotal == "front") {
        const frontNinePutts = calculateTotalPutts(holeShotDetails, 0, 9);
        return sum(frontNinePutts);
    }
    if (frontBackOrTotal == "back") {
        const backNinePutts = calculateTotalPutts(holeShotDetails, 10, 19);
        return sum(backNinePutts);
    }
    const totalPutts = calculateTotalPutts(holeShotDetails);
    return sum(totalPutts);
}

export function calculateThreePutts(holeShotDetails: IShotDetail[][], frontBackOrTotal: FrontBackOrTotal) {
    const getThreePutts = (arr: number[]) => arr.filter(putts => putts > 2).length;
    if (frontBackOrTotal == "front") {
        const frontNinePutts = calculateTotalPutts(holeShotDetails, 0, 9);
        return getThreePutts(frontNinePutts);
    }
    if (frontBackOrTotal == "back") {
        const backNinePutts = calculateTotalPutts(holeShotDetails, 10, 19);
        return getThreePutts(backNinePutts);
    }
    const totalPutts = calculateTotalPutts(holeShotDetails);
    return getThreePutts(totalPutts);
}

export function sliceSum(arr: number[], start: number, end: number) {
    return arr.slice(start, end).reduce((a, c) => a + c, 0);
}

export function getScoreCountByName(holeScores: (number | null)[], parArray: string[]) {
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
    holeScores.forEach((score: number | null, i: number) => {
        if (!score || i in NON_HOLE_ROWS) return;
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

        if (par === 3) {
            if (parMinusScore === 2) scoreCount.ace++;
        }

        if (par === 4 || par === 5) {
            if (parMinusScore === 2) scoreCount.eagle++;
            if (parMinusScore === 3) scoreCount.albatross++;
        }
    });
    return scoreCount;
};

export function updatedHoleScoresContext(prevState: IRoundState, holeIndex: number, shotNumber: number) {
    const updatedScores = prevState.holeScores.map((existingScore: number, i: number) => {
        if (NON_HOLE_ROWS[i] == "out") {
            return sliceSum(prevState.holeScores, 0, 9);
        }
        if (NON_HOLE_ROWS[i] == "in") {
            return sliceSum(prevState.holeScores, 10, 19);
        }
        if (i in NON_HOLE_ROWS) {
            if (NON_HOLE_ROWS[i] == "total") {
                const frontNine = sliceSum(prevState.holeScores, 0, 9);
                const backNine = sliceSum(prevState.holeScores, 10, 19);
                return frontNine + backNine;
            }
        }
        if (i == holeIndex) return shotNumber;
        return existingScore;
    });
    return updatedScores;
};

export function updateStatTotals(roundContext: IRoundContext) {
    const { holeShotDetails } = roundContext.state;
    return holeShotDetails.map(
        (holeDetail: IShotDetail[], index: number) => {
            if (index === 9) {
                return [
                    {
                        fairwaysHit: getFairwaysHit(roundContext, FrontBackOrTotal.FRONT),
                        greensInReg: getGreensInReg(roundContext, FrontBackOrTotal.FRONT),
                        threePutts: calculateThreePutts(holeShotDetails, FrontBackOrTotal.FRONT),
                        totalPutts: getFrontBackOrTotalPutts(holeShotDetails, FrontBackOrTotal.FRONT),
                    },
                ];
            }
            if (index === 19) {
                return [
                    {
                        fairwaysHit: getFairwaysHit(roundContext, FrontBackOrTotal.BACK),
                        greensInReg: getGreensInReg(roundContext, FrontBackOrTotal.BACK),
                        threePutts: calculateThreePutts(holeShotDetails, FrontBackOrTotal.BACK),
                        totalPutts: getFrontBackOrTotalPutts(holeShotDetails, FrontBackOrTotal.BACK),
                    },
                ];
            }
            if (index === 20) {
                return [
                    {
                        fairwaysHit: getFairwaysHit(roundContext, FrontBackOrTotal.TOTAL),
                        greensInReg: getGreensInReg(roundContext, FrontBackOrTotal.TOTAL),
                        threePutts: calculateThreePutts(holeShotDetails, FrontBackOrTotal.TOTAL),
                        totalPutts: getFrontBackOrTotalPutts(holeShotDetails, FrontBackOrTotal.TOTAL),
                    },
                ];
            }
            return holeDetail;
        }
    );
}