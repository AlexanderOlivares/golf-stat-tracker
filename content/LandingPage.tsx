export interface IImageCard {
  title: string;
  image: string;
  value: string;
  alt: string;
  buttonOneText?: string;
  buttonTwoText?: string;
}

export const landingPageContent: IImageCard[] = [
  {
    title: "Build Your Bag",
    image: "./",
    alt: "",
    value: "Select your sticks and dial-in your iron and wedge distances",
  },
  {
    title: "Offline Mode",
    image: "./",
    alt: "",
    value: "No signal? No problem. Track your shots even when service is bad out on the course",
  },
  {
    title: "Track Your Trends",
    image: "./",
    alt: "",
    value: "See your improvement round-over-round with our in-depth stat trends",
  },
  {
    title: "Scoring Breakdown",
    image: "./",
    alt: "",
    value:
      "How often do you scramble for par or better? How many times do you go up and down per round? Visualize how you are scoring on the golf course and stay out of the red!",
  },
  {
    title: "Play To Your Potential",
    image: "./",
    alt: "",
    value:
      "Know what could've been. See your potential score without mistakes like penalty strokes, mishits and 3-putts",
  },
];
