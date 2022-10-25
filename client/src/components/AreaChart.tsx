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

    const [selectionState, setSelectionState] = useState<null | Selection<SVGSVGElement | null, unknown, null, undefined>>(null)

    const [dataState, setDataState] = useState(data)

    const dimensions = { width: 800, height: 400 }

    const maxValue = max(dataState, d => d.count)

    let y = scaleLinear()
    .domain([0, maxValue!])
    .range([dimensions.height - 100, 0])

    let x = scaleTime()
    .domain(
        d3.extent(dataState, (d) => {
            return d.year
        }) as [Date, Date]
      )
    .range([0, dimensions.width - 100])

    const yAxis = axisLeft(y)

    const xAxis = axisBottom(x).ticks(5).tickPadding(12)

    const areaRef: any = area()
    .x((d:any)=> x(d.year))
    .y0(y(0))
    .y1((d:any)=> y(d.count))

    const startAreaRef: any = area()
    .x((d:any)=> x(d.year))
    .y0(y(0))
    .y1(dimensions.height - 100)

    const channelAreaRef: any = area()
    .x((d:any)=> x(d.year))
    .y0(y(0))
    .y1((d:any)=> y(d.channel))


    useEffect(() => {
        if (!selectionState) {
            setSelectionState(select(areaChart.current))
        } else {



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
                .attr('width', dimensions.width)
                .attr('height', dimensions.height)
                .style('background-color', '#4c6485');


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

                dataVisuals
                    .append('path')
                    .datum(dataState)
                    .attr('d', startAreaRef)
                    .attr('transform', 'translate(50, 50)')
                    .attr('fill', i === 0 ? 'url(#gradient0)' : 'url(#gradient1)')
                    .attr('stroke', i === 0 ? '#29066B' : '#A5194D')
                    .attr('stroke-width', '.25rem')

                    .transition()
                    .duration(1000)
                    .ease(easeElastic)

                    .attr('d', i === 0 ? areaRef : channelAreaRef);
            };
            


            const xAxisGroup = selectionState
                .append('g')
                .attr('transform', `translate(50, ${dimensions.height - 50})`)
                .style('stroke-width', '.3rem')
                .style("font-size", "1rem")
                .call(xAxis);

            const yAxisGroup = selectionState
                .append('g')
                .attr('transform', `translate(50, 50)`)
                .style('stroke-width', '0rem')
                .call(yAxis);


            for (let tIndex = 0; tIndex < 2; tIndex++) {
                selectionState
                .selectAll("dot")
                .data(dataState)
                .enter()
                .append("circle")
                .attr("r", 15)
                .attr("cx", function(d) { return x(d.year); })
                .attr("cy", function(d) { return y( tIndex === 0 ? d.count : d.channel ); })
                .attr('transform', 'translate(50, 50)')
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
    });


    return (
        <div className='areaChart'>
            <svg ref={areaChart}></svg>
        </div>
    )
}

export default AreaChart