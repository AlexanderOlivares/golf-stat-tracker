import { IScoreCardProps } from "../pages/[username]/round/[roundid]";
import { createHoleDetailsJson } from "../utils/roundFormatter";
import {
  buildScoreCardRowsArray,
  getFallbackTeeColor,
  checkKeysForTeeColorMatch,
  teeColorPrefixMatch,
  formatScoreCard,
} from "../utils/scoreCardFormatter";

test("build score card rows array", () => {
  const testArray = buildScoreCardRowsArray();

  expect(Array.isArray(testArray)).toEqual(true);
  expect(testArray.length).toEqual(25);
  expect(testArray[9]["hole"]).toEqual("out");
  expect(testArray[19]["hole"]).toEqual("in");
  expect(testArray[20]["hole"]).toEqual("total");
  expect(testArray[21]["hole"]).toEqual("rating");
  expect(testArray[22]["hole"]).toEqual("slope");
  expect(testArray[23]["hole"]).toEqual("HCP");
  expect(testArray[24]["hole"]).toEqual("NET");
  expect(testArray[0]["hole"]).toEqual("1");
  expect(testArray[10]["hole"]).toEqual("10");
  expect(testArray[10]["hole"]).not.toEqual("9");
  expect(testArray[9]["hole"]).not.toEqual("in");
});

test("fallback to white tees when coures only has white tee data", () => {
  function buildScoreCardPropsWithoutAllTeeColors(teeColor: string) {
    const props: IScoreCardProps = {
      hole_count: 18,
      tee_color: teeColor,
      // roundView: "scorecard",
      round_date: "10/17/2022, 9:03:12 PM",
      front_or_back_nine: "front 9",
      is_user_added_course: false,
      course_name: "Lockhart State Park",
      course_id: "311ba9e5-01bf-4a73-9063-e39ad68a159b",
      username: "username64",
      round_id: "11c95768-e629-418b-867c-81382ae0b9cf",
      temperature: 70,
      // __typename: "Course",
      course_country: "United-States-of-America",
      course_city: "Lockhart",
      course_state: "Texas",
      is_nine_hole_course: true,
      weather_conditions: "windy",
      user_added_course_name: "",
      user_added_city: "",
      user_added_state: "",
      unverified_course_id: null,
      hole_scores: Array.from({ length: 25 }, (_, i) => i + 1),
      hole_shot_details: createHoleDetailsJson(),
      blue_par_front: null,
      blue_par_back: null,
      blue_hole_yardage_front: null,
      blue_hole_yardage_back: null,
      blue_total_yardage_front: null,
      blue_total_yardage_back: null,
      blue_handicap_front: null,
      blue_handicap_back: null,
      blue_slope: null,
      blue_rating: null,
      white_par_front: ["4", "5", "4", "4", "4", "3", "4", "4", "3", "35"],
      white_par_back: null,
      white_hole_yardage_front: ["325", "495", "409", "324", "283", "189", "318", "335", "148"],
      white_hole_yardage_back: null,
      white_total_yardage_front: "2826",
      white_total_yardage_back: null,
      white_handicap_front: null,
      white_handicap_back: null,
      white_slope: "35",
      white_rating: "113",
      red_par_front: null,
      red_par_back: null,
      red_hole_yardage_front: null,
      red_hole_yardage_back: null,
      red_total_yardage_front: null,
      red_total_yardage_back: null,
      red_handicap_front: null,
      red_handicap_back: null,
      red_slope: null,
      red_rating: null,
    };
    return props;
  }

  const redTeeSelected = buildScoreCardPropsWithoutAllTeeColors("red");

  expect(getFallbackTeeColor(redTeeSelected)).toEqual("white");
  expect(getFallbackTeeColor(redTeeSelected)).not.toEqual("blue");
  expect(getFallbackTeeColor(redTeeSelected)).not.toEqual("red");

  const invalidTeeSelected = buildScoreCardPropsWithoutAllTeeColors("black");
  expect(getFallbackTeeColor(invalidTeeSelected)).toEqual("white");
  expect(getFallbackTeeColor(invalidTeeSelected)).not.toEqual("blue");
  expect(getFallbackTeeColor(invalidTeeSelected)).not.toEqual("red");
});

