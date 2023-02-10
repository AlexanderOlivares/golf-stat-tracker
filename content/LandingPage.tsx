export interface IImageCard {
  title: string;
  image: string;
  value: string;
  alt: string;
}

export const landingPageContent: IImageCard[] = [
  {
    title: "Distance, club, result, and score",
    image: "./images/holeshotmodal.png",
    alt: "Menu to input hole score, distance, club and result",
    value: "That's all it takes to generate your stats. It's as easy as a tap-in putt",
  },
  {
    title: "Play To Your Potential",
    image: "./images/round.png",
    alt: "Scorecard with golf stats",
    value: "Celebrate your strengths. Learn your weaknesses. Find areas to improve.",
  },
  {
    title: "Track Your Trends",
    image: "./images/girTrend.png",
    alt: "Area charts of golf scores and fairways hit",
    value: "Visualize your improvement with our in-depth stat trends and metrics",
  },
  {
    title: "Scoring Breakdown",
    image: "./images/cutoffPie.png",
    alt: "Pie chart of golf scores over a round",
    value: "Visualize your scoring on the golf course. Stay out of the red!",
  },
  {
    title: "Build Your Bag",
    image: "./images/chip.png",
    alt: "Club selection menu",
    value: "Select your sticks and dial-in your iron and wedge distances. No caddy needed",
  },
  {
    title: "Offline Mode",
    image: "./images/offlinemode.png",
    alt: "Offline mode menu",
    value: "No signal? No problem. Track your shots even when there's no service on the course",
  },
];
