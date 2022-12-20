import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { PieArcDatum } from 'd3-shape';
import { select, selectAll, Selection } from 'd3-selection'
import { easeBounce, easeElastic } from 'd3-ease'
import { Stats, PieProps } from './TypesAndInterfaces'

const colorTest = ['#AF4BCE', '#1de441', '#EA7369', '#1ac9e6', '#d8ac2d', '#e7e35e']
const colorOutline = ["#29066B", "#084914", "#A5194D", "#142459", "#991212", "#de542c"]
const colorToolTip = ["#29066B", "#084914", "#A5194D", "#142459", "#991212", "#de542c"]

const PieChart: React.FC<PieProps> = (props) => {

    let extraPropExists: boolean = false;
    if (props.extraTip !== undefined) extraPropExists = true;

    let top5Total = 0;

    let matchingCheck = false;

    for (let i = 0; i < props?.dataSet.length; i++) {
        top5Total += props.dataSet[i].views;
        if (props.user?.name === props.dataSet[i].name) matchingCheck = true;
    };

    // If prop type isnt day, then add "Other" object for remaining value left
    const dataFinal = (props.type === "day" || props.type === "dayRatio") ?
    props.dataSet :
    (props.type === "vs" && props.user) ?
    [{name: props.user?.name, views: props.user?.views}, { name: "Top 5", views: (props.totalVal - (matchingCheck === true ? props.user?.views! : 0)) }] :
    [...props.dataSet, { name: "Other", views: (props.totalVal - top5Total) }]

    const pieChart = useRef<SVGSVGElement | null>(null)

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

            console.log("OLD CHART IS")
            console.log(oldChart)

            // Increments the peak for the state, used to prevent enter animation re-triggering
            console.log("Original resize is " + resizeCheckState)
            setResizeCheckState(resizeCheckState + 1)
            console.log("NEW resize is " + resizeCheckState)

            // Get positions for each data object
            const piedata = d3.pie<Stats>().value(d => d.views)(dataFinal)
            // Define arcs for graphing 
            const arc = d3.arc<PieArcDatum<Stats>>().innerRadius(0).outerRadius(dimensions.width! / 3.7)

            console.log("DIMENTIONS PIE CHART")
            console.log("DIMENTIONS PIE CHART")
            console.log("DIMENTIONS PIE CHART")
            console.log("DIMENTIONS PIE CHART")
            console.log("DIMENTIONS PIE CHART")
            console.log("DIMENTION W " + dimensions.width)
            console.log("DIMENTION H " + dimensions.height)

            // Define the size and position of svg
            let svg = selectionState
                .attr('width', dimensions.width!)
                .attr('height', dimensions.height!)
                .append('g')
                .attr('transform', `translate(${dimensions.width! / 2},${dimensions.height! / 2})`)

            // Add tooltip
            const tooltip = d3.select('.pieContainer')
                .append('div')
                .attr('class', 'tooltip')
                .style("opacity", 0);

            // Draw pie
            svg.append('g')
                .selectAll('path')
                .data(piedata)
                .join('path')
                .attr('d', arc)
                .attr('fill', (d, i) => colorTest[d.index])
                .attr('stroke', (d, i) => colorOutline[d.index])
                .attr('stroke-width', '.25rem')

                .on("mouseenter", function (d) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .ease(easeElastic)
                        .attr('transform', `scale(1.1)`)
                })

                .on('mouseover', (e, d) => {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(
                        // Name of data being displayed on tooltip
                        `<p class='toolTitle'>
                        ${d.data.name}
                        </p>` +
                        // Percentage of total value (ex: 2 out of 10 will show 20%)
                        // Checks if prop type is "vs", if so then it will hide the remainder percentage if item isnt in the top 5 to
                        // avoid 100% displaying on remainder of the pie chart
                        `<p class="${props.type !== "vs" ? 'toolInfo' :
                        (matchingCheck === false && d.index === 0 ? 'hiddenElem' : 'toolInfo')}" style='background-color: ${colorToolTip[d.index]};'>
                        ${(d.data.views / props.totalVal * 100).toFixed(2)}%
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
                        d.index === 0 ?
                        props.dataSet.map((streamer: Stats, index: number) => (
                            streamer.name === props.user?.name ?
                            `<li class='toolList topLine'>${streamer.name} is in the Top 5</li>` :

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
                        ${props.extraTip[(props.extraTip.length - 1) - d.index]?.views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </p>` +
                        `<p class='toolDate'>
                        average live views
                        </p>` +

                        `<p class='percentage' >
                        ${props.extraTip[(props.extraTip.length - 1) - d.index]?.streams.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
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
                    d3.select(this)
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
                .text(function (d) { return ((props.type === "day" || props.type === "dayRatio") ? d.data.name : d.index === 0 ? d.data.name : '') })
                .attr("transform", function (d) {
                    return "translate(" +
                    ((props.type === "day" || props.type === "dayRatio") ? arc.centroid(d)[0] - dimensions.width! / 20 : arc.centroid(d)[0] / 2) +
                        "," + arc.centroid(d)[1] + ")";
                })
                .style("text-anchor", "center")
                .style("font-size", '.9rem')
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