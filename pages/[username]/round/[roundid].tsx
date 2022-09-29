import { useRouter } from "next/router";
import { getAuthTokenQuery } from "../../api/graphql/queries/authQueries";
import { useQuery } from "@apollo/client";

export default function Round() {
  const router = useRouter();

  const { loading, error, data } = useQuery(getAuthTokenQuery);
  if (loading) return "Loading...";
  // TODO add toast error
  if (error) router.push("/login");

  return (
    <>
      <h1>Round detail page</h1>
    </>
  );
}
