import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { PieArcDatum } from 'd3-shape';
import { select, selectAll, Selection } from 'd3-selection'
import { Stats, PieProps } from './TypesAndInterfaces'

const colorTest = ['#1de441', '#EA7369', '#1ac9e6', '#d8ac2d', '#e7e35e', '#AF4BCE']
const colorOutline = ["#084914", "#A5194D", "#142459", "#991212", "#de542c", "#29066B"]

const PieChart: React.FC<PieProps> = (props) => {

    const dataFinal = [...props.dataSet, { name: "Rest of Twitch", views: props.totalVal }]

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
                // .style('background-color','yellow')
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
                .attr('fill', (d, i) => colorTest[i])
                .attr('stroke', (d, i) => colorOutline[i])
                .attr('stroke-width', '.15rem')
                .on('mouseover', (e, d) => {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(
                        `<p class='toolTitle'>
                        ${d.data.name}
                        </p>` +

                        `<p class='toolInfo' style='background-color: red;'>
                        ${d.data.views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </p>`
                    )
                })
                .on("mousemove", function (event) {
                    tooltip
                        .style("left", (event.pageX > (window.innerWidth - 150) ? event.pageX - 120 : event.pageX + 10) + "px")
                        .style("top", (event.pageY - 40) + "px");
                })
                .on("mouseout", function (d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
        }


    }, [widthState, heightState])

    return (
        <div ref={svgContainer} className='pieContainer'>
            <svg ref={pieChart} className='pieSvg'></svg>
        </div>
    )
}

export default PieChart