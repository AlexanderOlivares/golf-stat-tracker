import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import ScoreCard from "../../../components/ScoreCard";
import { getCourseForRound } from "../../api/graphql/queries/courseQueries";
import { useEffect, useState } from "react";
import { ParsedUrlQuery } from "querystring";
import { buildScoreCardRowsArray, IHoleDetails } from "../../../utils/scoreCardFormatter";
import { getRoundByIdQuery } from "../../api/graphql/queries/roundQueries";
import { queryParamToString } from "../../../utils/queryParamFormatter";

export interface IRoundDetails {
  teeColor: string;
  courseId: string;
  holeCount: string;
  roundDate: string;
  roundView: string;
  roundid: string;
  username: string;
  frontOrBackNine: string;
  courseName: string;
  course_name: string;
  course_city: string;
  course_country: string;
  course_state: string;
  is_nine_hole_course: boolean;
  __typename: string;
  isUserAddedCourse: string;
  userAddedCourseName?: string;
  city?: string;
  state?: string;
  hole_scores: number[];
  hole_shot_details: string[];
}

export interface ICourseDetails {
  //   teeColor: string;
  //   courseId: string;
  //   holeCount: string;
  //   roundDate: string;
  //   roundView: string;
  //   roundid: string;
  //   username: string;
  //   frontOrBackNine: string;
  //   courseName: string;
  //   course_name: string;
  //   course_city: string;
  //   course_country: string;
  //   course_state: string;
  //   is_nine_hole_course: boolean;
  //   __typename: string;
  //   isUserAddedCourse: string;
  //   userAddedCourseName?: string;
  //   city?: string;
  //   state?: string;
  //   hole_scores: number[];
  //   hole_shot_details: string[][];
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

// this interface needs everything in snake_case from db
export interface IScoreCardProps extends ICourseDetails, IRoundDetails {}

export default function Round() {
  const router = useRouter();
  const { roundid, courseId, teeColor } = router.query;
  console.log(`roundid: ${roundid}`);
  console.log(`courseId: ${courseId}`);
  console.log(`teeColor: ${teeColor}`);

  const [scoreCardProps, setScoreCardProps] = useState<IScoreCardProps | null>(null);
  const [courseDetails, setCourseDetails] = useState<ICourseDetails | null>(null);
  const [roundDetails, setRoundDetails] = useState<IRoundDetails | null>(null);

  const courseForRound = useQuery(getCourseForRound, {
    variables: {
      courseId: queryParamToString(courseId),
      teeColor: queryParamToString(teeColor),
    },
    // skip: !courseId,
  });
  const round = useQuery(getRoundByIdQuery, {
    variables: {
      roundid,
    },
  });

  useEffect(() => {
    if (router.isReady && round.data) {
      setRoundDetails(round.data.round);
    }
    if (router.isReady && courseForRound.data) {
      setCourseDetails(courseForRound.data.course[0]);
    }
    if (courseDetails && roundDetails) {
      const builtProps = buildProps(roundDetails, courseDetails);
      setScoreCardProps(builtProps);
    }
  }, [round, router.isReady, courseForRound, roundDetails, courseDetails]);

  if (round.loading || courseForRound.loading) return "Loading...";

  if (round.error || courseForRound.error) {
    // TODO add toast error
    console.log(round.error || courseForRound.error);
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

  return (
    <>
      <h1>Round detail page</h1>
      {/* <h3>{roundDate}</h3>
      <h3>{courseName ? courseName : userAddedCourseName}</h3>
      <h3>
        {city && city} {state && state}
      </h3> */}
      <h3>{teeColor} tees</h3>
      {round.data && scoreCardProps && <ScoreCard {...scoreCardProps} />}
    </>
  );
}
