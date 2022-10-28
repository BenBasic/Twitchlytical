import React, { useEffect, useRef, useState } from 'react'
import { select, selectAll, Selection } from 'd3-selection'
import { scaleLinear, scaleBand, scaleTime } from 'd3-scale'
import { extent, max } from 'd3-array'
import { axisLeft, axisBottom } from 'd3-axis'
import 'd3-transition'
import { easeBounce, easeElastic } from 'd3-ease'
import { area } from 'd3-shape'
import { ScaleTime } from 'd3-scale'
import * as d3 from 'd3'


const now = new Date();

const data = [
    { year: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5), count: 25, channel: 10 },
    { year: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 4), count: 30, channel: 8 },
    { year: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3), count: 75, channel: 38 },
    { year: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2), count: 57, channel: 45 },
    { year: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1), count: 68, channel: 30 },
];

const percentDifference = (a: number, b: number) => {
    const prevVal: number = a;
    const currentVal: number = b;
    const percent: number = 100 * prevVal / (prevVal + currentVal);

    return percent.toFixed(2);
}


const AreaChart: React.FC = () => {

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
    const maxValue = max(dataState, d => d.count)

    // Values and sizing referenced for the y axis
    let y = scaleLinear()
    .domain([0, maxValue!])
    .range([dimensions.height! - (dimensions.height! / 8) * 1.2, dimensions.height! / 12])

    // Values and sizing referenced for the x axis
    let x = scaleTime()
    .domain(
        d3.extent(dataState, (d) => {
            return d.year
        }) as [Date, Date]
      )
    .range([0, dimensions.width! - (dimensions.width! / 15) * 2])

    // Y axis placement and tick settings
    const yAxis = axisLeft(y).tickPadding(12)

    // X axis placement and tick settings
    const xAxis = axisBottom(x).ticks(5).tickPadding(12)

    // Placement settings for starting position of chart appearing animation
    const startAreaRef: any = area()
    .x((d:any)=> x(d.year))
    .y0(y(0))
    .y1(dimensions.height! - (dimensions.height! / 8))

    // Placement settings for dataset 1 (final position, after animation)
    const areaRef: any = area()
    .x((d:any)=> x(d.year))
    .y0(y(0))
    .y1((d:any)=> y(d.count))

    // Placement settings for dataset 2 (final position, after animation)
    const channelAreaRef: any = area()
    .x((d:any)=> x(d.year))
    .y0(y(0))
    .y1((d:any)=> y(d.channel))


    useEffect(() => {
        // If theres no selection, select the current value from the areaChart ref
        if (!selectionState) {
            setSelectionState(select(areaChart.current))
        } else {

            // Refreshes the chart so it doesnt infinitely redraw svgs on top of eachother while resizing
            const oldChart = selectionState.selectAll("*");
            oldChart.remove();

            // Increments the count for the state, used to prevent enter animation re-triggering
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
                .style('background-color', '#4c6485');


            // Visualizes multiple data sets (Currently 2, can support more)
            for (let i = 0; i < 2; i++) {
                const newG = gradient
                    .append("linearGradient")
                    .attr("id",`gradient${i}`)
                    .attr('gradientTransform', 'rotate(90)');

                // Assigning starting color of gradient
                newG
                    .append("stop")
                    .attr("stop-color", i === 0 ? "#7D3AC1" : "#EB548C")
                    .attr("offset","0%");
        
                // Assigning ending color of gradient
                newG
                    .append("stop")
                    .attr("stop-color", i === 0 ? "#AF4BCE" : "#EA7369")
                    .attr("offset","100%");

                // Assigning data and visual settings for chart data
                dataVisuals
                    .append('path')
                    .datum(dataState)
                    .attr('d', resizeCheckState > 0 && i === 0 ? areaRef :
                    resizeCheckState > 0 && i > 0 ? channelAreaRef :
                    startAreaRef
                    )
                    .attr('transform', `translate(${dimensions.width! / 15}, 0)`)
                    .attr('fill', i === 0 ? 'url(#gradient0)' : 'url(#gradient1)')
                    .attr('stroke', i === 0 ? '#29066B' : '#A5194D')
                    .attr('stroke-width', '.25rem')

                    .transition()
                    .duration(1000)
                    .ease(easeElastic)

                    .attr('d', i === 0 ? areaRef : channelAreaRef);
            };
            

            // Visual and placement settings for X axis
            const xAxisGroup = selectionState
                .append('g')
                .attr('transform', `translate(${dimensions.width! / 15}, ${dimensions.height! - (dimensions.height! / 8 * 1.2)})`)
                .style('stroke-width', '.3rem')
                .style("font-size", "1rem")
                .call(xAxis);

            // Visual and placement settings for Y axis
            const yAxisGroup = selectionState
                .append('g')
                .attr('transform', `translate(${dimensions.width! / 15}, 0)`)
                .style('stroke-width', '0rem')
                .style("font-size", "1rem")
                .style("text-anchor", "middle")
                .call(yAxis);


            // Adds tool tips for multiple data sets (Currently 2, can support more)
            for (let tIndex = 0; tIndex < 2; tIndex++) {
                selectionState
                .selectAll("dot")
                .data(dataState)
                .enter()
                .append("circle")
                .classed("tipArea", true)
                .attr("r", dimensions.width! / 32)
                .attr("cx", function(d) { return x(d.year); })
                .attr("cy", function(d) { return y( tIndex === 0 ? d.count : d.channel ); })
                .attr('transform', `translate(${dimensions.width! / 15}, 0)`)
                .on("mouseover", function(event, d) {
                    // Assigning i to find the index of matching data (this functions as the index)
                    const i: number = dataState.indexOf(d);
                    // Assigning lets, both used for displaying percentage difference between results
                    let greatCheck: string = "";
                    let colorClass: string = "";
                    console.log("Check this")
                    console.log(event.pageX)
                    console.log(event.pageY)
                    console.log(i)
                    

                    /* Checks if tooltip has previous data to reference, if it does then 
                    it will compare the current and previous data to check for a percentage difference.
                    Color and unicode sign will be assigned based on if current data is higher
                    or lower than the previous data
                    */
                    if (i > 0 && tIndex === 0) {
                        if (d.count > dataState[i - 1].count) {
                            greatCheck = `▲ ${percentDifference(dataState[i - 1].count, d.count)}%`
                            colorClass = `higher`
                        } else {
                            greatCheck = `▼ ${percentDifference(dataState[i - 1].count, d.count)}%`
                            colorClass = `lower`
                        };
                    } else if (i > 0 && tIndex === 1) {
                        if (d.channel > dataState[i - 1].channel) {
                            greatCheck = `▲ ${percentDifference(dataState[i - 1].channel, d.channel)}%`
                            colorClass = `higher`
                        } else {
                            greatCheck = `▼ ${percentDifference(dataState[i - 1].channel, d.channel)}%`
                            colorClass = `lower`
                        };
                    }

                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(
                        `<p> Date: ${(d.year).toDateString()}</p>` +
                        `<p>${ tIndex === 0 ? 'Count: ' + d.count : 'Channels: ' + d.channel }</p>` +
                        `<p class=${colorClass}>${greatCheck}</p>`
                        )
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 40) + "px");
                    })					
                .on("mouseout", function(d) {		
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
            };



                

        };
    }, [widthState, heightState]);


    return (

        <div ref={svgContainer} className='areaChart'>
            <svg ref={areaChart} className='svgArea'></svg>
        </div>

    )
}

export default AreaChart