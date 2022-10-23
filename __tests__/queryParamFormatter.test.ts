import { queryParamToString } from "../utils/queryParamFormatter";
import { ParsedUrlQuery } from "querystring";

test("return query param values as string or first string in array. Else throw error", () => {
    const query: ParsedUrlQuery = {
        username: 'username123'
    }
    const query1: ParsedUrlQuery = {
        username: undefined
    }
    const query2: ParsedUrlQuery = {
        username: ["username456", "alex", "cool"]
    }

  expect(queryParamToString(query.username)).toEqual("username123");
  expect(() => queryParamToString(query1.username)).toThrow()
  expect(queryParamToString(query2.username)).toEqual("username456");
});