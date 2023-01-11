import { getScoreCountByName } from "../utils/holeDetailsFormatter";
import { IShotDetail } from "../utils/roundFormatter";

// TODO 
test("Should return count of scores by name like par, birdie etc.", () => {
  const holeShotDetails: IShotDetail[][] = [
    [
      { shotNumber: 1, distanceToPin: 289, club: "8 iron", result: "Hit Fairway" },
      { shotNumber: 2, distanceToPin: 140, club: "9 iron", result: "Mishit" },
      { shotNumber: 3, distanceToPin: 85, club: "Pitching Wedge", result: "Miss Left" },
      { shotNumber: 4, distanceToPin: 35, club: "Pitching Wedge", result: "Miss Long" },
      { shotNumber: 5, distanceToPin: 35, club: "56 degree", result: "Miss Long" },
      { shotNumber: 6, distanceToPin: 10, club: "56 degree", result: "Hit Green" },
      { shotNumber: 7, distanceToPin: 24, club: "Putter", result: "Miss Short" },
      { shotNumber: 8, distanceToPin: 8, club: "Putter", result: "In Hole" },
    ],
    [
      { shotNumber: 1, distanceToPin: 454, club: "Driver", result: "Hit Fairway" },
      { shotNumber: 2, distanceToPin: 240, club: "4 hybrid", result: "Mishit" },
      { shotNumber: 4, distanceToPin: 45, club: "56 degree", result: "Hit Green" },
      { shotNumber: 3, distanceToPin: 200, club: "4 hybrid", result: "Miss Short" },
      { shotNumber: 5, distanceToPin: 15, club: "Putter", result: "Miss Long" },
      { shotNumber: 6, distanceToPin: 5, club: "Putter", result: "In Hole" },
    ],
    [
      { shotNumber: 1, distanceToPin: 365, club: "7 iron", result: "Hit Fairway" },
      { shotNumber: 2, distanceToPin: 130, club: "Pitching Wedge", result: "Mishit" },
      { shotNumber: 3, distanceToPin: 55, club: "56 degree", result: "Hit Green" },
      { shotNumber: 4, distanceToPin: 39, club: "Putter", result: "Miss Short" },
      { shotNumber: 5, distanceToPin: 18, club: "Putter", result: "Miss Right" },
      { shotNumber: 6, distanceToPin: 7, club: "Putter", result: "In Hole" },
    ],
    [
      { shotNumber: 1, distanceToPin: 135, club: "Pitching Wedge", result: "Miss Left" },
      { shotNumber: 2, distanceToPin: 25, club: "56 degree", result: "Hit Green" },
      { shotNumber: 3, distanceToPin: 14, club: "Putter", result: "Miss Short" },
      { shotNumber: 4, distanceToPin: 4, club: "Putter", result: "In Hole" },
    ],
    [
      { shotNumber: 1, distanceToPin: 307, club: "8 iron", result: "Miss Right" },
      { shotNumber: 2, distanceToPin: 90, club: "Pitching Wedge", result: "Hit Fairway" },
      { shotNumber: 3, distanceToPin: 90, club: "56 degree", result: "Miss Right" },
      { shotNumber: 4, distanceToPin: 20, club: "56 degree", result: "Hit Green" },
      { shotNumber: 5, distanceToPin: 20, club: "Putter", result: "Miss Long" },
      { shotNumber: 6, distanceToPin: 2, club: "Putter", result: "In Hole" },
    ],
    [
      { shotNumber: 1, distanceToPin: 342, club: "8 iron", result: "Hit Fairway" },
      { shotNumber: 2, distanceToPin: 120, club: "56 degree", result: "Miss Short" },
      { shotNumber: 3, distanceToPin: 25, club: "56 degree", result: "Hit Green" },
      { shotNumber: 4, distanceToPin: 7, club: "Putter", result: "Miss Long" },
      { shotNumber: 5, distanceToPin: 1, club: "Putter", result: "In Hole" },
    ],
    [
      { shotNumber: 1, distanceToPin: 144, club: "9 iron", result: "Miss Right" },
      { shotNumber: 2, distanceToPin: 30, club: "56 degree", result: "Mishit" },
      { shotNumber: 3, distanceToPin: 30, club: "56 degree", result: "Hit Green" },
      { shotNumber: 4, distanceToPin: 30, club: "Putter", result: "Miss Long" },
      { shotNumber: 5, distanceToPin: 13, club: "Putter", result: "Miss Long" },
      { shotNumber: 6, distanceToPin: 1, club: "Putter", result: "In Hole" },
    ],
    [
      { shotNumber: 1, distanceToPin: 446, club: "Driver", result: "Miss Left" },
      { shotNumber: 2, distanceToPin: 225, club: "4 hybrid", result: "Miss Right" },
      { shotNumber: 4, distanceToPin: 45, club: "56 degree", result: "Hit Green" },
      { shotNumber: 3, distanceToPin: 45, club: "56 degree", result: "Mishit" },
      { shotNumber: 5, distanceToPin: 69, club: "Putter", result: "Miss Long" },
      { shotNumber: 6, distanceToPin: 10, club: "Putter", result: "In Hole" },
    ],
    [
      { shotNumber: 1, distanceToPin: 270, club: "7 iron", result: "Miss Right" },
      { shotNumber: 2, distanceToPin: 155, club: "Pitching Wedge", result: "Mishit" },
      { shotNumber: 3, distanceToPin: 120, club: "Pitching Wedge", result: "Hit Green" },
      { shotNumber: 4, distanceToPin: 13, club: "Putter", result: "In Hole" },
    ],
    [{ fairwaysHit: "4/7", greensInReg: 0, threePutts: 2, totalPutts: 19 }],
    [
      { shotNumber: 1, distanceToPin: 267, club: "9 iron", result: "Hit Fairway" },
      { shotNumber: 2, distanceToPin: 95, club: "56 degree", result: null },
      { shotNumber: 3, distanceToPin: 30, club: "56 degree", result: "Hit Green" },
      { shotNumber: 4, distanceToPin: 30, club: "Putter", result: "Miss Short" },
      { shotNumber: 5, distanceToPin: 5, club: "Putter", result: "In Hole" },
    ],
    [
      { shotNumber: 1, distanceToPin: 310, club: "Driver", result: "Hit Fairway" },
      { shotNumber: 2, distanceToPin: 70, club: "56 degree", result: "Hit Green" },
      { shotNumber: 3, distanceToPin: 49, club: "Putter", result: "Miss Short" },
      { shotNumber: 4, distanceToPin: 10, club: "Putter", result: "In Hole" },
    ],
    [
      { shotNumber: 1, distanceToPin: 435, club: "Driver", result: "Miss Left" },
      { shotNumber: 2, distanceToPin: 210, club: "Pitching Wedge", result: "Hit Fairway" },
      { shotNumber: 3, distanceToPin: 125, club: "Pitching Wedge", result: "Miss Left" },
      { shotNumber: 4, distanceToPin: 40, club: "56 degree", result: "Mishit" },
      { shotNumber: 5, distanceToPin: 45, club: "56 degree", result: "Hit Green" },
      { shotNumber: 6, distanceToPin: 13, club: "Putter", result: "Miss Long" },
      { shotNumber: 7, distanceToPin: 1, club: "Putter", result: "In Hole" },
    ],
    [
      { shotNumber: 1, distanceToPin: 111, club: "52 degree", result: "Miss Short" },
      { shotNumber: 2, distanceToPin: 20, club: "56 degree", result: "Hit Green" },
      { shotNumber: 3, distanceToPin: 9, club: "Putter", result: "Miss Short" },
      { shotNumber: 4, distanceToPin: 4, club: "Putter", result: "In Hole" },
    ],
    [
      { shotNumber: 1, distanceToPin: 335, club: "Driver", result: "Miss Left" },
      { shotNumber: 2, distanceToPin: 335, club: "Pitching Wedge", result: "Mishit" },
      { shotNumber: 3, distanceToPin: 335, club: "4 hybrid", result: "Miss Left" },
      { shotNumber: 4, distanceToPin: 175, club: "7 iron", result: "Miss Left" },
      { shotNumber: 5, distanceToPin: 65, club: "Pitching Wedge", result: "Hit Green" },
      { shotNumber: 6, distanceToPin: 32, club: "Putter", result: "In Hole" },
    ],
    [
      { shotNumber: 1, distanceToPin: 100, club: "52 degree", result: "Hit Green" },
      { shotNumber: 2, distanceToPin: 30, club: "Putter", result: "Miss Short" },
      { shotNumber: 3, distanceToPin: 6, club: "Putter", result: "In Hole" },
    ],
    [
      { shotNumber: 1, distanceToPin: 376, club: "7 iron", result: "OB" },
      { shotNumber: 2, distanceToPin: 250, club: null, result: "Penalty Stroke" },
      { shotNumber: 3, distanceToPin: 255, club: "Pitching Wedge", result: "Hit Fairway" },
      { shotNumber: 4, distanceToPin: 155, club: "8 iron", result: "Miss Long" },
      { shotNumber: 5, distanceToPin: 30, club: "56 degree", result: "Mishit" },
      { shotNumber: 6, distanceToPin: 15, club: "56 degree", result: "Hit Green" },
      { shotNumber: 7, distanceToPin: 34, club: "Putter", result: "Miss Long" },
      { shotNumber: 8, distanceToPin: 1, club: "Putter", result: "In Hole" },
    ],
    [
      { shotNumber: 1, distanceToPin: 159, club: "7 iron", result: "Miss Left" },
      { shotNumber: 2, distanceToPin: 25, club: "56 degree", result: "Hit Green" },
      { shotNumber: 3, distanceToPin: 5, club: "Putter", result: "Miss Right" },
      { shotNumber: 4, distanceToPin: 5, club: "Putter", result: "In Hole" },
    ],
    [
      { shotNumber: 1, distanceToPin: 291, club: "Driver", result: "Hit Fairway" },
      { shotNumber: 2, distanceToPin: 19, club: "Putter", result: "Hit Green" },
      { shotNumber: 3, distanceToPin: 19, club: "Putter", result: "Miss Short" },
      { shotNumber: 4, distanceToPin: 6, club: "Putter", result: "In Hole" },
    ],
    [{ fairwaysHit: "3/6", greensInReg: 3, threePutts: 1, totalPutts: 18 }],
    [{ fairwaysHit: "7/13", greensInReg: 3, threePutts: 3, totalPutts: 37 }],
    [{ shotNumber: 1, distanceToPin: null, club: null, result: null }],
    [{ shotNumber: 1, distanceToPin: null, club: null, result: null }],
    [{ shotNumber: 1, distanceToPin: null, club: null, result: null }],
    [{ shotNumber: 1, distanceToPin: null, club: null, result: null }],
  ];
//   const testArray = getScoreCountByName();

  // expect().toEqual();
  // expect().toEqual();
  // expect().toEqual();
  // expect().toEqual();
  // expect().toEqual();
  // expect().toEqual();
  // expect().toEqual();
  // expect().toEqual();
  // expect().toEqual();
  // expect().toEqual();
  // expect().toEqual();
  // expect().not.toEqual();
  // expect().not.toEqual();
});