test("fallback to red tees when coures only has white tee data", () => {
  const props: IScoreCardProps = {
    hole_count: 18,
    tee_color: "red",
    // roundView: "scorecard",
    round_date: "10/17/2022, 9:03:12 PM",
    front_or_back_nine: "front 9",
    is_user_added_course: false,
    course_name: "Lockhart State Park",
    course_id: "311ba9e5-01bf-4a73-9063-e39ad68a159b",
    username: "username64",
    round_id: "11c95768-e629-418b-867c-81382ae0b9cf",
    temperature: 70,
    // __typename: "Course",
    course_country: "United-States-of-America",
    course_city: "Lockhart",
    course_state: "Texas",
    is_nine_hole_course: true,
    weather_conditions: "windy",
    user_added_course_name: "",
    user_added_city: "",
    user_added_state: "",
    unverified_course_id: null,
    hole_scores: Array.from({ length: 25 }, (_, i) => i + 1),
    hole_shot_details: createHoleDetailsJson(),
    blue_par_front: null,
    blue_par_back: null,
    blue_hole_yardage_front: null,
    blue_hole_yardage_back: null,
    blue_total_yardage_front: null,
    blue_total_yardage_back: null,
    blue_handicap_front: null,
    blue_handicap_back: null,
    blue_slope: null,
    blue_rating: null,
    white_par_front: null,
    white_par_back: null,
    white_hole_yardage_front: null,
    white_hole_yardage_back: null,
    white_total_yardage_front: null,
    white_total_yardage_back: null,
    white_handicap_front: null,
    white_handicap_back: null,
    white_slope: null,
    white_rating: null,
    red_par_front: ["4", "5", "4", "4", "4", "3", "4", "4", "3", "35"],
    red_par_back: null,
    red_hole_yardage_front: ["325", "495", "409", "324", "283", "189", "318", "335", "148"],
    red_hole_yardage_back: null,
    red_total_yardage_front: "2826",
    red_total_yardage_back: null,
    red_handicap_front: null,
    red_handicap_back: null,
    red_slope: "35",
    red_rating: "113",
  };

  expect(getFallbackTeeColor(props)).toEqual("red");
  expect(getFallbackTeeColor(props)).not.toEqual("white");
  expect(getFallbackTeeColor(props)).not.toEqual("blue");
});

test("throw error when no tee color is provided", () => {
  const props: IScoreCardProps = {
    hole_count: 18,
    tee_color: "",
    // roundView: "scorecard",
    round_date: "10/17/2022, 9:03:12 PM",
    front_or_back_nine: "front 9",
    is_user_added_course: false,
    course_name: "Lockhart State Park",
    course_id: "311ba9e5-01bf-4a73-9063-e39ad68a159b",
    username: "username64",
    round_id: "11c95768-e629-418b-867c-81382ae0b9cf",
    temperature: 70,
    // __typename: "Course",
    course_country: "United-States-of-America",
    course_city: "Lockhart",
    course_state: "Texas",
    is_nine_hole_course: true,
    weather_conditions: "windy",
    user_added_course_name: "",
    user_added_city: "",
    user_added_state: "",
    unverified_course_id: null,
    hole_scores: Array.from({ length: 25 }, (_, i) => i + 1),
    hole_shot_details: createHoleDetailsJson(),
    blue_par_front: null,
    blue_par_back: null,
    blue_hole_yardage_front: null,
    blue_hole_yardage_back: null,
    blue_total_yardage_front: null,
    blue_total_yardage_back: null,
    blue_handicap_front: null,
    blue_handicap_back: null,
    blue_slope: null,
    blue_rating: null,
    white_par_front: null,
    white_par_back: null,
    white_hole_yardage_front: null,
    white_hole_yardage_back: null,
    white_total_yardage_front: null,
    white_total_yardage_back: null,
    white_handicap_front: null,
    white_handicap_back: null,
    white_slope: null,
    white_rating: null,
    red_par_front: ["4", "5", "4", "4", "4", "3", "4", "4", "3", "35"],
    red_par_back: null,
    red_hole_yardage_front: ["325", "495", "409", "324", "283", "189", "318", "335", "148"],
    red_hole_yardage_back: null,
    red_total_yardage_front: "2826",
    red_total_yardage_back: null,
    red_handicap_front: null,
    red_handicap_back: null,
    red_slope: "35",
    red_rating: "113",
  };

  expect(() => getFallbackTeeColor(props)).toThrow();
});

