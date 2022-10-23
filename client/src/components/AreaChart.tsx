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

const data = [
    { year: '2014', count: 25 },
    { year: '2015', count: 30 },
    { year: '2016', count: 75 },
    { year: '2017', count: 57 },
    { year: '2018', count: 68 },
];


const AreaChart = () => {

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
        }) as unknown as [Date, Date]
      )
    .range([0, dimensions.width - 100])

    const yAxis = axisLeft(y)

    const xAxis = axisBottom(x)

    // FIGURE OUT WHY THIS AREA STUFF ISNT WORKING?????????

    // const areaRef = area()
    //     .x(d:any => x(d.year))
    //     .y0(y(0))
    //     .y1(d:any => y(d.count))

    const areaRef: any = area()
    .x((d:any)=> x(d.year)!)
    .y0(y(0))
    .y1((d:any)=> y(d.count))


    useEffect(() => {
        if (!selectionState) {
            setSelectionState(select(areaChart.current))
        } else {

            const xAxisGroup = selectionState
                .append('g')
                .attr('transform', `translate(20, ${dimensions.height - 50})`)
                .call(xAxis)

            const yAxisGroup = selectionState
                .append('g')
                .attr('transform', `translate(20, 50)`)
                .call(yAxis)


            selectionState
                .attr('width', dimensions.width)
                .attr('height', dimensions.height)
                .style('background-color', 'yellow')
                .append('path')
                .datum(dataState)
                .attr('d', areaRef)
                .attr('fill', 'red')
                .attr('stroke', 'blue')
                .attr('stroke-width', 2)
                .attr('transform', 'translate(20, 50)')

        }
    })


    return (
        <div className='areaChart'>
            <svg ref={areaChart}></svg>
        </div>
    )
}

export default AreaChart