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
import Box from "@mui/material/Box";
import { IScoreCardProps } from "../../../interfaces/scorecardInterface";
import { ICourseDetails } from "../../../interfaces/course";
import { IRoundDetails } from "../../../interfaces/round";
import { toast } from "react-toastify";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import apolloClient from "../../../apollo-client";
import { setCookie } from "../../../utils/authCookieGenerator";
import * as Sentry from "@sentry/nextjs";

const removeDashes = (str: string) => str.replace(/-/g, "");

export default function Round({
  data,
  courseData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const networkContext = useNetworkContext();
  const { roundid, courseId, unverifiedCourseId, username } = router.query;

  // save reference to hidden query params so they aren't lost on refresh
  if (courseId || unverifiedCourseId) {
    const roundIdAsCookieKey = removeDashes(queryParamToString(roundid));
    setCookie(roundIdAsCookieKey, JSON.stringify(router.query));
  }

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

  return (
    <>
      <RoundContextProvider>
        <Box textAlign="center">{scoreCardProps && <ScoreCard {...scoreCardProps} />}</Box>
      </RoundContextProvider>
    </>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
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
  } catch (error) {
    Sentry.captureException(error);
    return {
      redirect: {
        destination: "/login?redirected=true",
        permanent: false,
      },
    };
  }
};
