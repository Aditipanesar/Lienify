
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(BarElement, Tooltip, CategoryScale, LinearScale, Legend, Filler);

const Graph = ({ graphData = [] }) => {
  // Read CSS vars at render time so chart respects theme
  const root = document.documentElement;
  const style = getComputedStyle(root);
  const isDark = root.getAttribute("data-theme") === "dark";

  const barColor     = isDark ? "#818cf8" : "#8b5cf6";
  const emptyColor   = isDark ? "rgba(129,140,248,0.08)" : "rgba(139,92,246,0.1)";
  const tickColor    = isDark ? "#5a6a8a" : "#9b85b0";
  const titleColor   = isDark ? "#7a8aaa" : "#5a4870";
  const gridColor    = isDark ? "rgba(100,120,190,0.1)" : "rgba(90,72,112,0.08)";
  const legendColor  = isDark ? "#7a8aaa" : "#5a4870";
  const tooltipBg    = isDark ? "rgba(15,19,32,0.95)" : "rgba(255,255,255,0.95)";
  const tooltipTxt   = isDark ? "#dde3f0" : "#1a1025";

  const labels = graphData.map((item) => `${item.clickDate}`);
  const counts = graphData.map((item) => item.count);

  const data = {
    labels: graphData.length > 0
      ? labels
      : ["", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    datasets: [
      {
        label: "Total Clicks",
        data: graphData.length > 0
          ? counts
          : [1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1],
        backgroundColor: graphData.length > 0 ? barColor : emptyColor,
        borderColor: "transparent",
        borderRadius: 6,
        fill: true,
        tension: 0.4,
        barThickness: 22,
        categoryPercentage: 1.5,
        barPercentage: 1.5,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: { color: legendColor, font: { size: 13 } },
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipTxt,
        bodyColor: tooltipTxt,
        borderColor: isDark ? "rgba(100,120,190,0.2)" : "rgba(139,92,200,0.2)",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: gridColor },
        ticks: {
          color: tickColor,
          font: { size: 12 },
          callback: (v) => Number.isInteger(v) ? v.toString() : "",
        },
        title: {
          display: true,
          text: "Number of Clicks",
          color: titleColor,
          font: { size: 13, weight: "600" },
        },
      },
      x: {
        beginAtZero: true,
        grid: { color: gridColor },
        ticks: { color: tickColor, font: { size: 12 } },
        title: {
          display: true,
          text: "Date",
          color: titleColor,
          font: { size: 13, weight: "600" },
        },
      },
    },
  };

  return <Bar className="w-full" data={data} options={options} />;
};

export default Graph;
