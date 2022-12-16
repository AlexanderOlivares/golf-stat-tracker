import { IShotDetail } from "../utils/roundFormatter";

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
  clubs: string[];
  hole_scores: number[];
  hole_shot_details: IShotDetail[][];
}