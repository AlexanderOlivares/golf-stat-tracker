import { useRouter } from "next/router";
import { getAuthTokenQuery } from "../../api/graphql/queries/authQueries";
import { useQuery } from "@apollo/client";
import ScoreCard from "../../../components/ScoreCard";

export default function Round() {
  const router = useRouter();

  const { loading, error, data } = useQuery(getAuthTokenQuery);
  if (loading) return "Loading...";
  // TODO add toast error
  if (error) router.push("/login");
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
  } = router.query;

  return (
    <>
      <h1>Round detail page</h1>
      <h3>{roundDate}</h3>
      <h3>{courseName ? courseName : userAddedCourseName}</h3>
      <h3>
        {city && city} {state && state}
      </h3>
      <h3></h3>
      {roundView === "scorecard" && <ScoreCard />}
    </>
  );
}
