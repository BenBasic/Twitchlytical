import React from 'react'
import { useQuery } from "@apollo/client";
import { GET_TOTAL_DATA, GET_DATA_DATE } from "../utils/queries";
import { DayData, WeeklyViewData } from './TypesAndInterfaces';

const now = new Date();

const weekQueryDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)


const HomeCharts: React.FC = () => {

    // const { loading, data, error } = useQuery(GET_TOTAL_DATA);
    const { loading, data, error } = useQuery(GET_DATA_DATE, {
		variables: { date: weekQueryDate },
	});

    console.log("Data check")
    console.log(data)

    const nestedData = data?.getTotalData;

    const archiveData = data?.getTotalData?.[0]?.archive;

    // Object containing the dates of the last 7 days, used as reference for assigning data to dates
    const weekDates = {
        day1: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6),
        day2: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5),
        day3: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 4),
        day4: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3),
        day5: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2),
        day6: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),
        day7: now,
    }

    // Array of empty arrays, will have archiveData pushed into them based on appropriate dates
    let weekData = {
        day1: [] as any[],
        day2: [] as any[],
        day3: [] as any[],
        day4: [] as any[],
        day5: [] as any[],
        day6: [] as any[],
        day7: [] as any[],
    }

    // For loop which assigns data from the last week to their matching dates
    for (let i = 0; i < archiveData?.length; i++) {
        // Assigning date objects for current archiveData and reference point for 8 days prior to current date
        const dateData = new Date(archiveData[i].createdAt);
        let previous: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);

        // For loop which checks date ranges to assign archiveData to matching date
        for (const key in weekDates) {
            if (weekDates.hasOwnProperty(key)) {
                if (dateData > previous && dateData <= weekDates[key as keyof typeof weekDates]) {
                    weekData[key as keyof typeof weekData].push(archiveData[i])
                }
                previous = weekDates[key as keyof typeof weekDates]
            };
        };
        console.log("weekData check")
        console.log(weekData);
    };

    // This function will reference archives after a specified date and provide a rounded average value
    const getAverage = (array: any[], keyValue: string) => {
        // Total and Count will keep track of total values and how many of them there are to divide them into an average number
        let total = 0;
        let count = 0;

        // Cycles through the returned list of archive data and adds them to the total and count values
        for (let i = 0; i < array.length; i++) {

            total = total + array[i][keyValue];
            count++

        };

        // Getting the average value by dividing total and count
        let average: any = total / count;

        // Rounding the average, without this the database tends to throw errors due to long decimal values
        let averageRounded: number = average.toFixed()*1;

        console.log("Total is " + total + ". With " + count + " items")
        console.log("Average is " + average)
        console.log("Average ROUNDED is " + averageRounded)

        // Returning the rounded average result
        return averageRounded;
    };

    // Function that creates the object containing all peak, avg, and date data for the last week
    function finalObj() {
        let newObj: any = {};
        // For loop to create day1 - day7 key value pairs
        for (let i = 1; i < Object.keys(weekData).length + 1; i++) {
            newObj[`day${i}` as keyof typeof newObj] = {
                peak: Math.max(...weekData[`day${i}` as keyof typeof weekData].map(o => o.view_count)),
                avg: getAverage(weekData[`day${i}` as keyof typeof weekData], "view_count"),
                date: weekDates[`day${i}` as keyof typeof weekDates],
            }
        }
        return newObj;
    };

    // This contains all the final data of peak, avg, and dates to be referenced in data visualization
    const finalWeekData: WeeklyViewData = finalObj()

    console.log("Final Week Data")
    console.log(finalWeekData)
    

    // const test = archiveData?.[0].createdAt;

    // console.log(test);

    // var mydate = new Date(test);
    
    // console.log(mydate);
    // console.log(mydate.toDateString());
    // console.log(weekQueryDate > mydate);

    return (
        <div>Test</div>
    )
}

export default HomeCharts