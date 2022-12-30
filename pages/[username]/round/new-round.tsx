import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Typography, Box, Button, TextField } from "@mui/material";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import Checkbox from "@mui/material/Checkbox";
import { getCourses } from "../../api/graphql/queries/courseQueries";
import { useQuery } from "@apollo/client";
import { v4 as uuidv4 } from "uuid";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Autocomplete from "@mui/material/Autocomplete";
import MenuItem from "@mui/material/MenuItem";
import Slider from "@mui/material/Slider";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { validUserAddedCourseFields } from "../../../utils/formValidator";
import { queryParamToString } from "../../../utils/queryParamFormatter";
import { useMutation } from "@apollo/client";
import { createNewRound } from "../../api/graphql/mutations/roundMutations";
import { useNetworkContext } from "../../../context/NetworkContext";
import { parseErrorMessage } from "../../../utils/errorMessage";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../components/LoadingSpinner";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export interface IUserAddedCourse {
  userAddedCourseName: string;
  userAddedCity: string;
  userAddedState: string;
}

interface ICourseData {
  __typename: string;
  course_name: string;
  course_id: string;
}

export interface IRoundRequestBody {
  roundid: string;
  courseName: string | null;
  courseId: string | null;
  username: string;
  holeCount: number;
  teeColor: string;
  roundDate: string | null;
  frontOrBackNine: string;
  isUserAddedCourse: boolean;
  weatherConditions: string;
  temperature: number;
  userAddedCourseName?: string;
  userAddedCity?: string;
  userAddedState?: string;
  unverifiedCourseId?: string | null;
  hole_scores?: number[];
  hole_shot_details?: string;
}
export function populateUserAddedCourseFields(
  isUserAddedCourse: boolean,
  userAddedCourseDetails: IUserAddedCourse
) {
  if (!isUserAddedCourse) {
    return {
      userAddedCourseName: "",
      userAddedCity: "",
      userAddedState: "",
      unverifiedCourseId: null,
    };
  }

  const { userAddedCourseName, userAddedCity, userAddedState } = userAddedCourseDetails;
  const unverifiedCourseId = uuidv4();

  return {
    userAddedCourseName,
    userAddedCity,
    userAddedState,
    unverifiedCourseId,
  };
}

