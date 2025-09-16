import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Chart } from "react-google-charts";


const CustomDashboardTab = ({ graphData,selectedMetric,selectedPeriod,selectedYear }) => {
    console.log("This is graphData", graphData)
    //   let {year,month,type}=componentParams
    const [metrics, setMetrics] = useState([])
    //   const [graphData,setGraphData]=useState({})
    useEffect(() => {
        if (graphData && Object.keys(graphData).length > 0) {
            const metricKeys = Object.keys(graphData);
            setMetrics(metricKeys);
        } else {
            setMetrics([]);
        }
    }, [graphData])

    // useEffect(() => {
    //     console.log("This is metrics in custom dashboard tab", metrics)
    // }, [metrics])
    return (
        <section>
            <p className="mt-2">
                {/* <Row> */}
                {metrics.map((metric) => {

                    if (graphData[metric]?.['graphType'] == 'pie' && selectedMetric && selectedPeriod && selectedYear && 
                        graphData[metric]['data'] && graphData[metric]['data'].length > 0 && 
                        graphData[metric]['data'].find(item => item.metricName === selectedMetric && item.period === selectedPeriod && item.financialYear === selectedYear)
                    ) {
                        let findData=graphData[metric]['data'].find(item => item.metricName === selectedMetric && item.period === selectedPeriod && item.financialYear === selectedYear);
                        let labels = [selectedMetric,'Others'];
                        let values=[findData.value,100-findData.value];
                        // let data = {
                        //     labels: graphData[metric]['graphData']?.labels,
                        //     datasets: [
                        //         {
                        //             label: "#",
                        //             data: graphData[metric]['graphData']?.data,
                        //             borderWidth: 1,
                        //         },
                        //     ],
                        // };
                        let data = {
                            labels: labels,
                            datasets: [
                                {
                                    label: "#",
                                    data: values,
                                    borderWidth: 1,
                                },
                            ],
                        };
                        console.log("This is Pie data in custom dashboard tab", data)
                        return (
                            // <Col lg={6} md={6} sm={12} xxl={6}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        {/* Energy Sources (in percentage)  */}
                                        {metric}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {/* {JSON.stringify(graphData[metric]['graph'])} */}
                                    <div className="chart-container Chart">
                                        <div className="chart-container">
                                            {data?.datasets?.some((dataset) =>
                                                dataset?.data?.some((value) => value !== 0)
                                            ) ? (
                                                <Chart
                                                    width={"100%"}
                                                    height={"300px"}
                                                    chartType="PieChart"
                                                    loader={<div>Loading Chart...</div>}
                                                    data={[
                                                        ["Energy Source", "Percentage"],
                                                        ...(data.datasets[0]?.data || []).map(
                                                            (value, index) => [
                                                                data?.labels[index],
                                                                Number(value),
                                                            ]
                                                        ),
                                                    ]}
                                                    options={{
                                                        pieHole: 0.4,
                                                        chartArea: {
                                                            width: "90%",
                                                            height: "70%",
                                                        },
                                                        pieSliceText: "none",
                                                        legend: {
                                                            position: "labeled", textStyle: {
                                                                fontSize: 9,
                                                            },
                                                        },
                                                        colors: ["#537D5D", "#73946B", "#9EBC8A", "#D2D0A0"],
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    className="chart-container Chart"
                                                    style={{
                                                        width: "100%",
                                                        height: "300px",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        fontFamily: "Arial",
                                                        color: "black",
                                                        fontSize: "smaller",
                                                    }}
                                                >
                                                    No data
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            // </Col>
                        )
                    }
                    else if (graphData[metric]?.['graphType'] == 'bar' && 
                        selectedMetric && selectedPeriod && selectedYear && 
                        graphData[metric]['data'] && graphData[metric]['data'].length > 0 && 
                        graphData[metric]['data'].find(item => item.metricName === selectedMetric && item.period === selectedPeriod && item.financialYear === selectedYear)) {
                        let findData=graphData[metric]['data'].find(item => item.metricName === selectedMetric && item.period === selectedPeriod && item.financialYear === selectedYear);
                        let xAxisLabels=findData && findData.value?findData.value.reduce((acc, curr) => {
                            acc.push(curr[0]);
                            return acc;
                        }, []):[];
                        let dataSets=findData && findData.value?findData.value.reduce((acc, curr) => {
                            acc.push(curr.slice(1));
                            return acc;
                        }, []):[];
                        // console.log("This is xAxisLabels", xAxisLabels)
                        // console.log("This is dataSets", dataSets)
                        // const datasets = graphData[metric]['graphData']?.xAxisLabels.map(
                        //     (label, index) => ({
                        //         label: label,
                        //         data: graphData[metric]['graphData']?.data[index].map(val => Number(val)),
                        //         borderWidth: 1,
                        //     })
                        // );
                        const datasets = xAxisLabels.map(
                            (label, index) => ({
                                label: label,
                                data: dataSets[index].map(val => Number(val)),
                                borderWidth: 1,
                            })
                        );
                        let data = {
                            labels: graphData[metric]?.yAxisLabels,
                            datasets: datasets,
                        };
                        console.log("This is Bar graph data in custom dashboard tab", data)
                        return (
                            // <Col lg={12} md={12} sm={12} xxl={12}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        {metric}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="chart-container">
                                        {data?.datasets?.some((dataset) =>
                                            dataset?.data?.some((value) => value !== 0)
                                        ) ? (
                                            <Chart
                                                chartType="ColumnChart"
                                                width="100%"
                                                height="300px"
                                                data={(() => {
                                                    const headerRow = [
                                                        "Category",
                                                        ...(data?.labels || []),
                                                    ];
                                                    const dataRows = data.datasets.map(
                                                        (dataset) => [
                                                            dataset.label,
                                                            ...(dataset?.data || []),
                                                        ]
                                                    );
                                                    return [headerRow, ...dataRows];
                                                })()}
                                                options={{
                                                    legend: { position: "top" },
                                                    bar: { groupWidth: "80%" },
                                                    isStacked: false,
                                                    hAxis: {
                                                        slantedText: false,
                                                        textStyle: {
                                                            fontSize: 9,
                                                        },
                                                    },
                                                    vAxis: {
                                                        scaleType: 'log'
                                                    },
                                                    chartArea: {
                                                        width: "90%",
                                                        height: "80%",
                                                    },
                                                    colors: ["#537D5D", "#73946B", "#9EBC8A", "#D2D0A0"],
                                                }}
                                                loader={<div>Loading Chart...</div>}
                                                rootProps={{ "data-testid": "1" }}
                                            />
                                        ) : (
                                            <div
                                                className="chart-container Chart"
                                                style={{
                                                    width: "100%",
                                                    height: "300px",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    fontFamily: "Arial",
                                                    color: "black",
                                                    fontSize: "smaller",
                                                }}
                                            >
                                                No data
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                            //   </Col>
                        )
                    }

                })}

                {/* </Row> */}
            </p>
        </section>
    )
}
export default CustomDashboardTab;