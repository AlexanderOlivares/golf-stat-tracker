import { NON_HOLE_ROWS } from "./scoreCardFormatter";


export interface IShotDetail {
  shotNumber?: number | null;
  distanceToPin?: number | null;
  club?: string | null;
  result?: string | null;
  fairwaysHit?: number | null,
  greensInReg?: number | null,
  threePutts?: number | null,
  totalPutts?: number | null,
}

export interface ISingleHoleDetail {
  score: number | null;
  details: IShotDetail[];
}

export function createHoleScoreArray() {
    return Array.from({ length: 25 }, () => null);
  }

export function createHoleDetailsJson() {
    const defaultShotDetails: IShotDetail[] = [
      {
        shotNumber: 1,
        distanceToPin: null,
        club: null,
        result: null,
      },
    ];
    const shotDetailsArray = Array.from({ length: 25 }, (_, i) => {
      if (i in NON_HOLE_ROWS) {
        if (i < 21) {
          const totalsShotDetail: IShotDetail[] = [
            {
              fairwaysHit: null,
              greensInReg: null,
              threePutts: null,
              totalPutts: null,
            },
          ];
          return totalsShotDetail;
        }
      }
      return defaultShotDetails;
    });
    return shotDetailsArray;
  }
