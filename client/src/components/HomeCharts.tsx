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

    const weekDates = {
        day1: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6),
        day2: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5),
        day3: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 4),
        day4: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3),
        day5: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2),
        day6: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),
        day7: now,
    }

    let weekData = {
        day1: [] as any[],
        day2: [] as any[],
        day3: [] as any[],
        day4: [] as any[],
        day5: [] as any[],
        day6: [] as any[],
        day7: [] as any[],
    }

    for (let i = 0; i < archiveData?.length; i++) {

        console.log("test " + i)
        
        const dateData = new Date(archiveData[i].createdAt);
        
        if (dateData < weekDates.day1) {
            console.log("Here " + i);
            weekData.day1.push(archiveData[i]);

        } else if (dateData < weekDates.day2 && dateData > weekDates.day1) {
            console.log("Here " + i);
            weekData.day2.push(archiveData[i]);
        } else if (dateData < weekDates.day3 && dateData > weekDates.day2) {
            console.log("Here " + i);
            weekData.day3.push(archiveData[i]);
        } else if (dateData < weekDates.day4 && dateData > weekDates.day3) {
            console.log("Here " + i);
            weekData.day4.push(archiveData[i]);
        } else if (dateData < weekDates.day5 && dateData > weekDates.day4) {
            console.log("Here " + i);
            weekData.day5.push(archiveData[i]);
        } else if (dateData < weekDates.day6 && dateData > weekDates.day5) {
            console.log("Here " + i);
            weekData.day6.push(archiveData[i]);
        } else if (dateData <= weekDates.day7 && dateData > weekDates.day6) {
            console.log("Here " + i);
            weekData.day7.push(archiveData[i]);
        };

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

    const finalWeekData: WeeklyViewData = {
        day1: {
            peak: Math.max(...weekData.day1.map(o => o.view_count)),
            avg: getAverage(weekData.day1, "view_count"),
            date: weekDates.day1,
        },
        day2: {
            peak: Math.max(...weekData.day2.map(o => o.view_count)),
            avg: getAverage(weekData.day2, "view_count"),
            date: weekDates.day2,
        },
        day3: {
            peak: Math.max(...weekData.day3.map(o => o.view_count)),
            avg: getAverage(weekData.day3, "view_count"),
            date: weekDates.day3,
        },
        day4: {
            peak: Math.max(...weekData.day4.map(o => o.view_count)),
            avg: getAverage(weekData.day4, "view_count"),
            date: weekDates.day4,
        },
        day5: {
            peak: Math.max(...weekData.day5.map(o => o.view_count)),
            avg: getAverage(weekData.day5, "view_count"),
            date: weekDates.day5,
        },
        day6: {
            peak: Math.max(...weekData.day6.map(o => o.view_count)),
            avg: getAverage(weekData.day6, "view_count"),
            date: weekDates.day6,
        },
        day7: {
            peak: Math.max(...weekData.day7.map(o => o.view_count)),
            avg: getAverage(weekData.day7, "view_count"),
            date: weekDates.day7,
        },
    };

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