import React, { useState } from 'react'
import { useQuery } from "@apollo/client";
import { GET_DATA_DATE } from "../utils/queries";
import { GetTotal, WeeklyViewData } from './TypesAndInterfaces';
import AreaChart from './AreaChart';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography'
// Importing colors from Material UI
import { indigo, deepPurple } from '@mui/material/colors';

// Object containing style properties used for the MUI implementation throughout this file
const styles = {
    container: {
        backgroundColor: indigo[100],
        paddingBottom: '1rem',
    },
    mainTitle: {
        display: 'inline-block',
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
    },
    title: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
        color: 'white',
        backgroundColor: indigo[700],
        borderRadius: '1rem'
    },
};

const now = new Date();

const weekQueryDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)


const HomeCharts: React.FC<GetTotal> = (props) => {

    const archiveData = props?.totalVal?.archive;

    // Object containing the dates of the last 7 days, used as reference for assigning data to dates
    const weekDates = {
        day1: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6),
        day2: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5),
        day3: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 4),
        day4: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3),
        day5: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2),
        day6: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),
        day7: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
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

        // For loop which checks date ranges to assign archiveData to matching date
        for (const key in weekDates) {
            if (weekDates.hasOwnProperty(key)) {
                let previous: Date = weekDates[key as keyof typeof weekDates];
                let next: Date = new Date(previous.getFullYear(), previous.getMonth(), previous.getDate() + 1)
                if (dateData > previous && dateData < next) {
                    weekData[key as keyof typeof weekData].push(archiveData[i])
                }
            };
        };
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
        let averageRounded: number = average.toFixed() * 1;

        // Returning the rounded average result
        return averageRounded;
    };

    // Function that creates the object containing all peak, avg, and date data for the last week
    function finalObj(val: string) {
        let newObj: any = {};
        // For loop to create day1 - day7 key value pairs
        for (let i = 1; i < Object.keys(weekData).length + 1; i++) {
            newObj[`day${i}` as keyof typeof newObj] = {
                peak: Math.max(...weekData[`day${i}` as keyof typeof weekData].map(o => o[val])),
                avg: getAverage(weekData[`day${i}` as keyof typeof weekData], val),
                date: weekDates[`day${i}` as keyof typeof weekDates],
            }
        }
        return newObj;
    };

    // This contains all the final data of peak, avg, and dates to be referenced in data visualization
    const finalWeekData: WeeklyViewData = finalObj("view_count")
    const finalChannelData: WeeklyViewData = finalObj("totalChannels")
    const finalGameData: WeeklyViewData = finalObj("totalGames")


    const [canMount, setCanMount] = useState<boolean>(false);

    // Checks if loading is done and hasnt already had its completion state triggered, will load top games if so
    if (props.loading === false && canMount === false) {
        setCanMount(true);
    };

    console.log("Final Week Data")
    console.log(finalWeekData)

    return (
        <Box sx={{ flexGrow: 1 }} style={styles.container}>
            <Grid container alignItems="center" justifyContent="center">
                <Grid container maxWidth="md" alignItems="center" justifyContent="center" textAlign='center'>
                    <Grid item xs={12}>
                        <Typography variant={'h4'} mb={2} mt={1} borderBottom={5} borderTop={5} borderColor={deepPurple[700]} style={styles.mainTitle}>
                            This Week
                        </Typography>
                    </Grid>
                    {canMount === true ?
                        <>
                            <Grid item xs={10} sm={3.9} ml={.2} mr={.2} className="homeChartItem">
                                <Typography variant={'h5'} textAlign='center' style={styles.title}
                                    width={'100%'}
                                >
                                    Live Views
                                </Typography>
                                <AreaChart dayProps={finalWeekData} type="view"></AreaChart>
                            </Grid>
                            <Grid item xs={10} sm={3.9} my={{ xs: 1.8, sm: 0 }} ml={.2} mr={.2} className="homeChartItem">
                                <Typography variant={'h5'} textAlign='center' style={styles.title}>
                                    Live Channels
                                </Typography>
                                <AreaChart dayProps={finalChannelData} type="channel"></AreaChart>
                            </Grid>
                            <Grid item xs={10} sm={3.9} ml={.2} mr={.2} className="homeChartItem">
                                <Typography variant={'h5'} textAlign='center' style={styles.title}>
                                    Live Games
                                </Typography>
                                <AreaChart dayProps={finalGameData} type="game"></AreaChart>
                            </Grid>
                        </> :
                        <Grid item xs={12}>
                            <Typography className='areaChart' variant={'h4'} textAlign='center'>
                                Loading Charts...
                            </Typography>
                        </Grid>
                    }
                </Grid>
            </Grid>

        </Box>
    )
};

export default HomeCharts;