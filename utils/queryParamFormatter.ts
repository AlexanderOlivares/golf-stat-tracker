export function queryParamToString(queryParam: string | string[] | undefined): string {
  if (!queryParam) return "";
  if (Array.isArray(queryParam)) return queryParam[0];
  return String(queryParam);
}

export function queryParamToBoolean(queryParam: string | string[] | undefined): boolean {
  if (!queryParam?.length) return false;
  if (queryParam === "false") return false;
  if (queryParam === "true") return true;
  return Boolean(queryParam);
}
