import React from "react";
import { useRouter } from "next/router";
import { useQuery, useLazyQuery } from "@apollo/client";
import ScoreCard from "../../../components/ScoreCard";
import { getCourseForRound } from "../../api/graphql/queries/courseQueries";
import { useEffect, useState } from "react";
import { getRoundByIdQuery } from "../../api/graphql/queries/roundQueries";
import { queryParamToString, queryParamToBoolean } from "../../../utils/queryParamFormatter";
import { IShotDetail } from "../../../utils/roundFormatter";
import { RoundContextProvider } from "../../../context/RoundContext";
import { getUnverifiedCourseForRound } from "../../api/graphql/queries/unverifiedCourseQueries";
import { useNetworkContext } from "../../../context/NetworkContext";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";

export interface IRoundDetails {
  tee_color: string;
  hole_count: number;
  round_date: string;
  round_id: string;
  username: string;
  front_or_back_nine: string;
  course_name: string;
  temperature: number;
  is_user_added_course: boolean;
  user_added_course_name: string;
  user_added_city: string;
  user_added_state: string;
  unverified_course_id: string | null;
  is_nine_hole_course: boolean;
  weather_conditions: string;
  clubs: string[];
  hole_scores: number[];
  hole_shot_details: IShotDetail[][];
}

export interface ICourseDetails {
  course_id: string;
  course_name: string;
  course_country: string;
  course_city: string;
  course_state: string;
  is_nine_hole_course: boolean;
  blue_par_front: string[] | null;
  blue_par_back: string[] | null;
  blue_hole_yardage_front: string[] | null;
  blue_hole_yardage_back: string[] | null;
  blue_total_yardage_front: string | null;
  blue_total_yardage_back: string | null;
  blue_handicap_front: string[] | null;
  blue_handicap_back: string[] | null;
  blue_slope: string | null;
  blue_rating: string | null;
  white_par_front: string[] | null;
  white_par_back: string[] | null;
  white_hole_yardage_front: string[] | null;
  white_hole_yardage_back: string[] | null;
  white_total_yardage_front: string | null;
  white_total_yardage_back: string | null;
  white_handicap_front: string[] | null;
  white_handicap_back: string[] | null;
  white_slope: string | null;
  white_rating: string | null;
  red_par_front: string[] | null;
  red_par_back: string[] | null;
  red_hole_yardage_front: string[] | null;
  red_hole_yardage_back: string[] | null;
  red_total_yardage_front: string | null;
  red_total_yardage_back: string | null;
  red_handicap_front: string[] | null;
  red_handicap_back: string[] | null;
  red_slope: string | null;
  red_rating: string | null;
}

export interface IScoreCardProps extends ICourseDetails {
  tee_color: string;
  hole_count: number;
  round_date: string;
  round_id: string;
  username: string;
  front_or_back_nine: string;
  temperature: number;
  course_name: string;
  is_user_added_course: boolean;
  user_added_course_name: string;
  user_added_city: string;
  user_added_state: string;
  user_added_par: string[];
  unverified_course_id: string | null;
  is_nine_hole_course: boolean;
  weather_conditions: string;
  clubs: string[];
  hole_scores: number[];
  hole_shot_details: IShotDetail[][];
}

