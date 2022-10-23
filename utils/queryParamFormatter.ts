export function queryParamToString(queryParam: string | string[] | undefined): string {
  if (!queryParam) {
    throw new Error("Please login");
  }
  if (Array.isArray(queryParam)) {
    return queryParam[0];
  }
  return String(queryParam);
}