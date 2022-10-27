import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import ScoreCard from "../../../components/ScoreCard";
import { getCourseForRound } from "../../api/graphql/queries/courseQueries";
import { useEffect, useState } from "react";
import { getRoundByIdQuery } from "../../api/graphql/queries/roundQueries";
import { queryParamToString, queryParamToBoolean } from "../../../utils/queryParamFormatter";
import { IShotDetail } from "../../../utils/roundFormatter";
import { buildScoreCardRowsArray } from "../../../utils/scoreCardFormatter";

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
  course_name: string;
  is_user_added_course: boolean;
  user_added_course_name: string;
  user_added_city: string;
  user_added_state: string;
  unverified_course_id: string | null;
  is_nine_hole_course: boolean;
  weather_conditions: string;
  hole_scores: number[];
  hole_shot_details: IShotDetail[][];
}

export default function Round() {
  const router = useRouter();
  const { roundid, courseId, teeColor, isUserAddedCourse } = router.query;

  const [scoreCardProps, setScoreCardProps] = useState<IScoreCardProps | null>(null);
  const [courseDetails, setCourseDetails] = useState<ICourseDetails | null>(null);
  const [roundDetails, setRoundDetails] = useState<IRoundDetails | null>(null);

  const courseForRound = useQuery(getCourseForRound, {
    variables: {
      courseId: queryParamToString(courseId),
      teeColor: queryParamToString(teeColor),
    },
    skip: queryParamToBoolean(isUserAddedCourse),
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
    if (!courseDetails && roundDetails) {
      const genericScoreCard = buildScoreCardRowsArray();
      const builtProps = buildProps(roundDetails, genericScoreCard);
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
          {scoreCardProps && <ScoreCard {...scoreCardProps} />}
        </>
      )}
    </>
  );
}
