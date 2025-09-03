// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// const inputData = [
//   {
//     period: "H1",
//     industry: "Chemicals",
//     value: [
//       ["HR", "2", "6", "1"],
//       ["Technical", "8", "4", "2"],
//     ],
//   },
//   {
//     period: "H2",
//     industry: "Chemicals",
//     value: [
//       ["HR", "21", "16", "10"],
//       ["Technical", "18", "14", "12"],
//     ],
//   },
// ];

// // 🔄 Transform data for recharts
// const chartData = ["HR", "Technical"].map((dept, idx) => ({
//   department: dept,
//   H1_metric1: Number(inputData[0].value[idx][1]),
//   H1_metric2: Number(inputData[0].value[idx][2]),
//   H1_metric3: Number(inputData[0].value[idx][3]),
//   H2_metric1: Number(inputData[1].value[idx][1]),
//   H2_metric2: Number(inputData[1].value[idx][2]),
//   H2_metric3: Number(inputData[1].value[idx][3]),
// }));

// export default function GroupedBarChart() {
//   return (
//     <ResponsiveContainer width="100%" height={400}>
//       <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="department" />
//         <YAxis />
//         <Tooltip />
//         <Legend />

//         {/* H1 */}
//         <Bar dataKey="H1_metric1" fill="#8884d8" name="H1 Metric 1" />
//         <Bar dataKey="H1_metric2" fill="#82ca9d" name="H1 Metric 2" />
//         <Bar dataKey="H1_metric3" fill="#ffc658" name="H1 Metric 3" />

//         {/* H2 */}
//         <Bar dataKey="H2_metric1" fill="#413ea0" name="H2 Metric 1" />
//         <Bar dataKey="H2_metric2" fill="#2ca02c" name="H2 Metric 2" />
//         <Bar dataKey="H2_metric3" fill="#ff7300" name="H2 Metric 3" />
//       </BarChart>
//     </ResponsiveContainer>
//   );
// }

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const inputData = [
//   {
//     period: "H1",
//     industry: "Chemicals",
//     value: [
//       ["HR", "2", "6", "1"],
//       ["Technical", "8", "4", "2"],
//     ],
//   },
//   {
//     period: "H2",
//     industry: "Chemicals",
//     value: [
//       ["HR", "21", "16", "10"],
//       ["Technical", "18", "14", "12"],
//     ],
//   },
// ];

// // 🔄 Transform inputData automatically
// // value format: [Department, Male, Female, Other]
// const chartData = inputData.map((periodData) => {
//   const row: any = { period: periodData.period };
//   periodData.value.forEach(([dept, male, female, other]) => {
//     row[`${dept}_male`] = Number(male);
//     row[`${dept}_female`] = Number(female);
//     row[`${dept}_other`] = Number(other);
//   });
//   return row;
// });

// // Custom tooltip to show grouped values for each department
// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (active && payload && payload.length) {
//     const hrData = payload.filter((p: any) => p.dataKey.startsWith("HR"));
//     const techData = payload.filter((p: any) => p.dataKey.startsWith("Technical"));

//     return (
//       <div className="bg-white border rounded p-2 shadow">
//         <p className="font-semibold">Period: {label}</p>
//         {hrData.length > 0 && (
//           <div className="mt-1">
//             <p className="font-medium">HR</p>
//             {hrData.map((item: any) => (
//               <p key={item.dataKey} style={{ color: item.fill }}>
//                 {item.name.split(" - ")[1]}: {item.value}
//               </p>
//             ))}
//           </div>
//         )}
//         {techData.length > 0 && (
//           <div className="mt-1">
//             <p className="font-medium">Technical</p>
//             {techData.map((item: any) => (
//               <p key={item.dataKey} style={{ color: item.fill }}>
//                 {item.name.split(" - ")[1]}: {item.value}
//               </p>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   }
//   return null;
// };

// export default function NestedStackedBarChart() {
//   return (
//     <ResponsiveContainer width="100%" height={400}>
//       <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="period" />
//         <YAxis />
//         <Tooltip content={<CustomTooltip />} />
//         <Legend />

//         {/* HR bar with stacked male/female/other */}
//         <Bar dataKey="HR_male" stackId="HR" fill="#8884d8" name="HR - Male" />
//         <Bar dataKey="HR_female" stackId="HR" fill="#82ca9d" name="HR - Female" />
//         <Bar dataKey="HR_other" stackId="HR" fill="#ffc658" name="HR - Other" />

//         {/* Technical bar with stacked male/female/other */}
//         <Bar dataKey="Technical_male" stackId="Technical" fill="#413ea0" name="Technical - Male" />
//         <Bar dataKey="Technical_female" stackId="Technical" fill="#2ca02c" name="Technical - Female" />
//         <Bar dataKey="Technical_other" stackId="Technical" fill="#ff7300" name="Technical - Other" />
//       </BarChart>
//     </ResponsiveContainer>
//   );
// }


import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

// const inputData = [
//   {
//     period: "H1",
//     industry: "Chemicals",
//     value: [
//       ["HR", "2", "6", "1"],
//       ["Technical", "8", "4", "2"],
//     ],
//   },
//   {
//     period: "H2",
//     industry: "Chemicals",
//     value: [
//       ["HR", "21", "16", "10"],
//       ["Technical", "18", "14", "12"],
//     ],
//   },
// ];

// Dynamic colors palette
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



export default function NestedStackedBarChart({ graphData }) {
    const [inputData, setInputData] = useState([])
    const [yAxis, setYAxis] = useState([])
    const [xAxis, setXAxis] = useState([])

    useEffect(() => {
        if (graphData) {
            let formattedInputData = graphData['Discussion of corporate positions related to government regulations and/or policy proposals that address environmental and social factors affecting the industry'].data.map(item => ({
                period: item.period,
                industry: item.industry,
                value: item.value // Assuming value is already in the required format
            }))
            if(graphData['Discussion of corporate positions related to government regulations and/or policy proposals that address environmental and social factors affecting the industry']['graphData']['xAxisLabels']){
                setXAxis(graphData['Discussion of corporate positions related to government regulations and/or policy proposals that address environmental and social factors affecting the industry']['graphData']['xAxisLabels'])
            }
            if(graphData['Discussion of corporate positions related to government regulations and/or policy proposals that address environmental and social factors affecting the industry']['graphData']['yAxisLabels']){
                setYAxis(graphData['Discussion of corporate positions related to government regulations and/or policy proposals that address environmental and social factors affecting the industry']['graphData']['yAxisLabels'])
            }
            setInputData(formattedInputData)
        } else {
            setInputData(inputData)
        }
    }, [graphData])

    // Detect genders dynamically from inputData
    const detectedGenders = Array.from(
        new Set(inputData?.flatMap((period) => period.value.flatMap((row) => row.slice(1).map((_, idx) => idx))))
    ).map((idx) => {
        return yAxis[idx] || ''
        
    });

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

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
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
        </ResponsiveContainer>
    );
}