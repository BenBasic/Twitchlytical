import React, { useState, useEffect, useRef } from 'react';

import { PieArcDatum, arc, pie } from 'd3-shape';
import { select, Selection } from 'd3-selection'
import { easeElastic } from 'd3-ease'
import { Stats, PieProps } from './TypesAndInterfaces'
import { indexKeyVal } from '../utils/helpers';
import useChartResize from 'src/utils/chartResizeHook';

const colorTest = ['#AF4BCE', '#1de441', '#EA7369', '#1ac9e6', '#d8ac2d', "#de542c", '#E113B4']
const colorOutline = ["#29066B", "#084914", "#A5194D", "#142459", "#991212", "#8F2000", '#A2007E']
const colorToolTip = ["#29066B", "#084914", "#A5194D", "#142459", "#991212", "#de542c", '#A2007E']

const PieChart: React.FC<PieProps> = (props) => {

    let extraPropExists: boolean = false;
    if (props.extraTip !== undefined) extraPropExists = true;

    let top5Total = 0;

    let matchingCheck: boolean = false;
    let mcIndex: number = 0;

    for (let i = 0; i < props?.dataSet.length; i++) {
        top5Total += props.dataSet[i].views;
        if (props.user?.name === props.dataSet[i].name) {
            matchingCheck = true;
            mcIndex = i;
        }
    };

    // If prop type isnt day, then add "Other" object for remaining value left
    const dataFinal = (props.type === "day" || props.type === "dayRatio") ?
    props.dataSet :
    (props.type === "vs" && props.user) ?
    [{name: props.user?.name, views: props.user?.views}, { name: "Top 5", views: (props.totalVal - (matchingCheck === true ? props.dataSet[mcIndex].views : 0)) }] :
    [...props.dataSet, { name: "Other", views: (props.totalVal - top5Total) }]

    console.log("dataFinal is")
    console.log(dataFinal)

    const pieChart = useRef<SVGSVGElement | null>(null);

    // Calling imported useChartResize hook to track width and height of svg container for mobile responsiveness
    const [widthState, heightState, svgContainer] = useChartResize();

    // State keeping track of refreshes, used to prevent enter animation retriggering when resizing container
    const [resizeCheckState, setResizeCheckState] = useState<number>(0);

    // State used for svg element selections, sort of like a root for all branching d3 manipulations
    const [selectionState, setSelectionState] = useState<null | Selection<SVGSVGElement | null, unknown, null, undefined>>(null)

    // Dimensions to be referenced for svg sizing and placement
    let dimensions = { width: widthState, height: heightState }

    useEffect(() => {

        // If theres no selection, select the current value from the areaChart ref
        if (!selectionState) {
            setSelectionState(select(pieChart.current))
        } else {
            // Refreshes the chart so it doesnt infinitely redraw svgs on top of eachother while resizing
            const oldChart = selectionState.selectAll("*");
            oldChart.remove();

            // Increments the peak for the state, used to prevent enter animation re-triggering
            setResizeCheckState(resizeCheckState + 1)

            // Get positions for each data object
            const piedata = pie<Stats>().value(d => d.views)(dataFinal)
            // Define arcs for graphing 
            const arcdata = arc<PieArcDatum<Stats>>().innerRadius(0).outerRadius(dimensions.width! / 3.7)

            // Define the size and position of svg
            let svg = selectionState
                .attr('width', dimensions.width!)
                .attr('height', dimensions.height!)
                .append('g')
                .attr('transform', `translate(${dimensions.width! / 2},${dimensions.height! / 2})`)

            // Add tooltip
            const tooltip = select('.pieContainer')
                .append('div')
                .attr('class', 'tooltip')
                .style("opacity", 0);

            // Draw pie
            svg.append('g')
                .selectAll('path')
                .data(piedata)
                .join('path')
                .attr('d', arcdata)
                .attr('fill', (d, i) => colorTest[d.index])
                .attr('stroke', (d, i) => colorOutline[d.index])
                .attr('stroke-width', '.25rem')

                .on("mouseenter", function (d) {
                    select(this)
                        .transition()
                        .duration(200)
                        .ease(easeElastic)
                        .attr('transform', `scale(1.1)`)
                })

                .on('mouseover', (e, d) => {

                    let findDayIndex:number = 0
                    if (props?.extraTip !== undefined) {
                        findDayIndex = indexKeyVal(props.extraTip, 'name', d.data.name);
                    }

                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(
                        // Name of data being displayed on tooltip
                        `<p class='toolTitle'>
                        ${d.data.name}
                        </p>` +
                        // Percentage of total value (ex: 2 out of 10 will show 20%)
                        // Checks if prop type is "vs", if so then it will calculate percentage based on view values
                        // from data instead of passed in totalVal prop to prevent inaccurate percentage values
                        `<p class="toolInfo" style='background-color: ${colorToolTip[d.index]};'>
                        ${(d.data.views /
                        (matchingCheck === false && props.type !== "vs" ? props.totalVal :
                        dataFinal[0].views + dataFinal[1].views) * 100).toFixed(2)}%
                        </p>` +
                        // Value of item (ex: 2500), will add commas to large numbers for readability (ex: 2,500)
                        // Checks if prop type is "day", if so then it will add "stream(s)" after value (ex: 4 streams)
                        `<p class='percentage' >
                        ${d.data.views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        ${props.type === "day" && d.data.views > 1 ? "streams" :
                        props.type === "day" && d.data.views === 1 ? "stream" :
                        ""}
                        </p>` +
                        // Context info for item value (out of last x streams, x day peak, etc)
                        // Checks if prop type is "vs" if so it will map through the data to display
                        // the names and view value. It will also check if the name of streamer is in the
                        // top 5 list, if so it will display text letting the user know. Otherwise it will
                        // display context info for other prop types.
                        (props.type === "vs" ?
                        `<p class='toolDate'>
                        ${
                        (dataFinal[0].views > dataFinal[1].views && d.index === 1) || (dataFinal[0].views < dataFinal[1].views && d.index === 0) ?
                        props.dataSet.map((streamer: Stats, index: number) => (
                            streamer.name === props.user?.name ?
                            `<li class='toolList topLine' style='background-color: black; color: white'>${index + 1}. ${streamer.name}</li>` :

                            `<li class='toolList topLine'>${index + 1}. ${streamer.name}</li>` +
                            `<li class='toolList'>${streamer.views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</li>`
                        )).join('') :
                        '7 day peak'}
                        ` :
                        `<p class='toolDate'>
                        ${props.type === "day" ? `Out of last ${props.totalVal} streams` :
                        props.type === "dayRatio" ? `views per stream` :
                        d.index === 0 ? 'remaining views' : '7 day ' + props.type}
                        </p>`) +

                        (extraPropExists === true && props.type === "dayRatio" && props?.extraTip ?
                        `<p class='toolTitle'>
                        
                        </p>` +
                        `<p class='toolTitle'>
                        Totals
                        </p>` +
                        `<p class='percentage' >
                        ${props.extraTip[findDayIndex]?.views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </p>` +
                        `<p class='toolDate'>
                        average live views
                        </p>` +

                        `<p class='percentage' >
                        ${props.extraTip[findDayIndex]?.streams.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </p>` +
                        `<p class='toolDate'>
                        average streams
                        </p>` :
                        ``
                        )
                    )
                })
                .on("mousemove", function (event) {
                    tooltip
                        .style("left", (event.pageX > (window.innerWidth - 150) ? event.pageX - 120 : event.pageX + 10) + "px")
                        .style("top", (event.pageY - 40) + "px");
                })
                .on("mouseout", function (d) {
                    select(this)
                    .transition()
                    .duration(200)
                    .ease(easeElastic)
                    .attr('transform', `scale(1)`)

                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

            svg
                .selectAll('mySlices')
                .data(piedata)
                .enter()
                .append('text')
                .attr('class', 'pieLabel')
                .text(function (d) { return ((props.type === "day" || props.type === "dayRatio") ? d.data.name.replace("urday", "").replace("nesday", "").replace("day", "") :
                props.type === "vs" && props.user && dataFinal[0].views > dataFinal[1].views && d.index === 1 ? d.data.name :
                props.type === "vs" && props.user && dataFinal[0].views > dataFinal[1].views && d.index === 0 ? '' :
                d.index === 0 ? d.data.name : '') })
                .attr("transform", function (d) {
                    return "translate(" +
                    ((props.type === "day" || props.type === "dayRatio") ? arcdata.centroid(d)[0] - dimensions.width! / 35 : arcdata.centroid(d)[0] / 2) +
                        "," + (arcdata.centroid(d)[1] + dimensions.height! / 50) + ")";
                })
                .attr('dx', props.type === "vs" && props.user && dataFinal[0].views > dataFinal[1].views ? '-2rem' :
                '0rem')
                .style("text-anchor", "center")
                //'.9rem'
                .style("font-size", `${(dimensions.width! / 40)}px`)
                .attr('fill', 'white')
        }


    }, [widthState, heightState])

    return (
        <div ref={svgContainer} className='pieContainer'>
            <svg ref={pieChart} className='pieSvg'></svg>
        </div>
    )
}

export default PieChart