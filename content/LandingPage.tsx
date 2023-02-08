export interface IImageCard {
  title: string;
  image: string;
  value: string;
  alt: string;
}

export const landingPageContent: IImageCard[] = [
  {
    title: "Track Your Trends",
    image: "./images/trends.png",
    alt: "Area charts of golf scores and fairways hit",
    value: "See your round-over-round improvement with our in-depth stat trends",
  },
  {
    title: "Scoring Breakdown",
    image: "./images/scorepiechart.png",
    alt: "Pie chart of golf scores over a round",
    value: "Visualize your scoring on the golf course. Stay out of the red!",
  },
  {
    title: "Distance, club, result, and score",
    image: "./images/holedetailsmodal.png",
    alt: "Menu to input hole score, distance, club and result",
    value: "That's it. Golf Logs will handle the the stats. It's as easy as a tap-in putt",
  },
  {
    title: "Play To Your Potential",
    image: "./images/scorecard.png",
    alt: "Scorecard with golf stats",
    value: "See your strengths. Learn your weaknesses. Find areas to improve.",
  },
  {
    title: "Build Your Bag",
    image: "./images/clubs.png",
    alt: "Club selection menu",
    value: "Select your sticks and dial-in your iron and wedge distances. No caddy needed",
  },
  {
    title: "Offline Mode",
    image: "./images/offline.png",
    alt: "Offline mode menu",
    value: "No signal? No problem. Track your shots even when there's no service on the course",
  },
];
