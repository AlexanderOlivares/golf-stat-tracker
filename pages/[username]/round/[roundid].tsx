import React from "react";
import { useRouter } from "next/router";
import ScoreCard from "../../../components/ScoreCard";
import { getCourseForRound } from "../../api/graphql/queries/courseQueries";
import { useEffect, useState } from "react";
import { getRoundByIdQuery } from "../../api/graphql/queries/roundQueries";
import { RoundContextProvider } from "../../../context/RoundContext";
import { getUnverifiedCourseForRound } from "../../api/graphql/queries/unverifiedCourseQueries";
import { useNetworkContext } from "../../../context/NetworkContext";
import Box from "@mui/material/Box";
import { IScoreCardProps } from "../../../interfaces/scorecardInterface";
import { ICourseDetails } from "../../../interfaces/course";
import { IRoundDetails } from "../../../interfaces/round";
import { toast } from "react-toastify";
import * as Sentry from "@sentry/nextjs";
import { ApolloError, useQuery } from "@apollo/client";
import LoadingBackdrop from "../../../components/LoadingBackdrop";
import { parseErrorMessage } from "../../../utils/errorMessage";
import ConnectionListener from "../../../components/ConnectionListener";

export default function Round() {
  const router = useRouter();
  const networkContext = useNetworkContext();
  const { roundid, courseId, unverifiedCourseId } = router.query;

  const { loading, error, data } = useQuery(getRoundByIdQuery, { variables: { roundid } });
  const {
    loading: courseLoading,
    error: courseError,
    data: courseData,
  } = useQuery(getCourseForRound, { variables: { courseId }, skip: !courseId });
  const {
    loading: unverifiedCourseLoading,
    error: unverfifiedCourseError,
    data: unverifiedCourseData,
  } = useQuery(getUnverifiedCourseForRound, {
    variables: { unverifiedCourseId },
    skip: !unverifiedCourseId,
  });

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
    if (router.isReady) {
      if (data) setRoundDetails(data.round);
      if (courseData?.course) setCourseDetails(courseData.course[0]);
      if (unverifiedCourseData?.unverifiedCourse)
        setCourseDetails(unverifiedCourseData.unverifiedCourse[0]);
      if (roundDetails && courseDetails) {
        const builtProps = buildProps(roundDetails, courseDetails);
        setScoreCardProps(builtProps);
      }
    }
  }, [data, courseData, unverifiedCourseData, roundDetails, courseDetails]);

  useEffect(() => {
    if (networkContext.state.offlineModeEnabled) {
      toast.warn("You're in offline mode");
    }
  }, [networkContext.state.offlineModeEnabled]);

  if (loading || (courseId && courseLoading) || (unverifiedCourseId && unverifiedCourseLoading)) {
    return <LoadingBackdrop showBackdrop={loading} />;
  }

  const handleError = (queryError: ApolloError) => {
    Sentry.captureException(queryError);
    toast.error(parseErrorMessage(queryError));
  };

  if (error || courseError || unverfifiedCourseError) {
    const queryError = [error, courseError, unverfifiedCourseError].find(Boolean);
    if (queryError) handleError(queryError);
    router.push({
      pathname: "/login",
      query: {
        redirected: true,
      },
    });
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

  return (
    <>
      <RoundContextProvider>
        <Box textAlign="center">{scoreCardProps && <ScoreCard {...scoreCardProps} />}</Box>
      </RoundContextProvider>
      <ConnectionListener />
    </>
  );
}
