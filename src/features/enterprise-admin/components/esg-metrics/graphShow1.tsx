import React, { useEffect, useMemo, useState } from "react";
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
import ManualESGDDPage from "../../pages/ManualESGDD";
import { logger } from "@/hooks/logger";

// let rawMetricsData = {
//   "Percentage of hazardous waste recycled": [
//     { period: "August", value: "60", dataType: "Percentage", financialYear: "2025-2026" },
//     { period: "July", value: "70", dataType: "Percentage", financialYear: "2025-2026" },
//     { period: "June", value: "75", dataType: "Percentage", financialYear: "2025-2026" },
//   ],
//   "Total energy consumed": [
//     { period: "July", value: "1.2", dataType: "Numeric", financialYear: "2025-2026" },
//     { period: "August", value: "0.9", dataType: "Numeric", financialYear: "2025-2026" },
//     { period: "June", value: "0.6", dataType: "Numeric", financialYear: "2025-2026" },
//   ],
//   "Gross global Scope 1 emissions": [
//     { period: "August", value: "1.2", dataType: "Numeric", financialYear: "2025-2026" },
//     { period: "July", value: "0.7", dataType: "Numeric", financialYear: "2025-2026" },
//     { period: "June", value: "0.6", dataType: "Numeric", financialYear: "2025-2026" },
//   ],
//   "Air emissions of the pollutants: Hazardous air pollutants (HAPs)": [
//     { period: "January", value: "1", dataType: "Percentage", financialYear: "2025-2026" },
//     { period: "February", value: "2", dataType: "Percentage", financialYear: "2025-2026" },
//     { period: "March", value: "3", dataType: "Percentage", financialYear: "2025-2026" },
//     { period: "April", value: "4", dataType: "Percentage", financialYear: "2025-2026" },
//     { period: "May", value: "5", dataType: "Percentage", financialYear: "2025-2026" },
//     { period: "June", value: "6", dataType: "Percentage", financialYear: "2025-2026" },
//     { period: "July", value: "7", dataType: "Percentage", financialYear: "2025-2026" },
//     { period: "August", value: "8", dataType: "Percentage", financialYear: "2025-2026" },
//     { period: "September", value: "122", dataType: "Percentage", financialYear: "2025-2026" },
//     { period: "October", value: "10", dataType: "Percentage", financialYear: "2025-2026" },
//     { period: "November", value: "11", dataType: "Percentage", financialYear: "2025-2026" },
//     { period: "December", value: "12", dataType: "Percentage", financialYear: "2025-2026" },
//   ],
//   "Air emissions of the pollutants: Volatile organic compounds (VOCs)": [
//     { period: "Q2", value: "20", dataType: "Numeric", financialYear: "2025-2026" },
//   ],
// };


interface DataRow {
  period: string;
  industry: string;
  metricName: string;
  value: string[][];
  topicId: string;
  financialYear: string;
  dataType: string;
}

const monthOrder = {
  April: 1,
  May: 2,
  June: 3,
  July: 4,
  August: 5,
  September: 6,
  October: 7,
  November: 8,
  December: 9,
  January: 10,
  February: 11,
  March: 12,
  Q1: 13,
  Q2: 14,
  Q3: 15,
  Q4: 16,
};

const colors = [
  "#537D5D", "#73946B", "#9EBC8A", "#D2D0A0",
  "#3E5A49",
  "#6A856A",
  "#88A07D",
  "#B7C79D",
  "#E2E2C0",
  "#4A6E60",
  "#7FA087",
  "#A9C1A2",
  "#C9D7B6",
  "#ECE9D6"
];


// const inputData: DataRow[] = [
//   {
//     period: "H1",
//     industry: "Chemicals",
//     metricName:
//       "Discussion of corporate positions related to government regulations and/or policy proposals that address environmental and social factors affecting the industry",
//     value: [
//       ["HR", "2", "6", "1"],
//       ["Technical", "8", "4", "2"],
//     ],
//     topicId: "Management of the Legal & Regulatory Environment",
//     financialYear: "2025-2026",
//     dataType: "Table",
//   },
//   {
//     period: "H2",
//     industry: "Chemicals",
//     metricName:
//       "Discussion of corporate positions related to government regulations and/or policy proposals that address environmental and social factors affecting the industry",
//     value: [
//       ["HR", "21", "16", "10"],
//       ["Technical", "18", "14", "12"],
//     ],
//     topicId: "Management of the Legal & Regulatory Environment",
//     financialYear: "2025-2026",
//     dataType: "Table",
//   },
// ];