test("show user selcted tees when course has data for that tee color", () => {
  const props: IScoreCardProps = {
    hole_count: 18,
    tee_color: "blue",
    // roundView: "scorecard",
    round_date: "10/17/2022, 9:03:12 PM",
    front_or_back_nine: "front 9",
    is_user_added_course: false,
    course_name: "Plum Creek Golf Course",
    course_id: "18e349bb-f17d-4e37-97a0-cdf76ea99103",
    username: "username64",
    round_id: "11c95768-e629-418b-867c-81382ae0b9cf",
    temperature: 70,
    // __typename: "Course",
    course_country: "United-States-of-America",
    course_city: "Kyle",
    course_state: "Texas",
    weather_conditions: "windy",
    user_added_course_name: "",
    user_added_city: "",
    user_added_state: "",
    unverified_course_id: null,
    hole_scores: Array.from({ length: 25 }, (_, i) => i + 1),
    hole_shot_details: createHoleDetailsJson(),
    is_nine_hole_course: false,
    blue_par_front: ["4", "5", "4", "3", "4", "4", "4", "3", "5", "36"],
    blue_par_back: ["3", "5", "4", "3", "4", "5", "4", "3", "4", "35"],
    blue_hole_yardage_front: ["354", "626", "357", "176", "346", "387", "323", "123", "540"],
    blue_hole_yardage_back: ["200", "473", "332", "146", "322", "507", "404", "201", "400"],
    blue_total_yardage_front: "3232",
    blue_total_yardage_back: "2985",
    blue_handicap_front: ["13", "1", "11", "15", "9", "3", "7", "17", "5"],
    blue_handicap_back: ["16", "6", "12", "18", "2", "10", "8", "4", "14"],
    blue_slope: "70.3",
    blue_rating: "126",
    white_par_front: ["4", "5", "4", "3", "4", "4", "4", "3", "5", "36"],
    white_par_back: ["3", "5", "4", "3", "4", "5", "5", "3", "4", "36"],
    white_hole_yardage_front: ["330", "515", "351", "164", "320", "359", "316", "108", "488"],
    white_hole_yardage_back: ["169", "439", "325", "138", "334", "437", "401", "191", "389"],
    white_total_yardage_front: "2951",
    white_total_yardage_back: "2823",
    white_handicap_front: ["10", "6", "8", "14", "12", "4", "16", "18", "2"],
    white_handicap_back: ["15", "1", "5", "17", "11", "3", "9", "13", "7"],
    white_slope: "71.3",
    white_rating: "120",
    red_par_front: ["4", "5", "4", "3", "4", "4", "4", "3", "5", "36"],
    red_par_back: ["3", "5", "4", "3", "4", "5", "4", "3", "4", "35"],
    red_hole_yardage_front: ["295", "339", "240", "115", "205", "260", "208", "79", "396"],
    red_hole_yardage_back: ["130", "388", "256", "94", "239", "359", "279", "145", "324"],
    red_total_yardage_front: "2137",
    red_total_yardage_back: "2214",
    red_handicap_front: ["10", "6", "8", "14", "12", "4", "16", "18", "2"],
    red_handicap_back: ["15", "1", "5", "17", "11", "3", "9", "13", "7"],
    red_slope: "65.2",
    red_rating: "101",
  };

  expect(getFallbackTeeColor(props)).toEqual("blue");
  expect(getFallbackTeeColor(props)).not.toEqual("white");
  expect(getFallbackTeeColor(props)).not.toEqual("red");
});

