import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  LegendItem,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { IRoundPreview } from "../../pages/[username]/profile";
import { scoreCountByNameArray } from "../../utils/statChartHelpers";

export interface IPieChartProps {
  data: (IRoundPreview | number)[];
  labels: (keyof IRoundPreview)[];
}

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data, labels }: IPieChartProps) {
  const showPieChart = !data.every(e => e && e != 0);

  const chartData = {
    labels: labels.map((label: string) => label.replace(/_/g, " ")),
    datasets: [
      {
        label: "Count",
        data,
        backgroundColor: [
          "#212121",
          "#b0bec5",
          "#b39ddb",
          "#64b5f6",
          "#a5d6a7",
          "#fdd835",
          "#ff9800",
          "#ff5252",
          "#e53935",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          filter: (legendItem: LegendItem, data: ChartData) => {
            const index = legendItem.index;
            return index ? data.datasets[0].data[index] != 0 : false;
          },
        },
      },
    },
  };

  return <>{showPieChart && <Pie data={chartData} options={options} />}</>;
}
