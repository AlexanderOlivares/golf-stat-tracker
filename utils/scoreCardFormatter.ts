import { IAdhocStatCounter, IScoreCardProps } from "../interfaces/scorecardInterface";
import { IShotDetail } from "./roundFormatter";

export interface IHoleDetails {
  hole: string;
  par: string;
  totalPar?: string;
  yardage?: string;
  frontTotalYardage?: string;
  backTotalYardage?: string;
  totalYardage?: string;
  handicap?: string;
  out?: string;
  in?: string;
  total?: string;
  rating?: string;
  slope?: string;
  HCP?: string;
  NET?: string;
}

export enum NON_HOLE_ROWS {
  out = 9,
  in = 19,
  total = 20,
  rating = 21,
  slope = 22,
  HCP = 23,
  NET = 24,
}

export function checkKeysForTeeColorMatch(props: IScoreCardProps, matchTeeColor: string) {
  for (let [key, val] of Object.entries(props)) {
    if (key == `${matchTeeColor}_par_front` && val) {
      return matchTeeColor;
    }
  }
}

export function getFallbackTeeColor(props: IScoreCardProps): string {
  if (!props.tee_color) {
    throw Error("error reading tee color");
  }

  const userChosenTeeColor = props.tee_color.toString();
  const chosenTeesHaveData = checkKeysForTeeColorMatch(props, userChosenTeeColor);
  if (chosenTeesHaveData) return userChosenTeeColor;

  const fallBackTees: string[] = ["blue", "white", "red"].filter(
    teeColor => teeColor != props.tee_color
  );

  for (let fallBackTee of fallBackTees) {
    const fallBackTeeHasData = checkKeysForTeeColorMatch(props, fallBackTee);
    if (fallBackTeeHasData) return fallBackTeeHasData;
  }

  return "white";
}

export function buildScoreCardRowsArray() {
  const SCORE_CARD_ROWS_LENGTH = 25;
  return Array.from({ length: SCORE_CARD_ROWS_LENGTH }, (_, i) => {
    let holeDetails: IHoleDetails = { hole: "1", par: "" }; // defualt values - should change this

    if (i == 9 || i > 18) {
      if (i in NON_HOLE_ROWS) {
        holeDetails["hole"] = NON_HOLE_ROWS[i];
        return holeDetails;
      }
    }

    let offset = 1;
    if (i > 9) offset--;

    holeDetails["hole"] = (i + offset).toString();
    return holeDetails;
  });
}

export function hydrateScoreCardRows(scoreCardRows: IHoleDetails[], props: IScoreCardProps) {
  const teeColor: string = getFallbackTeeColor(props);

  let totalPar = 0;

  for (let [key, val] of Object.entries(props)) {
    const keyTeeColorPrefixMatches = teeColorPrefixMatch(teeColor, key);
    if (!keyTeeColorPrefixMatches || !val) continue;

    mapFrontNineValues(scoreCardRows, key, val, `${teeColor}_par_front`, "par");
    mapFrontNineValues(scoreCardRows, key, val, `${teeColor}_hole_yardage_front`, "yardage");
    mapFrontNineValues(scoreCardRows, key, val, `${teeColor}_handicap_front`, "handicap");
    mapTotalYardages(
      scoreCardRows,
      key,
      val,
      `${teeColor}_total_yardage_front`,
      "frontTotalYardage",
      false,
      teeColor
    );
    mapOneOffProperties(scoreCardRows, key, val, `${teeColor}_rating`, "rating", 21);
    mapOneOffProperties(scoreCardRows, key, val, `${teeColor}_slope`, "slope", 22);

    const parValuesFound = mapTotalPar(
      scoreCardRows,
      key,
      val,
      `${teeColor}_par_front`,
      `${teeColor}_par_back`,
      "totalPar",
      totalPar
    );
    if (parValuesFound) totalPar += parValuesFound;

    if (!props.is_nine_hole_course) {
      mapBackNineValues(scoreCardRows, key, val, `${teeColor}_par_back`, "par");
      mapBackNineValues(scoreCardRows, key, val, `${teeColor}_hole_yardage_back`, "yardage");
      mapBackNineValues(scoreCardRows, key, val, `${teeColor}_handicap_back`, "handicap");
      mapTotalYardages(
        scoreCardRows,
        key,
        val,
        `${teeColor}_total_yardage_back`,
        "backTotalYardage",
        false,
        teeColor
      );
    }

    // duplicate the back 9 holes with info from front 9
    if (props.is_nine_hole_course && props.hole_count == 18) {
      mapBackNineValues(scoreCardRows, key, val, `${teeColor}_par_front`, "par");
      mapBackNineValues(scoreCardRows, key, val, `${teeColor}_hole_yardage_front`, "yardage");
      mapBackNineValues(scoreCardRows, key, val, `${teeColor}_handicap_front`, "handicap");
      mapTotalYardages(
        scoreCardRows,
        key,
        val,
        `${teeColor}_total_yardage_back`,
        "frontTotalYardage",
        true,
        teeColor
      );
      mapTotalPar(
        scoreCardRows,
        key,
        val,
        `${teeColor}_par_front`,
        `${teeColor}_par_back`,
        "totalPar",
        totalPar
      );
    }
  }
  return scoreCardRows;
}

export function teeColorPrefixMatch(teeColor: string, propsKey: string) {
  const teeColorPrefix = propsKey.split("_")[0];
  return teeColor == teeColorPrefix;
}

