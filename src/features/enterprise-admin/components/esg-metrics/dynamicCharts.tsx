import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
} from "recharts";

interface MetricData {
  period: string;
  industry: string;
  metricName: string;
  value: any;
  topicId: string;
  financialYear: string;
  dataType: string;
}

interface RawData {
  [metric: string]: {
    graph: string;
    data: MetricData[];
  };
}

// ---- Transformer ----
const prepareChartData = (rawData: RawData) => {
  const prepared: any = {};

  Object.entries(rawData).forEach(([metricName, { graph, data }]) => {
    if (graph === "pie") {
      prepared[metricName] = data.map((d) => ({
        name: d.period,
        value: Number(d.value),
      }));
    }

    if (graph === "bar") {
      // Table case → restructure rows
      if (data[0]?.dataType === "Table") {
        const tableValues = data[0].value; // [["HR","2","6"],["Tech","4","5"]]
        prepared[metricName] = tableValues.map((row: any) => ({
          department: row[0],
          Male: Number(row[1]),
          Female: Number(row[2]),
          Others: Number(row[3]),
        }));
      } else {
        prepared[metricName] = data.map((d) => ({
          period: d.period,
          value: Number(d.value),
        }));
      }
    }
  });

  return prepared;
};

// ---- Chart Renderer ----
const RenderChart = ({ metricName, chartData, type }: any) => {
  if (type === "pie") {
    return (
      <PieChart width={300} height={300}>
        <Pie
          dataKey="value"
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {chartData.map((_: any, index: number) => (
            <Cell
              key={`cell-${index}`}
              fill={["#8884d8", "#82ca9d", "#ffc658"][index % 3]}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    );
  }

  if (type === "bar" && chartData[0]?.department) {
    return (
      <BarChart width={400} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="department" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Male" fill="#8884d8" />
        <Bar dataKey="Female" fill="#82ca9d" />
        <Bar dataKey="Others" fill="#ffc658" />
      </BarChart>
    );
  }

  if (type === "bar") {
    return (
      <BarChart width={400} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    );
  }

  return null;
};

// ---- Example Usage ----
const rawData: RawData = {
  "Percentage of hazardous waste recycled": {
    graph: "pie",
    data: [
      { period: "August", industry: "Chemicals", metricName: "Percentage of hazardous waste recycled", value: "60", topicId: "Hazardous Waste Management", financialYear: "2025-2026", dataType: "Percentage" },
      { period: "July", industry: "Chemicals", metricName: "Percentage of hazardous waste recycled", value: "70", topicId: "Hazardous Waste Management", financialYear: "2025-2026", dataType: "Percentage" },
      { period: "June", industry: "Chemicals", metricName: "Percentage of hazardous waste recycled", value: "75", topicId: "Hazardous Waste Management", financialYear: "2025-2026", dataType: "Percentage" },
    ],
  },
  "Discussion of corporate positions related to government regulations and/or policy proposals that address environmental and social factors affecting the industry": {
    graph: "bar",
    data: [
      {
        period: "H1",
        industry: "Chemicals",
        metricName: "Discussion...",
        value: [
          ["HR", "2", "6", "1"],
          ["Technical", "8", "4", "2"],
        ],
        topicId: "Management of the Legal & Regulatory Environment",
        financialYear: "2025-2026",
        dataType: "Table",
      },
    ],
  },
};

export function DynamicChart() {
  const preparedData = prepareChartData(rawData);

  return (
    <div className="p-4 space-y-8">
      {Object.entries(rawData).map(([metricName, { graph }]) => (
        <div key={metricName} className="shadow-md rounded-lg p-4 border">
          <h2 className="text-lg font-semibold mb-2">{metricName}</h2>
          <RenderChart
            metricName={metricName}
            chartData={preparedData[metricName]}
            type={graph}
          />
        </div>
      ))}
    </div>
  );
}