test("find tee color match when course has user selected tees", () => {
  const props: IScoreCardProps = {
    hole_count: 18,
    tee_color: "red",
    // roundView: "scorecard",
    round_date: "10/17/2022, 9:03:12 PM",
    front_or_back_nine: "front 9",
    is_user_added_course: false,
    course_name: "Plum Creek Golf Course",
    course_id: "18e349bb-f17d-4e37-97a0-cdf76ea99103",
    username: "username64",
    round_id: "11c95768-e629-418b-867c-81382ae0b9cf",
    temperature: 70,
    // __typename: "Course",
    course_country: "United-States-of-America",
    course_city: "Kyle",
    course_state: "Texas",
    weather_conditions: "windy",
    user_added_course_name: "",
    user_added_city: "",
    user_added_state: "",
    unverified_course_id: null,
    hole_scores: Array.from({ length: 25 }, (_, i) => i + 1),
    hole_shot_details: createHoleDetailsJson(),
    is_nine_hole_course: false,
    blue_par_front: ["4", "5", "4", "3", "4", "4", "4", "3", "5", "36"],
    blue_par_back: ["3", "5", "4", "3", "4", "5", "4", "3", "4", "35"],
    blue_hole_yardage_front: ["354", "626", "357", "176", "346", "387", "323", "123", "540"],
    blue_hole_yardage_back: ["200", "473", "332", "146", "322", "507", "404", "201", "400"],
    blue_total_yardage_front: "3232",
    blue_total_yardage_back: "2985",
    blue_handicap_front: ["13", "1", "11", "15", "9", "3", "7", "17", "5"],
    blue_handicap_back: ["16", "6", "12", "18", "2", "10", "8", "4", "14"],
    blue_slope: "70.3",
    blue_rating: "126",
    white_par_front: ["4", "5", "4", "3", "4", "4", "4", "3", "5", "36"],
    white_par_back: ["3", "5", "4", "3", "4", "5", "5", "3", "4", "36"],
    white_hole_yardage_front: ["330", "515", "351", "164", "320", "359", "316", "108", "488"],
    white_hole_yardage_back: ["169", "439", "325", "138", "334", "437", "401", "191", "389"],
    white_total_yardage_front: "2951",
    white_total_yardage_back: "2823",
    white_handicap_front: ["10", "6", "8", "14", "12", "4", "16", "18", "2"],
    white_handicap_back: ["15", "1", "5", "17", "11", "3", "9", "13", "7"],
    white_slope: "71.3",
    white_rating: "120",
    red_par_front: ["4", "5", "4", "3", "4", "4", "4", "3", "5", "36"],
    red_par_back: ["3", "5", "4", "3", "4", "5", "4", "3", "4", "35"],
    red_hole_yardage_front: ["295", "339", "240", "115", "205", "260", "208", "79", "396"],
    red_hole_yardage_back: ["130", "388", "256", "94", "239", "359", "279", "145", "324"],
    red_total_yardage_front: "2137",
    red_total_yardage_back: "2214",
    red_handicap_front: ["10", "6", "8", "14", "12", "4", "16", "18", "2"],
    red_handicap_back: ["15", "1", "5", "17", "11", "3", "9", "13", "7"],
    red_slope: "65.2",
    red_rating: "101",
  };

  expect(checkKeysForTeeColorMatch(props, "red")).toEqual("red");
  expect(checkKeysForTeeColorMatch(props, "red")).not.toEqual("white");
  expect(checkKeysForTeeColorMatch(props, "red")).not.toEqual("blue");
  expect(checkKeysForTeeColorMatch(props, "blue")).toEqual("blue");
  expect(checkKeysForTeeColorMatch(props, "blue")).not.toEqual("red");
  expect(checkKeysForTeeColorMatch(props, "blue")).not.toEqual("white");
  expect(checkKeysForTeeColorMatch(props, "white")).toEqual("white");
  expect(checkKeysForTeeColorMatch(props, "white")).not.toEqual("red");
  expect(checkKeysForTeeColorMatch(props, "white")).not.toEqual("blue");
});

