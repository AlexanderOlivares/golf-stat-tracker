import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { IRoundPreview } from "../../pages/[username]/profile";
import { getNumeratorOfFairwaysHit, getStatAverage } from "../../utils/statChartHelpers";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export interface IAreaChartProps {
  roundPreview: IRoundPreview[];
  statKey: keyof IRoundPreview;
}

interface IChartTitleLookup {
  score: string;
  fairwaysHit: string;
  greensInReg: string;
  threePutts: string;
  totalPutts: string;
}

const titleLookup: IChartTitleLookup = {
  score: "Score",
  fairwaysHit: "FW Hit",
  greensInReg: "GIR",
  threePutts: "3-Putts",
  totalPutts: "Putts",
};

type statKeyType = keyof typeof titleLookup;

export default function AreaChart({ roundPreview, statKey }: IAreaChartProps) {
  const [average, setAverage] = useState<number | null>(null);
  const roundPreviewSortedAsc = [...roundPreview].sort(
    (a: IRoundPreview, b: IRoundPreview) => Date.parse(a.round_date) - Date.parse(b.round_date)
  );

  const labels = roundPreviewSortedAsc.map(round =>
    round.round_date.split("/").slice(0, 2).join("/")
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        data: roundPreviewSortedAsc.map(round => {
          if (statKey == "fairwaysHit") return getNumeratorOfFairwaysHit(round[statKey]);
          return round[statKey];
        }),

        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  useEffect(() => {
    const statKeyDataOnly = roundPreview.map(round => {
      if (statKey == "fairwaysHit") return getNumeratorOfFairwaysHit(round[statKey]);
      return round[statKey];
    });
    const avg = getStatAverage(statKeyDataOnly as number[]);
    setAverage(avg);
  }, []);

  return (
    <>
      <Box mb={2}>
        <Typography variant="body1">
          {`Avg ${titleLookup[statKey as statKeyType]} ${average}`}
        </Typography>
      </Box>
      <Line options={options} data={data} />
    </>
  );
}