export default function Round() {
  const router = useRouter();
  const networkContext = useNetworkContext();
  const { roundid, courseId, unverifiedCourseId, teeColor, isUserAddedCourse } = router.query;

  // save reference to hidden query params so they aren't lost on refresh
  if (courseId || unverifiedCourseId) {
    localStorage.setItem(queryParamToString(roundid), JSON.stringify(router.query));
  }

  const [queryParams, setQueryParams] = useState({
    roundid,
    courseId,
    unverifiedCourseId,
    teeColor,
    isUserAddedCourse,
  });

  const [scoreCardProps, setScoreCardProps] = useState<IScoreCardProps | null>(null);
  const [courseDetails, setCourseDetails] = useState<ICourseDetails | null>(null);
  const [roundDetails, setRoundDetails] = useState<IRoundDetails | null>(null);

  // only make these network calls if networkContext is online/good connection
  function onNetwork() {
    const { hasNetworkConnection, offlineModeEnabled } = networkContext.state;
    if (!hasNetworkConnection || offlineModeEnabled) {
      return false;
    }
  }

  const [getRound, { loading, error, data }] = useLazyQuery(getRoundByIdQuery);
  const [getVerifiedCourse, { loading: courseLoading, error: courseError, data: courseData }] =
    useLazyQuery(getCourseForRound);
  const [
    getUnverifiedCourse,
    { loading: unverifiedCourseLoading, error: unverifiedCourseError, data: unverifiedCourseData },
  ] = useLazyQuery(getUnverifiedCourseForRound);

  useEffect(() => {
    if (router.isReady) {
      if (!courseId || !unverifiedCourseId) {
        const key = queryParamToString(roundid);
        const savedParams = localStorage.getItem(key);
        if (savedParams) setQueryParams(JSON.parse(savedParams));
      } else {
        setQueryParams({
          ...queryParams,
          roundid,
        });
      }
    }
  }, [router.isReady]);

  useEffect(() => {
    const indexedDB = window.indexedDB;
    const request = indexedDB.open("GolfStatDb", 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      const roundBuildPropsStore = db.createObjectStore("roundBuildProps", { keyPath: "id" });
      roundBuildPropsStore.createIndex("roundBuildProps", ["hole_scores", "hole_shot_details"], {
        unique: false,
      });
      const courseBuildPropsStore = db.createObjectStore("courseBuildProps", { keyPath: "id" });
      courseBuildPropsStore.createIndex("courseBuildProps", ["courseBuildProps"], {
        unique: false,
      });
      const roundStore = db.createObjectStore("round", { keyPath: "id" });
      roundStore.createIndex(
        "roundDetails",
        ["clubs", "holeScores", "holeShotDetails", "isUserAddedCourse", "par"],
        { unique: false }
      );
    };
    request.onsuccess = async () => {
      const db = request.result;
      const roundidKey = queryParamToString(roundid);

      const transaction = db.transaction("roundBuildProps", "readwrite");
      const roundStore = transaction.objectStore("roundBuildProps");
      const existingRoundQuery = roundStore.get(roundidKey); // will be undefined if new round
      existingRoundQuery.onsuccess = () => {
        if (existingRoundQuery.result) {
          setRoundDetails(existingRoundQuery.result);
        }
        if (!existingRoundQuery.result) {
          getRound({ variables: { roundid } });
        }
        if (!existingRoundQuery.result && data) {
          roundStore.put({
            id: roundid,
            ...data.round,
          });
        }
      };

      const courseTransaction = db.transaction("courseBuildProps", "readwrite");
      const courseStore = courseTransaction.objectStore("courseBuildProps");

      const verifiedCourseKey = queryParamToString(queryParams.courseId);
      const verifiedCourseQuery = courseStore.get(verifiedCourseKey);
      verifiedCourseQuery.onsuccess = () => {
        if (verifiedCourseQuery.result) {
          setCourseDetails(verifiedCourseQuery.result);
        }
        if (!verifiedCourseQuery.result && !queryParams.unverifiedCourseId) {
          getVerifiedCourse({
            variables: {
              courseId: queryParamToString(queryParams.courseId),
              isUserAddedCourse: queryParamToBoolean(queryParams.isUserAddedCourse),
            },
          });
        }
        if (!verifiedCourseQuery.result && courseData) {
          courseStore.put({
            id: queryParams.courseId,
            ...courseData.course[0],
          });
        }
      };

      const unverifiedCourseKey = queryParamToString(queryParams.unverifiedCourseId);
      const unverifiedCourseQuery = courseStore.get(unverifiedCourseKey);
      unverifiedCourseQuery.onsuccess = () => {
        // could possibly be pumping in outdated pars for unverified courses
        if (unverifiedCourseQuery.result) {
          setCourseDetails(unverifiedCourseQuery.result);
        }
        if (!unverifiedCourseQuery.result && !queryParams.courseId) {
          getUnverifiedCourse({
            variables: {
              unverifiedCourseId: queryParamToString(queryParams.unverifiedCourseId),
            },
          });
        }
        if (!unverifiedCourseQuery.result && unverifiedCourseData) {
          courseStore.put({
            id: queryParams.unverifiedCourseId,
            ...unverifiedCourseData.unverifiedCourse[0],
          });
        }
      };
    };
  }, [data, queryParams, courseData, unverifiedCourseData]);

  useEffect(() => {
    if (router.isReady && data) {
      setRoundDetails(data.round);
    }
    if (queryParams.courseId && courseData) {
      setCourseDetails(courseData.course[0]);
    }
    if (queryParams.unverifiedCourseId && unverifiedCourseData) {
      setCourseDetails(unverifiedCourseData.unverifiedCourse[0]);
    }
    if (courseDetails && roundDetails) {
      const builtProps = buildProps(roundDetails, courseDetails);
      setScoreCardProps(builtProps);
    }
  }, [getRound, router.isReady, courseData, roundDetails, courseDetails]);

  if (loading || courseLoading) return "Loading...";

  if (error || courseLoading) {
    // TODO add toast error
    console.log(error || courseError);
    router.push("/login");
  }

  function buildProps(roundProps: any, courseProps?: any): IScoreCardProps {
    if (courseProps) {
      return {
        ...roundProps,
        ...courseProps,
      };
    }
    return roundProps;
  }

  // TODO make this smarter than toggle
  function toggleOfflineMode() {
    networkContext.dispatch({
      type: "update offline mode enabled",
      payload: {
        ...networkContext.state,
        offlineModeEnabled: !networkContext.state.offlineModeEnabled,
      },
    });
  }

  return (
    <>
      <RoundContextProvider>
        <h1>Round detail page</h1>
        {roundDetails && (
          <>
            <h3>{roundDetails.round_date}</h3>
            <h3>
              {roundDetails.course_name
                ? roundDetails.course_name
                : roundDetails.user_added_course_name}
            </h3>
            <h3>{courseDetails ? courseDetails.course_city : roundDetails.user_added_city}</h3>
            <h3>{courseDetails ? courseDetails.course_state : roundDetails.user_added_state}</h3>
            <h3>Conditions {roundDetails.weather_conditions}</h3>
            <h3>Temperature {roundDetails.temperature}</h3>
            <h3>{teeColor} tees</h3>
            <Box m={3}>
              <Button
                onClick={toggleOfflineMode}
                type="submit"
                size="medium"
                variant="contained"
                color="primary"
              >
                Go Offline
              </Button>
            </Box>
            {scoreCardProps && <ScoreCard {...scoreCardProps} />}
          </>
        )}
      </RoundContextProvider>
    </>
  );
}