test("return undefined when user selected tee color has no valid associated data", () => {
  const props: IScoreCardProps = {
    hole_count: 18,
    tee_color: "red",
    // roundView: "scorecard",
    round_date: "10/17/2022, 9:03:12 PM",
    front_or_back_nine: "front 9",
    is_user_added_course: false,
    course_name: "Lockhart State Park",
    course_id: "311ba9e5-01bf-4a73-9063-e39ad68a159b",
    username: "username64",
    round_id: "11c95768-e629-418b-867c-81382ae0b9cf",
    // __typename: "Course",
    temperature: 70,
    course_country: "United-States-of-America",
    course_city: "Lockhart",
    course_state: "Texas",
    is_nine_hole_course: true,
    weather_conditions: "windy",
    user_added_course_name: "",
    user_added_city: "",
    user_added_state: "",
    unverified_course_id: null,
    hole_scores: Array.from({ length: 25 }, (_, i) => i + 1),
    hole_shot_details: createHoleDetailsJson(),
    blue_par_front: null,
    blue_par_back: null,
    blue_hole_yardage_front: null,
    blue_hole_yardage_back: null,
    blue_total_yardage_front: null,
    blue_total_yardage_back: null,
    blue_handicap_front: null,
    blue_handicap_back: null,
    blue_slope: null,
    blue_rating: null,
    white_par_front: ["4", "5", "4", "4", "4", "3", "4", "4", "3", "35"],
    white_par_back: null,
    white_hole_yardage_front: ["325", "495", "409", "324", "283", "189", "318", "335", "148"],
    white_hole_yardage_back: null,
    white_total_yardage_front: "2826",
    white_total_yardage_back: null,
    white_handicap_front: null,
    white_handicap_back: null,
    white_slope: "35",
    white_rating: "113",
    red_par_front: null,
    red_par_back: null,
    red_hole_yardage_front: null,
    red_hole_yardage_back: null,
    red_total_yardage_front: null,
    red_total_yardage_back: null,
    red_handicap_front: null,
    red_handicap_back: null,
    red_slope: null,
    red_rating: null,
  };

  expect(checkKeysForTeeColorMatch(props, "white")).toEqual("white");
  expect(checkKeysForTeeColorMatch(props, "red")).toEqual(undefined);
  expect(checkKeysForTeeColorMatch(props, "blue")).toEqual(undefined);
  expect(checkKeysForTeeColorMatch(props, "red")).not.toEqual("red");
  expect(checkKeysForTeeColorMatch(props, "red")).not.toEqual("red");
  expect(checkKeysForTeeColorMatch(props, "white")).not.toEqual(undefined);
  expect(checkKeysForTeeColorMatch(props, "white")).not.toEqual("red");
  expect(checkKeysForTeeColorMatch(props, "white")).not.toEqual("blue");
  expect(checkKeysForTeeColorMatch(props, "blue")).not.toEqual("blue");
  expect(checkKeysForTeeColorMatch(props, "red")).not.toEqual("red");
  expect(checkKeysForTeeColorMatch(props, "red")).not.toEqual("blue");
  expect(checkKeysForTeeColorMatch(props, "blue")).not.toEqual("red");
});

test("if props key doesn't match the user selected tee color then we skip to next key", () => {
  expect(teeColorPrefixMatch("white", "white_par_front")).toEqual(true);
  expect(teeColorPrefixMatch("red", "red_par_front")).toEqual(true);
  expect(teeColorPrefixMatch("blue", "blue_par_front")).toEqual(true);
  expect(teeColorPrefixMatch("white", "white_total_yardage_back")).toEqual(true);
  expect(teeColorPrefixMatch("blue", "blue_slope")).toEqual(true);
  expect(teeColorPrefixMatch("red", "red_rating")).toEqual(true);

  expect(teeColorPrefixMatch("blue", "red_par_front")).toEqual(false);
  expect(teeColorPrefixMatch("white", "blue_par_front")).toEqual(false);
  expect(teeColorPrefixMatch("red", "white_par_front")).toEqual(false);
  expect(teeColorPrefixMatch("blue", "white_total_yardage_back")).toEqual(false);
  expect(teeColorPrefixMatch("red", "blue_slope")).toEqual(false);
  expect(teeColorPrefixMatch("blue", "white_rating")).toEqual(false);
  expect(teeColorPrefixMatch("blue", "teeColor")).toEqual(false);
  expect(teeColorPrefixMatch("blue", "roundDate")).toEqual(false);
  expect(teeColorPrefixMatch("red", "courseName")).toEqual(false);
  expect(teeColorPrefixMatch("red", "roudnid")).toEqual(false);
  expect(teeColorPrefixMatch("red", "course_city")).toEqual(false);
  expect(teeColorPrefixMatch("white", "course_state")).toEqual(false);
  expect(teeColorPrefixMatch("white", "course_country")).toEqual(false);
});

