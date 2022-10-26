import { queryParamToString, queryParamToBoolean } from "../utils/queryParamFormatter";
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
  expect(queryParamToString(query1.username)).toEqual("")
  expect(queryParamToString(query2.username)).toEqual("username456");
});


test("should convert ParsedUrlQuery type strings of 'true' and 'false' to real booleans", () => {
    const query: ParsedUrlQuery = {
        is_user_added_course: "true"
    }
    const query1: ParsedUrlQuery = {
        is_user_added_course: "false"
    }
    const query2: ParsedUrlQuery = {
        is_user_added_course: undefined
    }
    const query3: ParsedUrlQuery = {
        is_user_added_course: ["username456", "alex", "cool"]
    }
    const query4: ParsedUrlQuery = {
        is_user_added_course: []
    }

  expect(queryParamToBoolean(query.is_user_added_course)).toEqual(true);
  expect(queryParamToBoolean(query1.is_user_added_course)).toEqual(false)
  expect(queryParamToBoolean(query2.is_user_added_course)).toEqual(false);
  expect(queryParamToBoolean(query3.is_user_added_course)).toEqual(true);
  expect(queryParamToBoolean(query4.is_user_added_course)).toEqual(false);
});