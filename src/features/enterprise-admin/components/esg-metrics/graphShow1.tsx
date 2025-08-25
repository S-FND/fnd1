import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const rawMetricsData = {
  "Percentage of hazardous waste recycled": [
    { period: "August", value: "60", dataType: "Percentage", financialYear: "2025-2026" },
    { period: "July", value: "70", dataType: "Percentage", financialYear: "2025-2026" },
    { period: "June", value: "75", dataType: "Percentage", financialYear: "2025-2026" },
  ],
  "Total energy consumed": [
    { period: "July", value: "1.2", dataType: "Numeric", financialYear: "2025-2026" },
    { period: "August", value: "0.9", dataType: "Numeric", financialYear: "2025-2026" },
    { period: "June", value: "0.6", dataType: "Numeric", financialYear: "2025-2026" },
  ],
  "Gross global Scope 1 emissions": [
    { period: "August", value: "1.2", dataType: "Numeric", financialYear: "2025-2026" },
    { period: "July", value: "0.7", dataType: "Numeric", financialYear: "2025-2026" },
    { period: "June", value: "0.6", dataType: "Numeric", financialYear: "2025-2026" },
  ],
  "Air emissions of the pollutants: Hazardous air pollutants (HAPs)": [
    { period: "January", value: "1", dataType: "Percentage", financialYear: "2025-2026" },
    { period: "February", value: "2", dataType: "Percentage", financialYear: "2025-2026" },
    { period: "March", value: "3", dataType: "Percentage", financialYear: "2025-2026" },
    { period: "April", value: "4", dataType: "Percentage", financialYear: "2025-2026" },
    { period: "May", value: "5", dataType: "Percentage", financialYear: "2025-2026" },
    { period: "June", value: "6", dataType: "Percentage", financialYear: "2025-2026" },
    { period: "July", value: "7", dataType: "Percentage", financialYear: "2025-2026" },
    { period: "August", value: "8", dataType: "Percentage", financialYear: "2025-2026" },
    { period: "September", value: "122", dataType: "Percentage", financialYear: "2025-2026" },
    { period: "October", value: "10", dataType: "Percentage", financialYear: "2025-2026" },
    { period: "November", value: "11", dataType: "Percentage", financialYear: "2025-2026" },
    { period: "December", value: "12", dataType: "Percentage", financialYear: "2025-2026" },
  ],
  "Air emissions of the pollutants: Volatile organic compounds (VOCs)": [
    { period: "Q2", value: "20", dataType: "Numeric", financialYear: "2025-2026" },
  ],
};

const monthOrder = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
  Q1: 13,
  Q2: 14,
  Q3: 15,
  Q4: 16,
};

export default function MetricsGraph1() {
  const [view, setView] = useState("monthly");
  const [chartType, setChartType] = useState("line");

  const metricsData = useMemo(() => {
    const out = {};
    for (const k of Object.keys(rawMetricsData)) {
      out[k] = rawMetricsData[k]
        .map((e) => ({ ...e, value: Number(e.value) }))
        .sort((a, b) => {
          const av = monthOrder[a.period] ?? Number.MAX_SAFE_INTEGER;
          const bv = monthOrder[b.period] ?? Number.MAX_SAFE_INTEGER;
          return av - bv;
        });
    }
    return out;
  }, []);

  const yearlyData = useMemo(() => {
    const yearly = {};
    for (const metric of Object.keys(metricsData)) {
      const entries = metricsData[metric];
      const groups = {};
      for (const e of entries) {
        const y = e.financialYear;
        if (!groups[y]) groups[y] = { total: 0, count: 0, dataType: e.dataType };
        groups[y].total += e.value;
        groups[y].count += 1;
      }
      yearly[metric] = Object.keys(groups)
        .sort()
        .map((y) => {
          const g = groups[y];
          const v = g.dataType === "Numeric" ? g.total : g.total / g.count;
          return { year: y, value: v, dataType: g.dataType };
        });
    }
    return yearly;
  }, [metricsData]);

  const renderChart = (metric, data) => {
    if (!data || data.length === 0) return null;
    const xKey = view === "monthly" ? "period" : "year";
    const baseline = 50;
    const target = 100;
  
    let chartElement: React.ReactElement | null = null;
  
    if (chartType === "line") {
      chartElement = (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <ReferenceLine y={baseline} stroke="blue" label="Baseline" />
          <ReferenceLine y={target} stroke="red" label="Target" />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      );
    } else if (chartType === "bar") {
      chartElement = (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <ReferenceLine y={baseline} stroke="blue" label="Baseline" />
          <ReferenceLine y={target} stroke="red" label="Target" />
          <Bar dataKey="value" fill="#82ca9d" />
        </BarChart>
      );
    } else if (chartType === "area") {
      chartElement = (
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <ReferenceLine y={baseline} stroke="blue" label="Baseline" />
          <ReferenceLine y={target} stroke="red" label="Target" />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.3}
          />
        </AreaChart>
      );
    } else if (chartType === "radar") {
      chartElement = (
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey={xKey} />
          <PolarRadiusAxis />
          <Radar
            name="Value"
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Legend />
        </RadarChart>
      );
    }
  
    return (
      <Card className="mb-6 shadow-lg rounded-2xl" key={metric}>
        <CardContent>
          <h2 className="text-lg font-semibold mb-4">{metric}</h2>
          <ResponsiveContainer width="100%" height={300}>
            {chartElement}
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };
  

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-6 flex-wrap">
        <Button variant={view === "monthly" ? "default" : "outline"} onClick={() => setView("monthly")}>
          Monthly View
        </Button>
        <Button variant={view === "yearly" ? "default" : "outline"} onClick={() => setView("yearly")}>
          Yearly View
        </Button>
        <Button variant={chartType === "line" ? "default" : "outline"} onClick={() => setChartType("line")}>
          Line
        </Button>
        <Button variant={chartType === "bar" ? "default" : "outline"} onClick={() => setChartType("bar")}>
          Bar
        </Button>
        <Button variant={chartType === "area" ? "default" : "outline"} onClick={() => setChartType("area")}>
          Area
        </Button>
        <Button variant={chartType === "radar" ? "default" : "outline"} onClick={() => setChartType("radar")}>
          Radar
        </Button>
      </div>
      {Object.keys(view === "monthly" ? metricsData : yearlyData).map((metric) =>
        renderChart(metric, view === "monthly" ? metricsData[metric] : yearlyData[metric])
      )}
    </div>
  );
}