test("score card formatter populates tee specific IHoleDetails for 18 holes", () => {
  const returnTeeColorProps = (
    teeColor: string,
    holeCount: number = 18,
    isNineHoleCourse: boolean = false
  ) => {
    const props: IScoreCardProps = {
      round_id: "31781d22-577c-405b-9ccb-881e0d80361d",
      course_name: "Lions Municipal Golf Course",
      course_id: "08753141-8c6a-4c01-8af7-9ab5f3899f4e",
      username: "username1",
      hole_count: holeCount,
      tee_color: teeColor,
      round_date: "11/22/2022, 9:00:36 PM",
      front_or_back_nine: "front 9",
      is_user_added_course: false,
      weather_conditions: "",
      temperature: 45,
      user_added_course_name: "",
      user_added_city: "",
      user_added_state: "",
      unverified_course_id: null,
      hole_scores: Array.from({ length: 25 }, (_, i) => i + 1),
      hole_shot_details: createHoleDetailsJson(),
      course_country: "United-States-of-America",
      course_city: "Austin",
      course_state: "Texas",
      is_nine_hole_course: isNineHoleCourse,
      blue_par_front: ["4", "5", "4", "3", "4", "4", "3", "5", "4", "36"],
      blue_par_back: ["4", "4", "5", "3", "5", "3", "4", "3", "4", "35"],
      blue_hole_yardage_front: ["308", "491", "393", "155", "336", "357", "156", "463", "284"],
      blue_hole_yardage_back: ["284", "330", "463", "143", "513", "121", "390", "191", "309"],
      blue_total_yardage_front: "2943",
      blue_total_yardage_back: "2744",
      blue_handicap_front: ["5", "9", "3", "15", "7", "1", "11", "17", "13"],
      blue_handicap_back: ["16", "8", "4", "12", "10", "14", "2", "6", "18"],
      blue_slope: "69.2",
      blue_rating: "114",
      white_par_front: ["4", "5", "4", "3", "4", "4", "3", "5", "4", "36"],
      white_par_back: ["4", "4", "5", "3", "5", "3", "4", "3", "4", "35"],
      white_hole_yardage_front: ["289", "454", "365", "142", "307", "342", "144", "446", "270"],
      white_hole_yardage_back: ["267", "310", "435", "111", "491", "100", "376", "159", "291"],
      white_total_yardage_front: "2759",
      white_total_yardage_back: "2540",
      white_handicap_front: ["5", "9", "3", "15", "7", "1", "11", "17", "13"],
      white_handicap_back: ["16", "8", "4", "12", "10", "14", "2", "6", "18"],
      white_slope: "67.3",
      white_rating: "110",
      red_par_front: ["4", "5", "4", "3", "4", "4", "3", "5", "4", "36"],
      red_par_back: ["4", "4", "5", "3", "5", "3", "4", "3", "4", "35"],
      red_hole_yardage_front: ["284", "378", "312", "123", "283", "314", "126", "346", "249"],
      red_hole_yardage_back: ["250", "289", "409", "91", "388", "65", "359", "122", "270"],
      red_total_yardage_front: "2415",
      red_total_yardage_back: "2243",
      red_handicap_front: ["5", "9", "3", "15", "7", "1", "11", "17", "13"],
      red_handicap_back: ["16", "8", "4", "12", "10", "14", "2", "6", "18"],
      red_slope: "67.7",
      red_rating: "113",
    };

    return props;
  };

  const whiteScoreCard = returnTeeColorProps("white");
  expect(formatScoreCard(whiteScoreCard)).toEqual([
    { hole: "1", par: "4", yardage: "289", handicap: "5" },
    { hole: "2", par: "5", yardage: "454", handicap: "9" },
    { hole: "3", par: "4", yardage: "365", handicap: "3" },
    { hole: "4", par: "3", yardage: "142", handicap: "15" },
    { hole: "5", par: "4", yardage: "307", handicap: "7" },
    { hole: "6", par: "4", yardage: "342", handicap: "1" },
    { hole: "7", par: "3", yardage: "144", handicap: "11" },
    { hole: "8", par: "5", yardage: "446", handicap: "17" },
    { hole: "9", par: "4", yardage: "270", handicap: "13" },
    { hole: "out", par: "36", frontTotalYardage: "2759" },
    { hole: "10", par: "4", yardage: "267", handicap: "16" },
    { hole: "11", par: "4", yardage: "310", handicap: "8" },
    { hole: "12", par: "5", yardage: "435", handicap: "4" },
    { hole: "13", par: "3", yardage: "111", handicap: "12" },
    { hole: "14", par: "5", yardage: "491", handicap: "10" },
    { hole: "15", par: "3", yardage: "100", handicap: "14" },
    { hole: "16", par: "4", yardage: "376", handicap: "2" },
    { hole: "17", par: "3", yardage: "159", handicap: "6" },
    { hole: "18", par: "4", yardage: "291", handicap: "18" },
    { hole: "in", par: "35", backTotalYardage: "2540" },
    { hole: "total", par: "", totalPar: "71", totalYardage: "5299" },
    { hole: "rating", par: "", rating: "110" },
    { hole: "slope", par: "", slope: "67.3" },
    { hole: "HCP", par: "" },
    { hole: "NET", par: "" },
  ]);

  const redScoreCard = returnTeeColorProps("red");
  expect(formatScoreCard(redScoreCard)).toEqual([
    { hole: "1", par: "4", yardage: "284", handicap: "5" },
    { hole: "2", par: "5", yardage: "378", handicap: "9" },
    { hole: "3", par: "4", yardage: "312", handicap: "3" },
    { hole: "4", par: "3", yardage: "123", handicap: "15" },
    { hole: "5", par: "4", yardage: "283", handicap: "7" },
    { hole: "6", par: "4", yardage: "314", handicap: "1" },
    { hole: "7", par: "3", yardage: "126", handicap: "11" },
    { hole: "8", par: "5", yardage: "346", handicap: "17" },
    { hole: "9", par: "4", yardage: "249", handicap: "13" },
    { hole: "out", par: "36", frontTotalYardage: "2415" },
    { hole: "10", par: "4", yardage: "250", handicap: "16" },
    { hole: "11", par: "4", yardage: "289", handicap: "8" },
    { hole: "12", par: "5", yardage: "409", handicap: "4" },
    { hole: "13", par: "3", yardage: "91", handicap: "12" },
    { hole: "14", par: "5", yardage: "388", handicap: "10" },
    { hole: "15", par: "3", yardage: "65", handicap: "14" },
    { hole: "16", par: "4", yardage: "359", handicap: "2" },
    { hole: "17", par: "3", yardage: "122", handicap: "6" },
    { hole: "18", par: "4", yardage: "270", handicap: "18" },
    { hole: "in", par: "35", backTotalYardage: "2243" },
    { hole: "total", par: "", totalPar: "71", totalYardage: "4658" },
    { hole: "rating", par: "", rating: "113" },
    { hole: "slope", par: "", slope: "67.7" },
    { hole: "HCP", par: "" },
    { hole: "NET", par: "" },
  ]);

  const blueScoreCard = returnTeeColorProps("blue");
  expect(formatScoreCard(blueScoreCard)).toEqual([
    { hole: "1", par: "4", yardage: "308", handicap: "5" },
    { hole: "2", par: "5", yardage: "491", handicap: "9" },
    { hole: "3", par: "4", yardage: "393", handicap: "3" },
    { hole: "4", par: "3", yardage: "155", handicap: "15" },
    { hole: "5", par: "4", yardage: "336", handicap: "7" },
    { hole: "6", par: "4", yardage: "357", handicap: "1" },
    { hole: "7", par: "3", yardage: "156", handicap: "11" },
    { hole: "8", par: "5", yardage: "463", handicap: "17" },
    { hole: "9", par: "4", yardage: "284", handicap: "13" },
    { hole: "out", par: "36", frontTotalYardage: "2943" },
    { hole: "10", par: "4", yardage: "284", handicap: "16" },
    { hole: "11", par: "4", yardage: "330", handicap: "8" },
    { hole: "12", par: "5", yardage: "463", handicap: "4" },
    { hole: "13", par: "3", yardage: "143", handicap: "12" },
    { hole: "14", par: "5", yardage: "513", handicap: "10" },
    { hole: "15", par: "3", yardage: "121", handicap: "14" },
    { hole: "16", par: "4", yardage: "390", handicap: "2" },
    { hole: "17", par: "3", yardage: "191", handicap: "6" },
    { hole: "18", par: "4", yardage: "309", handicap: "18" },
    { hole: "in", par: "35", backTotalYardage: "2744" },
    { hole: "total", par: "", totalPar: "71", totalYardage: "5687" },
    { hole: "rating", par: "", rating: "114" },
    { hole: "slope", par: "", slope: "69.2" },
    { hole: "HCP", par: "" },
    { hole: "NET", par: "" },
  ]);
});