function mapTotalYardages(
  scoreCardRows: IHoleDetails[],
  key: string,
  val: string,
  keyNameToCheck: string,
  mapPropertyName: keyof IHoleDetails,
  repeatSameNine: boolean,
  teeColor: string
) {
  if (repeatSameNine) {
    const teeColorRegex = new RegExp(`${teeColor}_total_yardage_front`);
    if (teeColorRegex.test(key)) {
      scoreCardRows[19][mapPropertyName] = val;
      scoreCardRows[20]["totalYardage"] = String(Number(val) * 2);
      return;
    }
  }
  if (key == keyNameToCheck) {
    if (/total_yardage_front$/.test(keyNameToCheck)) {
      scoreCardRows[9][mapPropertyName] = val;
    }
    if (/total_yardage_back$/.test(keyNameToCheck)) {
      scoreCardRows[19][mapPropertyName] = val;
      scoreCardRows[20]["totalYardage"] = String(
        Number(val) + Number(scoreCardRows[9].frontTotalYardage)
      );
    }
  }
}

function mapTotalPar(
  scoreCardRows: IHoleDetails[],
  key: string,
  val: string[],
  keyNameToCheckFront: string,
  keyNameToCheckBack: string,
  mapPropertyName: keyof IHoleDetails,
  totalPar: number = 0
) {
  if (key == keyNameToCheckFront || key == keyNameToCheckBack) {
    if (!val) return;
    totalPar += Number(val[val.length - 1]);
    scoreCardRows[20][mapPropertyName] = String(totalPar);
    return totalPar;
  }
}

function mapBackNineValues(
  scoreCardRows: IHoleDetails[],
  key: string,
  val: string,
  keyNameToCheck: string,
  mapPropertyName: keyof IHoleDetails
) {
  if (key == keyNameToCheck) {
    for (let i = 10; i < scoreCardRows.length - 5; i++) {
      const valToAssign: string = val[i - 10];
      if (valToAssign) {
        scoreCardRows[i][mapPropertyName] = valToAssign;
      }
    }
  }
}

function mapFrontNineValues(
  scoreCardRows: IHoleDetails[],
  key: string,
  val: string[],
  keyNameToCheck: string,
  mapPropertyName: keyof IHoleDetails
) {
  if (key == keyNameToCheck) {
    for (let i = 0; i < val.length; i++) {
      scoreCardRows[i][mapPropertyName] = val[i];
    }
  }
}

function mapOneOffProperties(
  scoreCardRows: IHoleDetails[],
  key: string,
  val: string,
  keyNameToCheck: string,
  mapPropertyName: keyof IHoleDetails,
  scoreCardIndex: number
) {
  if (key == keyNameToCheck) {
    scoreCardRows[scoreCardIndex][mapPropertyName] = val;
  }
}

export function formatScoreCard(props: IScoreCardProps) {
  const scoreCardRows: IHoleDetails[] = buildScoreCardRowsArray();
  const hydratedScoreCardRows = hydrateScoreCardRows(scoreCardRows, props);

  return hydratedScoreCardRows;
}

export function adhocStatCounter(shotDetails: IShotDetail[][]){
    let statCounter: IAdhocStatCounter = {
        "penalties": 0,
        "mishits": 0,
        "upAndDowns": 0,
        "potentialScore": 0,
        "scrambleHoleIndexes": [], // list of indexes of holes eligible for scramble (will need to compare against par)
    }
    shotDetails.forEach((hole: IShotDetail[], index: number)=> {
        for (let i = 0; i < hole.length; i++){
            const shotResult = hole[i].result;
            const shotNumber = hole[i].shotNumber;
            if (shotResult == "Penalty Stroke") {
                statCounter.penalties++;
                statCounter.potentialScore--;
            }
            if (shotResult == "Mishit"){
                statCounter.mishits++;
                statCounter.potentialScore--;
            } 
            if (shotResult == "In Hole"){
                if (shotNumber){
                    const prevShot = hole.find((shot: IShotDetail)=> shot.shotNumber == shotNumber - 1)
                    if (prevShot){
                        if (prevShot.result == "Hit Green"){
                            statCounter.upAndDowns++;
                            statCounter.scrambleHoleIndexes.push(index);
                        }
                    }
                }
            }
        }
    })
    return statCounter;
}

export function formatPotentialScore(score: number | null, subtractedPenaltiesAndMishits: number, threePutts: number|null|undefined ){
    if (!score) return false;
    const threePuttsFound = threePutts || 0; 
    return (score - threePuttsFound) + subtractedPenaltiesAndMishits;
}

export function calculateSrambles(scrambleIndexes: number[], parArray: string[], holeScores: (number|null)[], holeShotDetails: IShotDetail[][]){
    let scrambleCount = 0;
    scrambleIndexes.forEach((scrambleEligableHoleIndex: number) => {
        const par = Number(parArray[scrambleEligableHoleIndex]);
        if (!par) return;
        const holeScore = holeScores[scrambleEligableHoleIndex];
        if (holeScore && holeScore <= par){
            const shotOnGreen = holeShotDetails[scrambleEligableHoleIndex].find(shot => shot.result == "Hit Green");
            if (!shotOnGreen?.shotNumber) return;
            if (par - shotOnGreen.shotNumber <= 1){
                scrambleCount++;
            }
        }
    })
    return scrambleCount;
}

