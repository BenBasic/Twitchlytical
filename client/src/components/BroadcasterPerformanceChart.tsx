import React, { useEffect, useRef, useState } from 'react'
import { select, Selection } from 'd3-selection'
import { scaleLinear, scaleBand } from 'd3-scale'
import { max } from 'd3-array'
import { axisLeft, axisBottom } from 'd3-axis'
import 'd3-transition'
import { easeElastic } from 'd3-ease'
import { area } from 'd3-shape'
import * as d3 from 'd3'
import { BroadcasterLatest, GameData, ProfileData } from './TypesAndInterfaces'
import { percentDifference, checkArrIsNum } from '../utils/helpers'

// Type used for percentage calculation comparisons for the tooltip
type percentTooltip = {
    print: string;
    class: string;
};



const BroadcasterPerformanceChart: React.FC<BroadcasterLatest> = ({ profileData, gameData, type }) => {

    let isGame: boolean = false;
    if (gameData !== undefined) isGame = true;

    // Checks if the passed in values are of the ProfileData[] type
    const isProfileType = (x: any, y: any): x is ProfileData[] => y.includes(x);
    // Checks if the passed in values are of the ProfileData type
    const isProfileTypeItem = (x: any, y: any): x is ProfileData => y.includes(x);

    // // Function that creates the array containing all peak, avg, and date data for the last week (from dayProps)
    // function assignPropData() {
    //     let propArray = [];
    //     for (let i = 1; i < Object.keys(dayProps).length + 1; i++) {
    //         let propData = dayProps[`day${i}` as keyof typeof dayProps]
    //         // Checks if data exists for peak and avg keys, adds to array if it does. If not then it doesnt add it, this avoids visualization errors
    //         if (isFinite(propData.peak) && isNaN(propData.avg) === false) {
    //             propArray.push({date: propData.date, peak: propData.peak, avg: propData.avg})
    //         }
    //     };
    //     return propArray;
    // };
    // This contains all the prop data to be referenced in data visualization
    // const data = profileData;
    console.log("-------------------- Profile Data Is --------------------")
    console.log(profileData)

    const data = isGame === false ? profileData : gameData;

    console.log("Data2 is")
    console.log(data)

    const colorPicker = {
        peak: ["#01859E", "#1ac9e6", "#142459"],
        avg: ["#992CBC", "#AF4BCE", "#29066B"],
        hour: ["#de542c", "#d8ac2d", "#991212"],
    };

    const areaChart = useRef<SVGSVGElement | null>(null)

    // This is a ref for the container, which is a parent of the d3 related svg elements
    const svgContainer = useRef<HTMLDivElement | null>(null);

    // States which keep track of the updating width and height of the svgContainer
    const [widthState, setWidthState] = useState<number>();
    const [heightState, setHeightState] = useState<number>();

    // State keeping track of refreshes, used to prevent enter animation retriggering when resizing container
    const [resizeCheckState, setResizeCheckState] = useState<number>(0);


    // Calculates the width and height of the svgContainer
    const getSvgContainerSize = () => {
        const newWidth = svgContainer.current?.clientWidth;
        setWidthState(newWidth);

        const newHeight = svgContainer.current?.clientHeight;
        setHeightState(newHeight);
    };

    useEffect(() => {
        // Detects the width and height on render (determined by container size, or window size if no container)
        getSvgContainerSize();
        // Listens for resize changes, and detects dimensions again when they change
        window.addEventListener("resize", getSvgContainerSize);
        // Cleanup the previously applied event listener
        return () => window.removeEventListener("resize", getSvgContainerSize);
    }, []);

    // State used for svg element selections, sort of like a root for all branching d3 manipulations
    const [selectionState, setSelectionState] = useState<null | Selection<SVGSVGElement | null, unknown, null, undefined>>(null)

    // State storing the data referenced in the d3 chart
    const [dataState, setDataState] = useState(data)

    // Dimensions to be referenced for svg sizing and placement
    const dimensions = { width: widthState, height: heightState }

    // Assigning maxValue to the maximum result from the data, used for sizing and axis labels
    const maxValue = (dataState === undefined ? 0 : isProfileType(dataState, [profileData]) ? max(dataState, d => d.peak) : max(dataState, d => d.viewPeak))

    // Assigning maxValue to the maximum result from the data, used for sizing and axis labels
    const maxValueBar = (dataState === undefined ? 0 : isProfileType(dataState, [profileData]) ? max(dataState, d => parseInt(d.duration.replace(/[^0-9\.]+/g, ''))!) : max(dataState, d => d.channelPeak))
    console.log("maxValueBar is")
    console.log("maxValueBar test is " + isProfileType(dataState, [profileData]))
    console.log(dataState)
    console.log(profileData)
    console.log(maxValueBar)
    // Values and sizing referenced for the y axis
    let y = scaleLinear()
        .domain([0, maxValue!])
        .range([dimensions.height! - (dimensions.height! / 8) * 1.2, dimensions.height! / 12])

    // Values and sizing referenced for the y axis
    let yBar = scaleLinear()
        .domain([0, maxValueBar!])
        .range([dimensions.height! - (dimensions.height! / 8) * 1.2, dimensions.height! / (isProfileType(dataState, [profileData]) ? 12 : 4)])

    // Values and sizing referenced for the x axis
    let x = scaleBand()
        .domain((dataState === undefined ? "" : dataState.map(d => `${new Date(d.date).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric', year: 'numeric' })}`)))
        .range([0, dimensions.width! - (dimensions.width! / 15) * 2])
        .paddingInner(1)
        .paddingOuter(.1)

    // Y axis placement and tick settings
    const yAxis = axisLeft(y).ticks(3, "s")
        .tickPadding(dimensions.width! > 350 ? Math.round((dimensions.width! / 100) - dimensions.width! / 150) : Math.round((dimensions.width! / 100) - dimensions.width! / 80))

    // X axis placement and tick settings
    const xAxis = axisBottom(x).ticks((dataState === undefined ? 0 : dataState.length, '%a %e'))
        .tickPadding(Math.round(dimensions.height! / 40))
        .tickSizeOuter(0)

    // Placement settings for starting position of chart appearing animation
    const startAreaRef: any = area()
        .x((d: any) => {
            const xValue = x(new Date(d.date).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric', year: 'numeric' }))
            if (xValue) {
                return xValue
            } else {
                return 0
            }
        })
        .y0(y(0))
        .y1(dimensions.height! - (dimensions.height! / 8))

    // Placement settings for dataset 1 (final position, after animation)
    const areaRef: any = area()
        .x((d: any) => {
            const xValue = x(new Date(d.date).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric', year: 'numeric' }))
            if (xValue) {
                return xValue
            } else {
                return 0
            }
        })
        .y0(y(0))
        .y1((d: any) => y(isProfileType(dataState, [profileData]) ? d.peak : d.viewPeak))

    // Placement settings for dataset 2 (final position, after animation)
    const channelAreaRef: any = area()
        .x((d: any) => {
            const xValue = x(new Date(d.date).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric', year: 'numeric' }))
            if (xValue) {
                return xValue
            } else {
                return 0
            }
        })
        .y0(y(0))
        .y1((d: any) => y(isProfileType(dataState, [profileData]) ? d.avg : d.viewAvg))

    function tooltipPercentCheck(peak: number, prevPeak: number) {
        let printVal: string = '';
        let classVal: string = '';

        if (peak > prevPeak) {
            printVal = `▲ ${percentDifference(prevPeak, peak)}%`
            classVal = `higher`
        };

        if (peak < prevPeak) {
            printVal = `▼ ${percentDifference(prevPeak, peak)}%`
            classVal = `lower`
        };

        return {print: printVal, class: classVal};
    }

    useEffect(() => {

        if (dataState === undefined) {
            return;
        } else {
            // If theres no selection, select the current value from the areaChart ref
            if (!selectionState) {
                setSelectionState(select(areaChart.current))
            } else {

                // Refreshes the chart so it doesnt infinitely redraw svgs on top of eachother while resizing
                const oldChart = selectionState.selectAll("*");
                oldChart.remove();

                // Increments the peak for the state, used to prevent enter animation re-triggering
                console.log("Original resize is " + resizeCheckState)
                setResizeCheckState(resizeCheckState + 1)
                console.log("NEW resize is " + resizeCheckState)

                // Creating a tooltip, default state is to have 0 opacity
                const tooltip = d3
                    .select('.areaChart')
                    .append('div')
                    .attr('class', 'tooltip')
                    .style("opacity", 0);

                // Creating a gradient to be referenced as an area fill
                let gradient = selectionState
                    .append("defs");

                let dataVisuals = selectionState
                    .attr('width', dimensions.width!)
                    .attr('height', dimensions.height!)
                // .style('background-color', '#DDD4E3');


                // Calculates height for bar graphs [NEEDS TYPE ASSIGNMENT FOR PEREMETER]
                const barHeightCalc = (d: any) => {
                    // let durationArr: any[] = ["nope"];

                    // If the chart is for a streamer's profile page, bar height will be based on stream duration
                    if (isProfileTypeItem(d, profileData)) {
                        console.log("yuck1")
                        let durationArr: any[] = d.duration.split(/[hms]+/gi, 3);
                        console.log("yuck durationArr is")
                        console.log(durationArr)

                        for (let k = 0; k < durationArr.length; k++) {
                            durationArr[k] = parseInt(durationArr[k], 10);
                        };
                        checkArrIsNum(durationArr, 0);
                        console.log("checkArrIsNum check")
                        console.log(durationArr)
                        console.log("yuck g " + yBar(((durationArr[0] * 3600) + (durationArr[1] * 60) + durationArr[2]) * 1.2))
                        console.log("yuck g check")
                        console.log(yBar(((durationArr[0] * 3600) + (durationArr[1] * 60) + durationArr[2]) * 1.2))
                        return yBar(((durationArr[0] * 3600) + (durationArr[1] * 60) + durationArr[2]) * 1.2)
                    }
                    console.log("yuck2")
                    console.log("yuck " + isProfileTypeItem(d, profileData))

                    // If the chart is for a game's profile page, bar height will be based on channel peak
                    if (!isProfileTypeItem(d, profileData)) {
                        console.log("yuck3")
                        console.log("yuck f " + yBar(d.channelPeak * 1.2))
                        return yBar(d.channelPeak * 1.2)
                    }
                    console.log("yuck4")

                    return yBar(0)

                }


                // Visualizes multiple data sets (Currently 2, can support more)
                for (let i = 0; i < 2; i++) {
                    const newG = gradient
                        .append("linearGradient")
                        .attr("id", `gradient${i + type}`)
                        .attr('gradientTransform', 'rotate(90)');

                    // Assigning starting color of gradient
                    newG
                        .append("stop")
                        .attr("stop-color", i === 0 ? colorPicker.peak[1] : colorPicker.avg[1])
                        .attr("offset", "0%");

                    // Assigning ending color of gradient
                    newG
                        .append("stop")
                        .attr("stop-color", i === 0 ? colorPicker.peak[0] : colorPicker.avg[0])
                        .attr("offset", "100%");

                    // Assigning data and visual settings for chart data
                    dataVisuals
                        .append('path')
                        .datum(dataState)
                        .attr('d', resizeCheckState > 0 && i === 0 ? areaRef :
                            resizeCheckState > 0 && i > 0 ? channelAreaRef :
                                startAreaRef
                        )
                        .attr('transform', `translate(${dimensions.width! / 15}, 0)`)
                        .attr('fill', i === 0 ? `url(#gradient0${type})` : `url(#gradient1${type})`)
                        .attr('stroke', i === 0 ? colorPicker.peak[2] : colorPicker.avg[2])
                        .attr('stroke-width', '.25rem')

                        .transition()
                        .duration(1000)
                        .ease(easeElastic)

                        .attr('d', i === 0 ? areaRef : channelAreaRef);
                };

                const hourGradient = gradient
                    .append("linearGradient")
                    .attr("id", `hourG`)
                    .attr('gradientTransform', 'rotate(90)');

                // Assigning starting color of gradient
                hourGradient
                    .append("stop")
                    .attr("stop-color", colorPicker.hour[1])
                    .attr("offset", "0%");

                // Assigning ending color of gradient
                hourGradient
                    .append("stop")
                    .attr("stop-color", colorPicker.hour[0])
                    .attr("offset", "100%");


                var bar = selectionState.selectAll("rect")
                    .data<ProfileData | GameData>(dataState)
                    .enter().append("g");

                // Bar Chart
                bar.append("rect")
                    .attr('x', (d) => x(`${new Date(d.date).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric', year: 'numeric' })}`)!)
                    .attr('y', (d) => resizeCheckState > 0 ? barHeightCalc(d) : dimensions.height! - (dimensions.height! / 8 * 1.2))
                    .attr("height", (d) => resizeCheckState > 0 ? dimensions.height! - (dimensions.height! / 8 * 1.2) - barHeightCalc(d) : 0)
                    .attr("width", Math.round(dimensions.width! / 55 / 3 + (dimensions.width! / 55)))
                    .attr('transform', `translate(${dimensions.width! / 18.5}, 0)`)
                    .attr('fill', `url(#hourG)`)
                    .attr('stroke', colorPicker.hour[2])
                    .attr('stroke-width', '.15rem')
                    .style("opacity", .65)

                    .transition()
                    .duration(1000)
                    .ease(easeElastic)

                    .attr('y', (d) => barHeightCalc(d))
                    .attr("height", (d) => dimensions.height! - (dimensions.height! / 8 * 1.2) - barHeightCalc(d))


                // // Bar Chart labels
                // bar.append("text")
                //     .attr("dy", "1.3em")
                //     .attr("x", function (d) { return x(d.date)! + x.bandwidth() / 2; })
                //     .attr("y", function (d) { return yBar(parseInt(d.duration.replace(/[^0-9\.]+/g, ''))! - d.peak)!; })
                //     .attr("text-anchor", "middle")
                //     .attr("font-family", "sans-serif")
                //     .style("font-size", Math.round(dimensions.height! / 20 / 3 + (dimensions.height! / 20)))
                //     .attr('transform', `translate(${dimensions.width! / 15}, 0)`)
                //     .attr("fill", "black")
                //     .text(function (d) {
                //         return d.duration;
                //     });


                // Visual and placement settings for X axis
                const xAxisGroup = selectionState
                    .append('g')
                    .attr('transform', `translate(${dimensions.width! / 15}, ${dimensions.height! - (dimensions.height! / 8 * 1.2)})`)
                    .style('stroke-width', '.3rem')
                    .style("font-size", Math.round(dimensions.height! / 20 / 3 + (dimensions.height! / 20)))
                    .call(xAxis);

                // Visual and placement settings for Y axis
                const yAxisGroup = selectionState
                    .append('g')
                    .attr('transform', `translate(${dimensions.width! / 20}, 0)`)
                    .style('stroke-width', '0rem')
                    .style("font-size", Math.round(dimensions.width! / 40 / 3 + (dimensions.width! / 60)))
                    .style("text-anchor", "middle")
                    .call(yAxis);


                selectionState
                    .selectAll("dot")
                    .data<ProfileData | GameData>(dataState)
                    .enter()
                    .append("rect")
                    .classed("tipArea", true)
                    .attr("width", dimensions.width! / 25)
                    .attr("height", '86%')
                    .attr("x", function (d) { return x(`${new Date(d.date).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric', year: 'numeric' })}`)!; })
                    .attr("y", 0)
                    .attr('transform', `translate(${dimensions.width! / 21.3}, 0)`)
                    .on("mouseover", function (event, d) {
                        // Assigning i to find the index of matching data (this functions as the index)
                        const i: number = dataState.indexOf(d as any);
                        // Assigning lets, both used for displaying percentage difference between results

                        let plurals: string[] = ["hours", "minutes", "seconds"];
                        console.log("Check this")
                        console.log(event.pageX)
                        console.log(event.pageY)
                        console.log(i)

                        let peakVal: number = 0;
                        let avgVal: number = 0;
                        let dataPeak: number = 0;
                        let dataAvg: number = 0;
                        let channelPeakVal: number = 0;
                        let channelAvgVal: number = 0;
                        let dataChannelPeak: number = 0;
                        let dataChannelAvg: number = 0;
                        let currentDuration: any[] = ["nope"];
                        let prevDuration: any[] = ["nope"];
                        let viewPerStream: number = 0;

                        let viewPeakPercent: percentTooltip = {print: '', class: ''};
                        let viewAvgPercent: percentTooltip = {print: '', class: ''};
                        let channelPeakPercent: percentTooltip = {print: '', class: ''};
                        let channelAvgPercent: percentTooltip = {print: '', class: ''};
                        let durationPercent: percentTooltip = {print: '', class: ''};
                        let ratioPercent: percentTooltip = {print: '', class: ''};

                        if (isProfileType(dataState, [profileData]) && isProfileTypeItem(d, profileData)) {
                            peakVal = d.peak;
                            avgVal = d.avg;
                        };

                        if (!isProfileType(dataState, [profileData]) && !isProfileTypeItem(d, profileData)) {
                            peakVal = d.viewPeak;
                            avgVal = d.viewAvg;
                            channelPeakVal = d.channelPeak;
                            channelAvgVal = d.channelAvg;
                            viewPerStream = d.viewAvg / d.channelAvg
                        }


                        /* Checks if tooltip has previous data to reference, if it does then 
                        it will compare the current and previous data to check for a percentage difference.
                        Color and unicode sign will be assigned based on if current data is higher
                        or lower than the previous data
                        */
                        if (i > 0) {
                            console.log("tool check " + isProfileType(dataState, [profileData]) + " " + isProfileTypeItem(d, profileData))

                            if (isProfileType(dataState, [profileData]) && isProfileTypeItem(d, profileData)) {

                                dataPeak = dataState[i - 1].peak;
                                dataAvg = dataState[i - 1].avg;
                                currentDuration = d.duration.split(/[hms]+/gi, 3);
                                prevDuration = dataState[i - 1].duration.split(/[hms]+/gi, 3);
                            };
                            console.log("tool check 2 is " + peakVal)

                            if (!isProfileType(dataState, [profileData]) && !isProfileTypeItem(d, profileData)) {
                                peakVal = d.viewPeak;
                                avgVal = d.viewAvg;
                                dataPeak = dataState[i - 1].viewPeak;
                                dataAvg = dataState[i - 1].viewAvg;
                                dataChannelPeak = dataState[i - 1].channelPeak;
                                dataChannelAvg = dataState[i - 1].channelAvg;
                            }

                            // View peak calculation
                            viewPeakPercent = tooltipPercentCheck(peakVal, dataPeak);

                            // View avg calculation
                            viewAvgPercent = tooltipPercentCheck(avgVal, dataAvg);

                            // Channel peak calculation
                            channelPeakPercent = tooltipPercentCheck(channelPeakVal, dataChannelPeak);

                            // Channel avg calculation
                            channelAvgPercent = tooltipPercentCheck(channelAvgVal, dataChannelAvg);

                            // View per stream calculation
                            ratioPercent = tooltipPercentCheck((avgVal / channelAvgVal), (dataAvg / dataChannelAvg));

                            if (currentDuration[0] !== "nope" && prevDuration[0] !== "nope") {
                                /* Loops through previous and current streams duration arrays and
                                turning the string values into number values for comparison calculation
                                */
                                for (let h = 0; h < currentDuration.length; h++) {
                                    currentDuration[h] = parseInt(currentDuration[h], 10);
                                    prevDuration[h] = parseInt(prevDuration[h], 10);
                                    // Removes plural if value is 1 or smaller (ex: 1 hour vs 1 hours)
                                    if (currentDuration[h] <= 1) plurals[h] = plurals[h].slice(0, -1);
                                };

                                // Reformats array if Current Stream doesnt contain hours or minutes
                                checkArrIsNum(currentDuration, 0);

                                // Reformats array if Previous Stream doesnt contain hours or minutes
                                checkArrIsNum(prevDuration, 0);

                                // Converts hours and minutes into seconds and adds the total of hours, minutes, and seconds
                                let currentDurCalc = (currentDuration[0] * 3600) + (currentDuration[1] * 60) + currentDuration[2];
                                let prevDurCalc = (prevDuration[0] * 3600) + (prevDuration[1] * 60) + prevDuration[2];

                                // Calculates percentage difference between current and previous stream durations
                                durationPercent = tooltipPercentCheck(currentDurCalc, prevDurCalc);
                            }
                        }

                        // HTML sections for Tooltip, will change values depending on the profile usecase between game and streamer
                        let section1: string = '';
                        let section2: string = '';

                        // If the data is for a broadcaster (streamer), then adjust section1 and section2 HTML accordingly
                        if (isProfileType(dataState, [profileData]) && isProfileTypeItem(d, profileData)) {
                            section1 = (
                                // Tooltip Peak Title
                                `<p class='toolTitle'>
                                    Peak
                                </p>` +
                                // Tooltip Peak Value
                                `<p class='toolInfo' style=background-color:${colorPicker.peak[2]};>
                                    ${peakVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </p>` +
                                // Tooltip Peak Percentage Comparison
                                `<p class=${i === 0 ? 'hiddenElem' : viewPeakPercent.class}>
                                    ${viewPeakPercent.print}
                                </p>` +
                                // Tooltip Average Title
                                `<p class='toolTitle'>
                                    Average
                                </p>` +
                                // Tooltip Average Value
                                `<p class='toolInfo' style=background-color:${colorPicker.avg[0]};>
                                    ${avgVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </p>` +
                                // Tooltip Average Percentage Comparison
                                `<p class=${i === 0 ? 'hiddenElem' : viewAvgPercent.class}>
                                    ${viewAvgPercent.print}
                                </p>`
                            );
                            section2 = (
                                // Tooltip Duration Title
                                `<p class='toolTitle'>
                                    Duration
                                </p>` +
                                // Tooltip Duration Value
                                `<p class='toolInfo' style=background-color:${colorPicker.hour[2]};>
                                    ${d.duration.replace(/([s])+/gi, ` ${plurals[2]}`)
                                    .replace(/([m])+/gi, ` ${plurals[1]}<br>`)
                                    .replace(/([h])+/gi, ` ${plurals[0]}<br>`)
                                    // Replaces leading 0s in number (ex: 01 vs 1 )
                                    .replace(/\b0/g, '')
                                }
                                </p>` +
                                // Tooltip Date Percentage Comparison
                                `<p class=${i === 0 ? 'hiddenElem' : durationPercent.class}>
                                    ${durationPercent.print}
                                </p>`
                            );
                        }

                        // If the data is for a game, then adjust section1 and section2 HTML accordingly
                        if (!isProfileType(dataState, [profileData]) && !isProfileTypeItem(d, profileData)) {
                            section1 = (
                                // Tooltip View Title
                                `<p class='toolTitle'>
                                    Live Views
                                </p>` +
                                // Peak Subtitle
                                `<p class='toolDate'>
                                    Peak
                                </p>` +
                                // Tooltip View Peak Value
                                `<p class='toolInfo' style=background-color:${colorPicker.peak[2]};>
                                    ${peakVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </p>` +
                                // Tooltip View Peak Percentage Comparison
                                `<p class=${i === 0 ? 'hiddenElem' : viewPeakPercent.class}>
                                    ${viewPeakPercent.print}
                                </p>` +
                                // Average Subtitle
                                `<p class='toolDate'>
                                    Average
                                </p>` +
                                // Tooltip View Average Value
                                `<p class='toolInfo' style=background-color:${colorPicker.avg[0]};>
                                    ${avgVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </p>` +
                                // Tooltip View Average Percentage Comparison
                                `<p class=${i === 0 ? 'hiddenElem' : viewAvgPercent.class}>
                                    ${viewAvgPercent.print}
                                </p>`
                            );
                            section2 = (
                                // Tooltip Live Channels Title
                                `<p class='toolTitle'>
                                    Live Channels
                                </p>` +
                                // Peak Subtitle
                                `<p class='toolDate'>
                                    Peak
                                </p>` +
                                // Tooltip Channel Peak Value
                                `<p class='toolInfo' style=background-color:${colorPicker.hour[2]};>
                                ${channelPeakVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </p>` +
                                // Tooltip Channel Peak Percentage Comparison
                                `<p class=${i === 0 ? 'hiddenElem' : channelPeakPercent.class}>
                                ${channelPeakPercent.print}
                                </p>` +
                                // Average Subtitle
                                `<p class='toolDate'>
                                    Average
                                </p>` +
                                // Tooltip Average Value
                                `<p class='toolInfo' style=background-color:${colorPicker.hour[0]};>
                                ${channelAvgVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </p>` +
                                // Tooltip Average Percentage Comparison
                                `<p class=${i === 0 ? 'hiddenElem' : channelAvgPercent.class}>
                                ${channelAvgPercent.print}
                                </p>` +
                                // Tooltip Ratio Title
                                `<p class='toolTitle'>
                                    Ratio
                                </p>` +
                                // Views Per Stream Subtitle
                                `<p class='toolDate'>
                                    Views Per Stream
                                </p>` +
                                // Tooltip Average Value
                                `<p class='toolInfo' style=background-color:${colorPicker.avg[2]};>
                                ${viewPerStream.toFixed(2)}
                                </p>` +
                                // Tooltip View Per Stream Percentage Comparison
                                `<p class=${i === 0 ? 'hiddenElem' : ratioPercent.class}>
                                    ${ratioPercent.print}
                                </p>`
                            );
                        }

                        // Makes tooltip visible when mouse enters tooltip area
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", .9);
                        tooltip.html(
                            // Tooltip Date
                            `<p class='toolDate'>
                            ${new Date(d.date).toDateString()}
                            </p>` +
                            // Tooltip Stream Title
                            `<p class='toolStreamTitle'>
                            ${(d.title)}
                            </p>` +
                            // Sections 1 and 2, content for both is based on if data is used for game or broadcaster (streamer) profiles
                            `${section1}` +
                            `${section2}`
                        )
                    })
                    // Allows tooltip to follow mouse position, will swap sides if too close to page edge
                    .on("mousemove", function (event) {
                        tooltip
                            .style("left", (event.pageX > (window.innerWidth - 150) ? event.pageX - 120 : event.pageX + 10) + "px")
                            .style("top", (event.pageY - 40) + "px");
                    })
                    // Hides tooltip when mouse leaves tooltip area
                    .on("mouseout", function (d) {
                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });

            };
        }

    }, [widthState, heightState]);


    return (
        <div ref={dataState === undefined ? undefined : svgContainer} className='areaChart'>
            {dataState === undefined ?
                <h4>User has no streams</h4>
                :
                <svg ref={areaChart} className='svgArea'></svg>
            }

        </div>
    )
};

export default BroadcasterPerformanceChart;