export default function NewRound() {
  const router = useRouter();
  const networkContext = useNetworkContext();
  const [newRound] = useMutation(createNewRound);
  const { loading, error, data } = useQuery(getCourses);
  const [holeCount, setHoleCount] = useState(18);
  const [frontOrBackNine, setFrontOrBackNine] = useState("front 9");
  const [roundView, setRoundView] = useState("scorecard");
  const [date, setDate] = useState<Dayjs | Date | null>(new Date());
  const [courseName, setCourseName] = useState<string | null>(null);
  const [displayCourseName, setDisplayCourseName] = useState<string>("");
  const [courseId, setCourseId] = useState<string | null>(null);
  const [teeColor, setTeeColor] = useState<string>("white");
  const [isUserAddedCourse, setIsUserAddedCourse] = useState<boolean>(false);
  const [weatherConditions, setWeatherConditions] = useState<string>("");
  const [temperature, setTemperature] = useState<number>(70);
  const [userAddedCourseDetails, setuserAddedCourseDetails] = useState<IUserAddedCourse>({
    userAddedCourseName: "",
    userAddedCity: "",
    userAddedState: "",
  });

  useEffect(() => {
    getCourseId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseName]);

  useEffect(() => {
    networkContext.dispatch({
      type: "update offline mode enabled",
      payload: {
        ...networkContext.state,
        offlineModeEnabled: false, // we need to be online for a new round
      },
    });
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return `Error! ${error}`;

  function getCourseId() {
    if (data) {
      const { courses }: { courses: ICourseData[] } = data;
      const foundMatchingCourse = courses.find(
        (course: ICourseData) => course.course_name == courseName
      );
      if (foundMatchingCourse) {
        setCourseId(foundMatchingCourse.course_id);
        return;
      }
    }
    setCourseId(null);
  }

  const handleTeeColorChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setTeeColor(event.target.value);
  };

  const handleHoleCountChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setHoleCount(Number(event.target.value));
  };

  const handleFrontBackSelection = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFrontOrBackNine(event.target.value);
  };

  const handleViewChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRoundView(event.target.value);
  };

  const handleCheckboxes = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setIsUserAddedCourse(event.target.checked);
    setCourseName(null);
    setDisplayCourseName("");
    setCourseId(null);
  };

  const handleWeatherConditionsChange = (event: SelectChangeEvent): void => {
    setWeatherConditions(event.target.value);
  };

  const handleTemperatureChange = (_: Event, newValue: number | number[]) => {
    setTemperature(newValue as number);
  };

  const handleUserAddedCourseDetails = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value }: { name: string; value: string } = event.target;
    setuserAddedCourseDetails(prev => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();

      const username = queryParamToString(router.query.username);

      const roundid = uuidv4();
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const roundDate =
        date?.toLocaleString("en-US", {
          timeZone,
        }) || null;

      const requestFieldList = {
        roundid,
        courseName,
        courseId,
        username,
        holeCount,
        teeColor,
        roundDate,
        frontOrBackNine,
        isUserAddedCourse,
        weatherConditions,
        temperature,
      };

      const userAddedCourseFields = populateUserAddedCourseFields(
        isUserAddedCourse,
        userAddedCourseDetails
      );

      if (isUserAddedCourse && !validUserAddedCourseFields(userAddedCourseFields)) {
        throw new Error("Please add course name, city and state to proceed");
      }

      if (!courseName && !isUserAddedCourse) {
        throw new Error("Please select or add a course to proceed");
      }

      const newRoundRequestBody: IRoundRequestBody = {
        ...requestFieldList,
        ...userAddedCourseFields,
      };

      await newRound({
        variables: newRoundRequestBody,
      });

      router.push(
        {
          pathname: `/${username}/round/${roundid}`,
          query: {
            roundid,
            courseId,
            teeColor,
            isUserAddedCourse,
            unverifiedCourseId: newRoundRequestBody.unverifiedCourseId,
          },
        },
        `/${username}/round/${roundid}`
      );
    } catch (error) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    }
  }

  return (
    <>
      <Box m={10}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          New Round
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <Box>
            <FormControl>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Course Name
              </Typography>
              {data && (
                <Autocomplete
                  freeSolo
                  id="course-search-box"
                  autoSelect
                  disableClearable
                  value={displayCourseName}
                  onChange={(_: any, courseName: string) => {
                    setCourseName(courseName);
                    setDisplayCourseName(courseName);
                    setIsUserAddedCourse(false);
                  }}
                  options={data.courses.map((row: ICourseData) => row.course_name)}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Search Courses"
                      InputProps={{
                        ...params.InputProps,
                        type: "search",
                      }}
                    />
                  )}
                />
              )}
              <Box>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Dont see your course?
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <Checkbox onChange={handleCheckboxes} checked={isUserAddedCourse} {...label} />
                  Add new course with round
                </Typography>
                {isUserAddedCourse && (
                  <Box>
                    <TextField
                      onChange={handleUserAddedCourseDetails}
                      id="user-added-course"
                      label="course name"
                      name="userAddedCourseName"
                      variant="outlined"
                    />
                    <TextField
                      onChange={handleUserAddedCourseDetails}
                      id="user-added-course"
                      label="city"
                      name="userAddedCity"
                      variant="outlined"
                    />
                    <TextField
                      onChange={handleUserAddedCourseDetails}
                      id="user-added-course"
                      label="state"
                      name="userAddedState"
                      variant="outlined"
                    />
                  </Box>
                )}
              </Box>
              <Box mt={5}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date of round"
                    value={date}
                    onChange={newValue => {
                      setDate(newValue);
                    }}
                    renderInput={params => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Box>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Holes
              </Typography>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={holeCount}
                onChange={handleHoleCountChange}
              >
                <span>
                  <FormControlLabel value="9" control={<Radio />} label="9" />
                  <FormControlLabel value="18" control={<Radio />} label="18" />
                </span>
              </RadioGroup>
              {holeCount == 9 && (
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={frontOrBackNine}
                  onChange={handleFrontBackSelection}
                >
                  <span>
                    <FormControlLabel value="front" control={<Radio />} label="front 9" />
                    <FormControlLabel value="back" control={<Radio />} label="back 9" />
                  </span>
                </RadioGroup>
              )}
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Tee Color
              </Typography>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={teeColor}
                onChange={handleTeeColorChange}
              >
                <span>
                  <FormControlLabel value="red" control={<Radio />} label="red" />
                  <FormControlLabel value="white" control={<Radio />} label="white" />
                  <FormControlLabel value="blue" control={<Radio />} label="blue" />
                </span>
              </RadioGroup>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Select View
              </Typography>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={roundView}
                onChange={handleViewChange}
              >
                <FormControlLabel value="scorecard" control={<Radio />} label="scorecard view" />
                <FormControlLabel
                  value="hole-by-hole"
                  control={<Radio />}
                  label="hole-by-hole view"
                />
              </RadioGroup>
              <Typography>Conditions</Typography>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={weatherConditions}
                label="Weather"
                onChange={handleWeatherConditionsChange}
              >
                <MenuItem value={"Clear"}>Clear</MenuItem>
                <MenuItem value={"Windy"}>Windy</MenuItem>
                <MenuItem value={"Rainy"}>Rainy</MenuItem>
                <MenuItem value={"Wet"}>Wet</MenuItem>
                <MenuItem value={"Foggy"}>Foggy</MenuItem>
              </Select>
              <Typography>Temperature</Typography>
              <Slider
                aria-label="Temperature"
                defaultValue={70}
                step={5}
                min={20}
                max={115}
                valueLabelDisplay="on"
                onChange={handleTemperatureChange}
              />
            </FormControl>
          </Box>
          <Button type="submit" size="small" variant="contained" color="primary">
            start round
          </Button>
          <Button size="small" variant="contained" color="primary">
            cancel
          </Button>
        </Box>
      </Box>
    </>
  );
}
