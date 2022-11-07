import React, { useEffect, useRef, useState } from 'react'
import { select, selectAll, Selection } from 'd3-selection'
import { scaleLinear, scaleBand } from 'd3-scale'
import { max } from 'd3-array'
import { axisLeft, axisBottom } from 'd3-axis'
import 'd3-transition'
import { easeBounce, easeElastic } from 'd3-ease'

// Placeholder data, used for testing
const data = [
    {
        name: 'cool1',
        number: 9000,
    },
    {
        name: 'cool2',
        number: 7559,
    },
    {
        name: 'cool3',
        number: 2475,
    },
    {
        name: 'cool4',
        number: 1890,
    },
    {
        name: 'cool5',
        number: 8638,
    },
];

// Defining the dimensions of the chart and elements within it
const dimensions = {
    width: 800,
    height: 500,
    chartWidth: 700,
    chartHeight: 400,
    marginLeft: 100,
}

const TotalData: React.FC = () => {

    const svgRef = useRef<SVGSVGElement | null>(null)

    const [selectionState, setSelectionState] = useState<null | Selection<SVGSVGElement | null, unknown, null, undefined>>(null)

    const [dataState, setDataState] = useState(data)

    const maxValue = max(dataState, d => d.number)

    let y = scaleLinear()
        .domain([maxValue! +1, 0])
        .range([0, dimensions.chartHeight])

    let x = scaleBand()
        .domain(dataState.map(d=>d.name))
        .range([0, dimensions.chartWidth])
        .paddingInner(0.05)

    // Can specify how many ticks you want (wont always use that amount based on values)
    // Can adjust text with tickFormat, for example adding a $ sign before the data name its displaying
    const yAxis = axisLeft(y).ticks(3).tickFormat(d => `$${d} CAD`)

    const xAxis = axisBottom(x)

    // useEffect(() => {

    //     console.log(select(svgRef.current))
    //     select(svgRef.current)
    //         .append('rect')
    //         .attr('width', 100)
    //         .attr('height', 100)
    //         .attr('fill', 'blue')

    //     // selectAll('.foo') // Can select classes or ids with . or #

    //     selectAll('rect')
    //         .attr('width', 100)
    //         .attr('height', 100)
    //         .attr('fill', 'blue')
    //         .attr('x', (_,index) => index * 100)
            
    // });
    

    // useEffect(() => {
    //     if (!selectionState) {
    //         setSelectionState(select(svgRef.current))
    //     } else {
    //         const rects = selectionState
    //             .selectAll('rect')
    //             .data(data)
    //             .attr('width', 100)
    //             .attr('height', d=>d.units)
    //             .attr('fill', d=>d.color)
    //             .attr('x', (_, index) => index * 100)

    //         rects
    //             .enter()
    //             .append('rect')
    //             .attr('width', 100)
    //             .attr('height', d=>d.units)
    //             .attr('fill', d=>d.color)
    //             .attr('x', (_, index) => index * 100)
    //     }
    // }, [selectionState])


    useEffect(() => {
        if (!selectionState) {
            setSelectionState(select(svgRef.current))
        } else {
            // console.log("y(0) is ", y(0))
            // console.log("y(2305) is ", y(2305))
            // console.log("y(8754) is ", y(8754))

            const xAxisGroup = selectionState
                .append('g')
                .attr('transform', `translate(${dimensions.marginLeft}, ${dimensions.chartHeight})`)
                .call(xAxis)

            const yAxisGroup = selectionState
                .append('g')
                .attr('transform', `translate(${dimensions.marginLeft}, 0)`)
                .call(yAxis)

            selectionState
                .append('g')
                .attr('transform', `translate(${dimensions.marginLeft}, 0)`)
                .selectAll('rect')
                .data(dataState)
                .enter()
                .append('rect')
                .attr('width', x.bandwidth)
                .attr('x', d => {
                    const xValue = x(d.name)
                    if (xValue) {
                        return xValue
                    } else {
                        return null
                    }
                })
                .attr('height', 0)
                .attr('y', dimensions.chartHeight)
                .attr('fill', 'red')

                .transition()
                .duration(500)
                .delay((_, index) => index * 100)
                .ease(easeElastic)
                
                .attr('height', d=> dimensions.chartHeight - y(d.number))
                .attr('y', d => {
                    const yValue = y(d.number)
                    if (yValue) {
                        return yValue
                    } else {
                        return null
                    }
                })
                
                
        }
    }, [selectionState])

    useEffect(() => {
        if (selectionState) {
            y = scaleLinear()
                .domain([maxValue!, 0])
                .range([0, dimensions.chartHeight])
    
            x = scaleBand()
                .domain(dataState.map(d=>d.name))
                .range([0, dimensions.chartWidth])
                .paddingInner(0.05)

            const rects = selectionState.selectAll('rect').data(dataState)

            rects
                .exit()
                .transition()
                .duration(300)


                .attr('height', 0)
                .attr('y', dimensions.chartHeight)
                
                .remove()

            rects
                .transition()
                .duration(300)
                .delay(100)
                .attr('width', x.bandwidth)
                .attr('x', d => {
                    const xValue = x(d.name)
                    if (xValue) {
                        return xValue
                    } else {
                        return null
                    }
                })
                .attr('y', d => {
                    const yValue = y(d.number)
                    if (yValue) {
                        return yValue
                    } else {
                        return null
                    }
                })
                .attr('fill', 'red')
                .attr('height', d=> dimensions.chartHeight - y(d.number))

            rects
                .enter()
                .append('rect')
                .attr('width', x.bandwidth)
                .attr('x', d => {
                    const xValue = x(d.name)
                    if (xValue) {
                        return xValue
                    } else {
                        return null
                    }
                })
                .attr('height', 0)
                .attr('y', dimensions.chartHeight)
                .attr('fill', 'red')

                .transition()
                .duration(500)
                .delay(300)
                .ease(easeElastic)

                .attr('height', d=> dimensions.chartHeight - y(d.number))
                .attr('y', d => {
                    const yValue = y(d.number)
                    if (yValue) {
                        return yValue
                    } else {
                        return null
                    }
                })
                
        }
    }, [dataState])

    const addData = (i: Number) => {

        const newData = {
            name: `Test${i}`,
            number: 4000,
        }

        setDataState([...dataState, newData])
        console.log(i)
    };

    const [random, setRandom] = useState(0)

    const removeData = () => {
        if (dataState.length === 0) {
            return;
        };
        const changeData = dataState.slice(0, dataState.length - 1)
        setDataState(changeData)
    };

    return (
    <div>
        <svg ref={svgRef} width={dimensions.chartWidth + dimensions.marginLeft} height={dimensions.chartHeight + 50}>
        </svg>

        <button onClick={() => {
            setRandom(random + 1)
            addData(random)
        }}>Add</button>
        <button onClick={removeData}>Remove</button>
    </div>
    )
};

export default TotalData