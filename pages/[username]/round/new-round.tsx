import React, { useState } from "react";
import { useRouter } from "next/router";
import { Typography, Box, Button, TextField } from "@mui/material";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import Checkbox from "@mui/material/Checkbox";
import { getAuthTokenQuery } from "../../api/graphql/queries/authQueries";
import { useLazyQuery } from "@apollo/client";
import { v4 as uuidv4 } from "uuid";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

interface IUserAddedCourse {
  userAddedCourseName: string;
  city: string;
  state: string;
}

export default function NewRoundModal() {
  const router = useRouter();
  const [verifyAuth, lazyResults] = useLazyQuery(getAuthTokenQuery);
  const [holeCount, setHoleCount] = useState(18);
  const [roundView, setRoundView] = useState("hole-by-hole");
  const [date, setDate] = useState<Dayjs | Date | null>(new Date());
  const [courseName, setCourseName] = useState<string>("");
  const [isUserAddedCourse, setIsUserAddedCourse] = useState<boolean>(false);
  const [userAddedCourseDetails, setuserAddedCourseDetails] = useState<IUserAddedCourse>({
    userAddedCourseName: "",
    city: "",
    state: "",
  });

  const handleHoleCountChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setHoleCount(Number(event.target.value));
  };

  const handleViewChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRoundView(event.target.value);
  };

  const handleCourseInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setCourseName(event.target.value);
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
  console.log(userAddedCourseDetails);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();

      const { data, error } = await verifyAuth();

      // TODO add toast error
      if (error) {
        console.log(error.message);
        router.push("/login");
        return;
      }

      const { username } = data.token;
      const roundid = uuidv4();
      const roundDate = date?.toISOString();
      const { userAddedCourseName, city, state } = userAddedCourseDetails;

      router.push(
        {
          pathname: `/${username}/round/${roundid}`,
          query: {
            holeCount,
            roundView,
            roundDate,
            courseName,
            isUserAddedCourse,
            userAddedCourseName,
            city,
            state,
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
              <TextField
                disabled={isUserAddedCourse}
                onChange={handleCourseInput}
                id="search-courses"
                label="search courses"
                name="search courses"
                variant={isUserAddedCourse ? "filled" : "outlined"}
              />
              <Box>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  or
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
                      name="city"
                      variant="outlined"
                    />
                    <TextField
                      onChange={handleUserAddedCourseDetails}
                      id="user-added-course"
                      label="state"
                      name="state"
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
