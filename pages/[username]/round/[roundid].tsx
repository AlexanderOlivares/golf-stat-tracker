import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import ScoreCard from "../../../components/ScoreCard";
import { getCourseForRound } from "../../api/graphql/queries/courseQueries";

export default function Round() {
  const router = useRouter();

  const {
    courseid,
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
  const props = router.query;

  const { loading, error, data } = useQuery(getCourseForRound, {
    variables: {
      courseId,
      teeColor,
    },
    skip: courseId ? false : true,
  });

  if (data) console.log(JSON.stringify(data, null, 2));
  if (loading) return "Loading...";
  if (error) {
    // TODO add toast error
    console.log(error);
    router.push("/login");
  }

  return (
    <>
      <h1>Round detail page</h1>
      <h3>{roundDate}</h3>
      <h3>{courseName ? courseName : userAddedCourseName}</h3>
      <h3>
        {city && city} {state && state}
      </h3>
      <h3></h3>
      {roundView === "scorecard" && <ScoreCard {...props} />}
    </>
  );
}
