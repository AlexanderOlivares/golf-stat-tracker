import {
  buildScoreCardRowsArray,
  getFallbackTeeColor,
  checkKeysForTeeColorMatch,
  teeColorPrefixMatch
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
  const props: any = {
    holeCount: "18",
    teeColor: "red",
    roundView: "scorecard",
    roundDate: "10/17/2022, 9:03:12 PM",
    frontOrBackNine: "front 9",
    isUserAddedCourse: "false",
    courseName: "Lockhart State Park",
    courseId: "311ba9e5-01bf-4a73-9063-e39ad68a159b",
    username: "username64",
    roundid: "11c95768-e629-418b-867c-81382ae0b9cf",
    __typename: "Course",
    course_name: "Lockhart State Park",
    course_country: "United-States-of-America",
    course_city: "Lockhart",
    course_state: "Texas",
    is_nine_hole_course: true,
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

  expect(getFallbackTeeColor(props)).toEqual("white");
  expect(getFallbackTeeColor(props)).not.toEqual("blue");
  expect(getFallbackTeeColor(props)).not.toEqual("red");
});

test("fallback to red tees when coures only has white tee data", () => {
  const props: any = {
    holeCount: "18",
    teeColor: "red",
    roundView: "scorecard",
    roundDate: "10/17/2022, 9:03:12 PM",
    frontOrBackNine: "front 9",
    isUserAddedCourse: "false",
    courseName: "Lockhart State Park",
    courseId: "311ba9e5-01bf-4a73-9063-e39ad68a159b",
    username: "username64",
    roundid: "11c95768-e629-418b-867c-81382ae0b9cf",
    __typename: "Course",
    course_name: "Lockhart State Park",
    course_country: "United-States-of-America",
    course_city: "Lockhart",
    course_state: "Texas",
    is_nine_hole_course: true,
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
  const props: any = {
    holeCount: "18",
    //   teeColor: "",
    roundView: "scorecard",
    roundDate: "10/17/2022, 9:03:12 PM",
    frontOrBackNine: "front 9",
    isUserAddedCourse: "false",
    courseName: "Lockhart State Park",
    courseId: "311ba9e5-01bf-4a73-9063-e39ad68a159b",
    username: "username64",
    roundid: "11c95768-e629-418b-867c-81382ae0b9cf",
    __typename: "Course",
    course_name: "Lockhart State Park",
    course_country: "United-States-of-America",
    course_city: "Lockhart",
    course_state: "Texas",
    is_nine_hole_course: true,
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
  const props: any = {
    holeCount: "18",
    teeColor: "blue",
    roundView: "scorecard",
    roundDate: "10/17/2022, 9:42:43 PM",
    frontOrBackNine: "front 9",
    isUserAddedCourse: "false",
    courseName: "Plum Creek Golf Course",
    courseId: "18e349bb-f17d-4e37-97a0-cdf76ea99103",
    username: "username64",
    roundid: "d2bbb755-dcea-40d0-aab5-f4eaa73e2b72",
    __typename: "Course",
    course_name: "Plum Creek Golf Course",
    course_country: "United-States-of-America",
    course_city: "Kyle",
    course_state: "Texas",
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
  const props: any = {
    holeCount: "18",
    teeColor: "blue",
    roundView: "scorecard",
    roundDate: "10/17/2022, 9:42:43 PM",
    frontOrBackNine: "front 9",
    isUserAddedCourse: "false",
    courseName: "Plum Creek Golf Course",
    courseId: "18e349bb-f17d-4e37-97a0-cdf76ea99103",
    username: "username64",
    roundid: "d2bbb755-dcea-40d0-aab5-f4eaa73e2b72",
    __typename: "Course",
    course_name: "Plum Creek Golf Course",
    course_country: "United-States-of-America",
    course_city: "Kyle",
    course_state: "Texas",
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
  const props: any = {
    holeCount: "18",
    teeColor: "red",
    roundView: "scorecard",
    roundDate: "10/17/2022, 9:03:12 PM",
    frontOrBackNine: "front 9",
    isUserAddedCourse: "false",
    courseName: "Lockhart State Park",
    courseId: "311ba9e5-01bf-4a73-9063-e39ad68a159b",
    username: "username64",
    roundid: "11c95768-e629-418b-867c-81382ae0b9cf",
    __typename: "Course",
    course_name: "Lockhart State Park",
    course_country: "United-States-of-America",
    course_city: "Lockhart",
    course_state: "Texas",
    is_nine_hole_course: true,
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
})