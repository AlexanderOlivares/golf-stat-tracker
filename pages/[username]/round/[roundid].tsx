import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import ScoreCard from "../../../components/ScoreCard";
import { getCourseForRound } from "../../api/graphql/queries/courseQueries";
import { useEffect, useState } from "react";
import { ParsedUrlQuery } from "querystring";

export interface ICourseTeeInfo {
  teeColor: string;
  courseId: string;
  holeCount: string;
  roundDate: string;
  roundView: string;
  roundid: string;
  username: string;
  frontOrBackNine: string;
  courseName: string;
  isUserAddedCourse: string;
  userAddedCourseName: string;
  city: string;
  state: string;
  course_name: string;
  course_city: string;
  course_country: string;
  course_state: string;
  is_nine_hole_course: boolean;
  blue_par_front: string[];
  blue_par_back: string[];
  blue_hole_yardage_front: string[];
  blue_hole_yardage_back: string[];
  blue_total_yardage_front: string;
  blue_total_yardage_back: string;
  blue_handicap_front: string[];
  blue_handicap_back: string[];
  blue_slope: string;
  blue_rating: string;
  white_par_front: string[];
  white_par_back: string[];
  white_hole_yardage_front: string[];
  white_hole_yardage_back: string[];
  white_total_yardage_front: string;
  white_total_yardage_back: string;
  white_handicap_front: string[];
  white_handicap_back: string[];
  white_slope: string;
  white_rating: string;
  red_par_front: string[];
  red_par_back: string[];
  red_hole_yardage_front: string[];
  red_hole_yardage_back: string[];
  red_total_yardage_front: string;
  red_total_yardage_back: string;
  red_handicap_front: string[];
  red_handicap_back: string[];
  red_slope: string;
  red_rating: string;
}

export default function Round() {
  const router = useRouter();
  const {
    holeCount,
    roundDate,
    roundView,
    roundid,
    username,
    courseName,
    isUserAddedCourse,
    userAddedCourseName,
    city,
    state,
    teeColor,
    courseId,
  } = router.query;

  const [courseProps, setCourseProps] = useState<ICourseTeeInfo | ParsedUrlQuery | null>(null);

  const { loading, error, data } = useQuery(getCourseForRound, {
    variables: {
      courseId,
      teeColor,
    },
    skip: courseId ? false : true,
  });

  useEffect(() => {
    if (router.isReady && !data?.course) {
      setCourseProps(buildProps(router.query));
    }
    if (router.isReady && data?.course) {
      const currentCourseInfo: ICourseTeeInfo = data.course[0];
      setCourseProps(buildProps(router.query, currentCourseInfo));
    }
  }, [data, router.isReady, router.query, teeColor]);

  if (loading) return "Loading...";
  if (error) {
    // TODO add toast error
    console.log(error);
    router.push("/login");
  }

  function buildProps(queryParamProps: ParsedUrlQuery, courseProps?: ICourseTeeInfo) {
    if (courseProps) {
      return {
        ...queryParamProps,
        ...courseProps,
      };
    }
    return queryParamProps;
  }

  return (
    <>
      <h1>Round detail page</h1>
      <h3>{roundDate}</h3>
      <h3>{courseName ? courseName : userAddedCourseName}</h3>
      <h3>
        {city && city} {state && state}
      </h3>
      <h3>{teeColor} tees</h3>
      {courseProps && roundView === "scorecard" && <ScoreCard {...courseProps} />}
    </>
  );
}
