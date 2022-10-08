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
import { isEmptyObject, userAddedCourseObjectValidator } from "../../../utils/formValidator";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

interface IUserAddedCourse {
  userAddedCourseName: string;
  userAddedCity: string;
  userAddedState: string;
}

interface ICourseData {
  __typoename: string;
  course_name: string;
  course_id: string;
}

export default function NewRound() {
  const router = useRouter();
  const { loading, error, data } = useQuery(getCourses);
  const [holeCount, setHoleCount] = useState(18);
  const [roundView, setRoundView] = useState("scorecard");
  const [date, setDate] = useState<Dayjs | Date | null>(new Date());
  const [courseName, setCourseName] = useState<string>("");
  const [courseId, setCourseId] = useState<string>("");
  const [teeColor, setTeeColor] = useState<string>("white");
  const [isUserAddedCourse, setIsUserAddedCourse] = useState<boolean>(false);
  const [userAddedCourseDetails, setuserAddedCourseDetails] = useState<IUserAddedCourse>({
    userAddedCourseName: "",
    userAddedCity: "",
    userAddedState: "",
  });

  useEffect(() => {
    getCourseId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseName]);

  if (loading) return null;
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
    setCourseId("");
  }

  const handleTeeColorChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setTeeColor(event.target.value);
  };

  const handleHoleCountChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setHoleCount(Number(event.target.value));
  };

  const handleViewChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRoundView(event.target.value);
  };

  const handleCheckboxes = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setIsUserAddedCourse(event.target.checked);
    setCourseName("");
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

      const { username } = router.query;
      const roundid = uuidv4();

      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const roundDate = date?.toLocaleString("en-US", {
        timeZone,
      });

      let baseQueryParams = {
        holeCount,
        teeColor,
        roundView,
        roundDate,
        isUserAddedCourse,
      };

      const systemAddedParams = {
        courseName,
        courseId,
      };

      let userAddedParams = {};

      if (isUserAddedCourse) {
        const { userAddedCourseName, userAddedCity, userAddedState } = userAddedCourseDetails;
        const unverifiedCourseId = uuidv4();

        userAddedParams = {
          userAddedCourseName,
          userAddedCity,
          userAddedState,
          unverifiedCourseId,
        };
      }

      if (!userAddedCourseObjectValidator(userAddedParams) && isUserAddedCourse) {
        throw new Error("Please add course name, city and state to proceed");
      }

      if (!courseId && isEmptyObject(userAddedParams)) {
        throw new Error("Please select or add a course to proceed");
      }

      router.push(
        {
          pathname: `/${username}/round/${roundid}`,
          query: {
            ...baseQueryParams,
            ...(isUserAddedCourse ? userAddedParams : systemAddedParams),
          },
        },
        `/${username}/round/${roundid}`
      );
    } catch (error) {
      // TODO add toast error or remove
      console.log(error);
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
                Course
              </Typography>
              {data && (
                <Autocomplete
                  freeSolo
                  id="course-search-box"
                  autoSelect
                  disableClearable
                  value={courseName}
                  onChange={(_: any, courseName: string) => {
                    setCourseName(courseName);
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
                  <Checkbox onChange={handleCheckboxes} value={isUserAddedCourse} {...label} />
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
