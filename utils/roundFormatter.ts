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


// export const userAddedRoundDetails = Array.from({ length: 25 }, () => {
//   const defaultShotDetails: IShotDetail[] = [
//     {
//       shotNumber: 1,
//       distanceToPin: null,
//       club: null,
//       result: null,
//     },
//   ];

//   const userAddedDetails: ISingleHoleDetail = {
//     score: null,
//     details: defaultShotDetails,
//   };

//   return userAddedDetails;
// });