export default function MetricsGraph1({ graphData, selectedMetric, selectedPeriod, selectedYear }) {
  const [view, setView] = useState("monthly");
  const [chartType, setChartType] = useState("line");
  const [rawMetricsData, setRawMetricsData] = useState(null);
  const [dataType, setDataType] = useState(null);
  const [units, setUnits] = useState(null)
  // const [inputData, setInputData] = useState([])
  const [yAxis, setYAxis] = useState([])
  const [xAxis, setXAxis] = useState([])

  useEffect(() => {
    // console.log("Selected Metric:", selectedMetric);
    // console.log("Selected Period:", selectedPeriod);
    // console.log("Selected Year:", selectedYear);
    logger.log("Initial Graph Data:", graphData);
    if (graphData && Object.keys(graphData).length > 0) {
      // If a specific metric is selected, filter to that metric
      if (selectedMetric && graphData[selectedMetric]) {
        const metricData = graphData[selectedMetric].data
        setUnits(graphData[selectedMetric]['units'])
        if (graphData[selectedMetric]['graphData']['xAxisLabels']) {
          setXAxis(graphData[selectedMetric]['graphData']['xAxisLabels'])
        }
        if (graphData[selectedMetric]['graphData']['yAxisLabels']) {
          setYAxis(graphData[selectedMetric]['graphData']['yAxisLabels'])
        }
        else{
          setYAxis(['Male','Female','Others'])
        }
        // If a specific year is selected, filter to that year
        // console.log("Metric Data for selected metric:", metricData);
        // console.log("Filtering data for metric:", selectedMetric, "and year:", selectedYear);
        if (selectedYear) {
          const filteredData = metricData.filter(
            (e) => e.financialYear === selectedYear
          );
          if (filteredData.length > 0) {
            setDataType(filteredData[0].dataType);
          }
          // console.log("Filtered Data:", filteredData);
          setRawMetricsData({ [selectedMetric]: filteredData });
          // rawMetricsData[selectedMetric] = filteredData;
          // graphData[selectedMetric] = filteredData;
        } else {
          graphData[selectedMetric] = metricData;
        }
      } else {
        // If no specific metric is selected, convert all values to numbers
        // for (const k of Object.keys(graphData)) {
        //   graphData[k] = graphData[k].map((e) => ({
        //     ...e,
        //     value: Number(e.value),
        //   }));
        // }
      }
    }
  }, [graphData, selectedMetric, selectedYear]);

  const metricsData = useMemo(() => {
    const out = {};
    if (rawMetricsData) {
      for (const k of Object.keys(rawMetricsData)) {
        out[k] = rawMetricsData[k]
          .map((e) => ({ ...e, value: typeof e.value == 'object' ? e.value : Number(e.value) }))
          .sort((a, b) => {
            const av = monthOrder[a.period] ?? Number.MAX_SAFE_INTEGER;
            const bv = monthOrder[b.period] ?? Number.MAX_SAFE_INTEGER;
            return av - bv;
          });
      }
    }
    return out;
  }, [rawMetricsData]);

  // useEffect(() => {
  //   console.log("Processed rawMetricsData Data:", rawMetricsData);
  //   // setInputData(Object.values(rawMetricsData)[0].map(e => ({ period: e.period, value: e.value, industry: e.industry, })))
  // }, [rawMetricsData]);

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

  const renderChart = (metric, data, dataType = null) => {
    if (!data || data.length === 0) return null;
    // console.log("Rendering chart for metric:", metric, "with data:", data);
    // console.log("View:",view)
    const xKey = view === "monthly" ? "period" : "year";
    const baseline = 50;
    const target = 100;

    let chartElement: React.ReactElement | null = null;

    if (chartType === "line") {
      if (dataType && dataType === "Table") {
        logger.log("Rendering table chart for metric:", metric, "with data:", data);
        // Detect genders dynamically from inputData
        if (xAxis.length === 0) {
          // alert("This has no xaxis")
          logger.log('yAxis', yAxis)
          data.forEach(item => {
            const numericCols = item.value[0].length; // since there’s no label, all are numbers
            if (yAxis.length !== numericCols) {
              throw new Error(
                `yAxis length (${yAxis.length}) does not match numeric columns length (${numericCols}) for period ${item.period}`
              );
            }
          });
          const transformedData = data.map(item => {
            const obj: any = { period: item.period };
          
            // Map each numeric column to corresponding yAxis key
            item.value[0].forEach((val, idx) => {
              obj[yAxis[idx]] = val;
            });
          
            return obj;
          });
          logger.log('tansformedData', transformedData)
          chartElement = (
            <BarChart
              data={transformedData}
              margin={{ top: 20, right: 30, left: 40, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" angle={-45} textAnchor="end" height={60} />
              <YAxis
                label={{
                  value: `${units}`, // <-- your unit
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle" }
                }}
              />
              <Tooltip />
              <Legend />
              {/* Grouped Bars */}
              {yAxis?.map((label, i) => (
                <Bar
                  key={label}
                  dataKey={label}
                  fill={colors[i % colors.length]}
                />
              ))}
              {/* <Bar dataKey="Male" fill={colors[0]} />
              <Bar dataKey="Female" fill={colors[1]} />
              <Bar dataKey="Others" fill={colors[2]} /> */}
            </BarChart>
          )
        }
        else {
          const inputData = data.map(e => ({
            period: e.period,
            value: e.value,
            industry: e.industry,
          }));
          let detectedGenders = Array.from(
            new Set(inputData?.flatMap((period) => period.value.flatMap((row) => row.slice(1).map((_, idx) => idx))))
          ).map((idx: number) => {
            return yAxis[idx] || ''

          });
          logger.log('detectedGenders',detectedGenders)
          //Testing
          // detectedGenders = ['Column1', 'Column2', 'Column3'];
          // Transform inputData dynamically
          const chartData = inputData?.map((periodData) => {
            const row: any = { period: periodData.period };
            periodData.value.forEach((values) => {
              const dept = values[0];
              values.slice(1).forEach((val, idx) => {
                row[`${dept}_${detectedGenders[idx]}`] = Number(val);
              });
            });
            return row;
          });

          let colorIndex = 0;
          chartElement = (
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" 
              tickFormatter={(value) => {
                // Handle month abbreviations
                const monthMap = {
                  'January': 'Jan', 'February': 'Feb', 'March': 'Mar',
                  'April': 'Apr', 'May': 'May', 'June': 'Jun',
                  'July': 'Jul', 'August': 'Aug', 'September': 'Sep',
                  'October': 'Oct', 'November': 'Nov', 'December': 'Dec'
                };
                return monthMap[value] || value;
              }}/>
              {/* <YAxis /> */}
              <YAxis
                label={{
                  value: `${units}`, // <-- your unit
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle" }
                }}
              />
              <Tooltip />
              <Legend />

              {xAxis.map((dept) =>
                detectedGenders.map((gender) => {
                  const key = `${dept}_${gender}`;
                  const fill = colors[colorIndex % colors.length];
                  colorIndex++;
                  return (
                    <Bar
                      key={key}
                      dataKey={key}
                      stackId={dept}
                      fill={fill}
                      name={`${dept} - ${gender}`}
                    />
                  );
                })
              )}
            </BarChart>
          );
          // const categoryLabels = ["Male", "Female", "Others"];
          // const chartData = inputData.flatMap((dataset, idx) =>
          //   dataset.value.map((row) => {
          //     console.log("Processing row:", row);
          //     const [department, male, female, others] = row;
          //     return {
          //       name: `${department} (${dataset.period})`, // differentiate by dataset index
          //       Male: Number(male),
          //       Female: Number(female),
          //       Others: Number(others),
          //     };
          //   })
          // );
          // console.log("Transformed chart data:", chartData);
          // chartElement = (
          //   <LineChart data={chartData}>
          //     <CartesianGrid strokeDasharray="3 3" />
          //     <XAxis dataKey="name" />
          //     <YAxis allowDecimals={false} />
          //     <Tooltip />
          //     <Legend />
          //     <Line dataKey="Male" stroke="#8884d8" />
          //     <Line dataKey="Female" stroke="#82ca9d" />
          //     <Line dataKey="Others" stroke="#ffc658" />
          //   </LineChart>
          // );
        }

      }
      else {
        chartElement = (
          <LineChart data={data} margin={{ top: 20, right: 40, left: 30, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            {/* <XAxis dataKey="period" type="category" /> */}
            {/* <XAxis dataKey="period" angle={-45} textAnchor="end" interval={0} /> */}
            <XAxis
              dataKey="period"
              tickFormatter={(month) => month.substring(0, 3)} // Jan, Feb, Mar...
              interval={0}
            />
            {/* <YAxis /> */}
            <YAxis
              label={{
                value: `${units}`, // <-- your unit
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" }
              }}
            />
            <Tooltip />
            <Legend />
            {/* <ReferenceLine y={baseline} stroke="blue" label="Baseline" />
            <ReferenceLine y={target} stroke="red" label="Target" /> */}
            <Line type="monotone" dataKey="value" stroke={colors[0]} />
          </LineChart>
        );
      }
    } else if (chartType === "bar") {
      chartElement = (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          {/* <YAxis /> */}
          <YAxis
            label={{
              value: `${units}`, // <-- your unit
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle" }
            }}
          />
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
          <ResponsiveContainer width="100%" style={{ overflowX: 'auto' }} height={300}>
            {chartElement}
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };


  return (
    <div className="p-4">
      {/* <div className="flex gap-4 mb-6 flex-wrap">
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
      </div> */}
      {Object.keys(view === "monthly" ? metricsData : yearlyData).map((metric) =>
        renderChart(metric, view === "monthly" ? metricsData[metric] : yearlyData[metric], dataType)
      )}
    </div>
  );
}











