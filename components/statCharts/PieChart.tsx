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
import { Box } from "@mui/material";

export interface IPieChartProps {
  data: (IRoundPreview | number)[];
  labels: (keyof IRoundPreview)[];
  pieSliceHexArr: string[];
}

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data, labels, pieSliceHexArr }: IPieChartProps) {
  // don't show if all stats are zero
  const showPieChart = !data.every(stat => stat == 0);

  const chartData = {
    labels: labels.map((label: string) => label.replace(/_/g, " ")),
    datasets: [
      {
        label: "Count",
        data,
        backgroundColor: pieSliceHexArr,
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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

  return (
    <>
      {showPieChart && (
        <Box maxWidth="500" m={1}>
          <Pie width={500} height={500} data={chartData} options={options} />
        </Box>
      )}
    </>
  );
}
