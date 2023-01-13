import React from "react";
import { useRouter } from "next/router";
import ScoreCard from "../../../components/ScoreCard";
import { getCourseForRound } from "../../api/graphql/queries/courseQueries";
import { useEffect, useState } from "react";
import { getRoundByIdQuery } from "../../api/graphql/queries/roundQueries";
import { queryParamToString } from "../../../utils/queryParamFormatter";
import { RoundContextProvider } from "../../../context/RoundContext";
import { getUnverifiedCourseForRound } from "../../api/graphql/queries/unverifiedCourseQueries";
import { useNetworkContext } from "../../../context/NetworkContext";
import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { IScoreCardProps } from "../../../interfaces/scorecardInterface";
import { ICourseDetails } from "../../../interfaces/course";
import { IRoundDetails } from "../../../interfaces/round";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { toast } from "react-toastify";
import SignalCellularConnectedNoInternet1BarRoundedIcon from "@mui/icons-material/SignalCellularConnectedNoInternet1BarRounded";
import CellWifiRoundedIcon from "@mui/icons-material/CellWifiRounded";
import DeleteRoundDialog from "../../../components/DeleteRoundDialog";
import { useAuthContext } from "../../../context/AuthContext";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import apolloClient from "../../../apollo-client";
import { setCookie } from "../../../utils/authCookieGenerator";

const removeDashes = (str: string) => str.replace(/-/g, "");

export default function Round({
  data,
  courseData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const networkContext = useNetworkContext();
  const { roundid, courseId, unverifiedCourseId, username } = router.query;
  const authContext = useAuthContext();
  const { isAuth, tokenPayload } = authContext.state;

  // save reference to hidden query params so they aren't lost on refresh
  if (courseId || unverifiedCourseId) {
    const roundIdAsCookieKey = removeDashes(queryParamToString(roundid));
    setCookie(roundIdAsCookieKey, JSON.stringify(router.query));
  }

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [scoreCardProps, setScoreCardProps] = useState<IScoreCardProps | null>(null);
  const [courseDetails, setCourseDetails] = useState<ICourseDetails | null>(null);
  const [roundDetails, setRoundDetails] = useState<IRoundDetails | null>(null);

  useEffect(() => {
    const indexedDB = window.indexedDB;
    const request = indexedDB.open("GolfStatDb", 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      const roundStore = db.createObjectStore("round", { keyPath: "id" });
      roundStore.createIndex(
        "roundDetails",
        ["clubs", "holeScores", "holeShotDetails", "isUserAddedCourse", "par"],
        { unique: false }
      );
    };
  }, []);

  useEffect(() => {
    if (data) {
      setRoundDetails(data.round);
    }
    if (courseData) {
      if (courseData?.course) setCourseDetails(courseData.course[0]);
      if (courseData?.unverifiedCourse) setCourseDetails(courseData.unverifiedCourse[0]);
    }
    if (data && courseData) {
      const builtProps = buildProps(roundDetails, courseDetails);
      setScoreCardProps(builtProps);
      setIsLoading(false);
    }
  }, [data, courseData, roundDetails, courseDetails]);

  useEffect(() => {
    if (networkContext.state.offlineModeEnabled) {
      toast.warn("You're in offline mode");
    }
  }, [networkContext.state.offlineModeEnabled]);

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
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <RoundContextProvider>
          {roundDetails && (
            <>
              <Box textAlign="center" mt={2}>
                <Typography variant="h5">
                  {roundDetails.course_name
                    ? roundDetails.course_name
                    : roundDetails.user_added_course_name}
                </Typography>
                <Box mt={1}>
                  <Box>
                    <Typography variant="subtitle2">
                      {courseDetails ? courseDetails.course_city : roundDetails.user_added_city},{" "}
                      {courseDetails ? courseDetails.course_state : roundDetails.user_added_state}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2">
                    {roundDetails.round_date.split(",")[0]}
                  </Typography>
                  <Box>
                    <Typography variant="subtitle2">
                      {roundDetails.weather_conditions} Conditions
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">
                      {roundDetails.temperature + "\u00B0"} F
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" justifyContent="space-around"></Box>
              </Box>
              {isAuth && (
                <Box m={2} textAlign="center">
                  <Button
                    onClick={toggleOfflineMode}
                    type="submit"
                    size="medium"
                    variant="contained"
                    color="primary"
                  >
                    {networkContext.state.offlineModeEnabled ? (
                      <SignalCellularConnectedNoInternet1BarRoundedIcon />
                    ) : (
                      <CellWifiRoundedIcon />
                    )}
                  </Button>
                  <Box pt={1}>
                    <Typography textAlign="center" variant="caption">
                      Bad signal? Go offline
                    </Typography>
                  </Box>
                </Box>
              )}
              <Box>{scoreCardProps && <ScoreCard {...scoreCardProps} />}</Box>
              {isAuth && username == tokenPayload?.username && <DeleteRoundDialog />}
            </>
          )}
        </RoundContextProvider>
      )}
    </>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  let { roundid, courseId, unverifiedCourseId } = context.query;

  // hidden query params are stored in cookie for reference on page refresh
  const roundIdAsCookieKey = removeDashes(queryParamToString(roundid));
  const roundQueryParamsFromCookie = context.req.cookies[roundIdAsCookieKey];

  if (!courseId && roundQueryParamsFromCookie) {
    const { courseId: courseIdQueryParam } = JSON.parse(roundQueryParamsFromCookie);
    courseId = courseIdQueryParam;
  }

  if (!unverifiedCourseId && roundQueryParamsFromCookie) {
    const { unverifiedCourseId: unverifiedCourseIdQueryParam } = JSON.parse(
      roundQueryParamsFromCookie
    );
    unverifiedCourseId = unverifiedCourseIdQueryParam;
  }

  const { data } = await apolloClient.query({
    query: getRoundByIdQuery,
    variables: { roundid },
    fetchPolicy: "network-only",
  });

  let courseData;

  if (courseId) {
    const { data } = await apolloClient.query({
      query: getCourseForRound,
      variables: { courseId },
    });
    courseData = data;
  } else {
    const { data } = await apolloClient.query({
      query: getUnverifiedCourseForRound,
      variables: { unverifiedCourseId },
      fetchPolicy: "network-only",
    });
    courseData = data;
  }

  return {
    props: {
      data,
      courseData,
    },
  };
};