test("score card formatter populates front 9 holes again when on 9 hole course", () => {
  const returnTeeColorProps = (teeColor: string) => {
    const props: IScoreCardProps = {
      round_id: "daeb6303-9229-4049-be1a-adfc66e264fd",
      course_name: "Hancock Austin Mun Golf Club (Front 9)",
      course_id: "f242206c-d215-4024-83d9-aba6d533050c",
      username: "username1",
      hole_count: 18,
      tee_color: teeColor,
      round_date: "11/22/2022, 9:40:08 PM",
      front_or_back_nine: "front 9",
      is_user_added_course: false,
      weather_conditions: "",
      temperature: 70,
      user_added_course_name: "",
      user_added_city: "",
      user_added_state: "",
      unverified_course_id: null,
      hole_scores: Array.from({ length: 25 }, (_, i) => i + 1),
      hole_shot_details: createHoleDetailsJson(),
      course_country: "United-States-of-America",
      course_city: "Austin",
      course_state: "Texas",
      is_nine_hole_course: true,
      blue_par_front: ["4", "4", "4", "4", "3", "5", "4", "3", "4", "35"],
      blue_par_back: null,
      blue_hole_yardage_front: ["312", "322", "353", "258", "150", "404", "296", "147", "237"],
      blue_hole_yardage_back: null,
      blue_total_yardage_front: "2479",
      blue_total_yardage_back: null,
      blue_handicap_front: ["11", "9", "3", "13", "15", "1", "5", "17", "7"],
      blue_handicap_back: null,
      blue_slope: "65.2",
      blue_rating: "112",
      white_par_front: ["4", "4", "4", "4", "3", "5", "4", "3", "4", "35"],
      white_par_back: null,
      white_hole_yardage_front: ["307", "311", "346", "251", "147", "389", "265", "126", "216"],
      white_hole_yardage_back: null,
      white_total_yardage_front: "2358",
      white_total_yardage_back: null,
      white_handicap_front: ["2", "9", "3", "4", "6", "1", "5", "8", "7"],
      white_handicap_back: null,
      white_slope: "65.2",
      white_rating: "112",
      red_par_front: ["4", "4", "4", "4", "3", "5", "4", "3", "4", "35"],
      red_par_back: null,
      red_hole_yardage_front: ["299", "306", "325", "244", "131", "361", "237", "102", "192"],
      red_hole_yardage_back: null,
      red_total_yardage_front: "2197",
      red_total_yardage_back: null,
      red_handicap_front: ["2", "9", "3", "4", "6", "1", "5", "8", "7"],
      red_handicap_back: null,
      red_slope: "64.2",
      red_rating: "110",
    };
    return props;
  };
  const whiteScoreCard = returnTeeColorProps("white");
  expect(formatScoreCard(whiteScoreCard)).toEqual([
      { hole: "1", par: "4", yardage: "307", handicap: "2" },
      { hole: "2", par: "4", yardage: "311", handicap: "9" },
      { hole: "3", par: "4", yardage: "346", handicap: "3" },
      { hole: "4", par: "4", yardage: "251", handicap: "4" },
      { hole: "5", par: "3", yardage: "147", handicap: "6" },
      { hole: "6", par: "5", yardage: "389", handicap: "1" },
      { hole: "7", par: "4", yardage: "265", handicap: "5" },
      { hole: "8", par: "3", yardage: "126", handicap: "8" },
      { hole: "9", par: "4", yardage: "216", handicap: "7" },
      { hole: "out", par: "35", frontTotalYardage: "2358" },
      { hole: "10", par: "4", yardage: "307", handicap: "2" },
      { hole: "11", par: "4", yardage: "311", handicap: "9" },
      { hole: "12", par: "4", yardage: "346", handicap: "3" },
      { hole: "13", par: "4", yardage: "251", handicap: "4" },
      { hole: "14", par: "3", yardage: "147", handicap: "6" },
      { hole: "15", par: "5", yardage: "389", handicap: "1" },
      { hole: "16", par: "4", yardage: "265", handicap: "5" },
      { hole: "17", par: "3", yardage: "126", handicap: "8" },
      { hole: "18", par: "4", yardage: "216", handicap: "7" },
      { hole: "in", par: "35", frontTotalYardage: "2358" },
      { hole: "total", par: "", totalPar: "70", totalYardage: "4716" },
      { hole: "rating", par: "", rating: "112" },
      { hole: "slope", par: "", slope: "65.2" },
      { hole: "HCP", par: "" },
      { hole: "NET", par: "" },
  ]);
});
