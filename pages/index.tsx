import { Box, Button, CardActions, Typography } from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import GolfCourseRoundedIcon from "@mui/icons-material/GolfCourseRounded";
import Link from "next/link";
import { useRouter } from "next/router";
import useMediaQuery from "../components/useMediaQuery";
import ImageCard from "../components/ImageCard";
import { landingPageContent } from "../content/LandingPage";
import Card from "@mui/material/Card";

const Home: NextPage = () => {
  const router = useRouter();
  const isMobile = useMediaQuery(600);
  function goToRegisterPage() {
    router.push(`/register`);
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <Box textAlign="center" my={3}>
        <Typography variant="h5">Go low with</Typography>
        <Typography variant="h2">Golf Logs</Typography>
        <Card
          sx={{
            margin: "auto",
            maxWidth: "sm",
            padding: 5,
            boxShadow: 4,
            marginTop: 2,
            marginBottom: 2,
          }}
        >
          <Box mb={1}>
            <GolfCourseRoundedIcon sx={{ fontSize: 125, mt: -3 }} />
          </Box>
          <Typography variant="h4">Do more than keep score</Typography>
          <Box textAlign="center" my={2}>
            <Typography variant="body1">
              Keep track of every single shot with Golf Logs. Record the club used, distance to pin
              and shot result to create a snapshot of each stroke. Golf Logs will help you learn
              your club distances, see your mishit tendancies and allow you to better understand
              your strengths on the golf course.
            </Typography>
          </Box>
          <hr style={{ maxWidth: isMobile ? "95%" : "95%" }} />
          <Box mt={2}>
            <Typography variant="h6">Create Golfer Account</Typography>
            <CardActions>
              <Button
                sx={{ margin: "auto", mt: 0 }}
                onClick={goToRegisterPage}
                variant="contained"
                size="large"
              >
                Register
              </Button>
            </CardActions>
          </Box>
          <Box mt={1}>
            <Link href="/login">
              <a>
                <Typography variant="subtitle2">
                  Already have an account?&nbsp;
                  <u>Login</u>
                </Typography>
              </a>
            </Link>
          </Box>
        </Card>
        <Box
          display="flex"
          justifyContent="space-evenly"
          alignItems="space-evenly"
          flexWrap="wrap"
          maxWidth={isMobile ? "sm" : "md"}
          sx={{ margin: "auto" }}
        >
          {landingPageContent.map(card => {
            return (
              <ImageCard
                key={card.title}
                title={card.title}
                image={card.image}
                alt={card.alt}
                value={card.value}
              />
            );
          })}
        </Box>
      </Box>
    </div>
  );
};

export default Home;
