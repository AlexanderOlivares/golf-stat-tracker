import React from "react";
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
import { getNumeratorOfFairwaysHit } from "../../utils/statChartHelpers";

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
  const roundPreviewSortedAsc = [...roundPreview].sort(
    (a: IRoundPreview, b: IRoundPreview) => Date.parse(a.round_date) - Date.parse(b.round_date)
  );

  // maybe shorten this even more to mm/dd format
  const labels = roundPreviewSortedAsc.map(round => round.round_date.split(",")[0]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: titleLookup[statKey as statKeyType],
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Dataset 2",
        data: roundPreviewSortedAsc.map(round => {
          if (statKey == "fairwaysHit") return getNumeratorOfFairwaysHit(round[statKey]);
          return round[statKey];
        }),

        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  return <Line options={options} data={data} />;
}
