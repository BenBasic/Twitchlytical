import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography'
import BroadcasterPerformanceChart from './BroadcasterPerformanceChart';
import PieChart from './PieChart';
import { ExtraDayData, Stats, GameStatProps } from './TypesAndInterfaces';
import { nestedArrayAverageCalc, indexKeyVal, createMiniListData, Comparator } from '../utils/helpers';
import { getData } from '../utils/clientFetches';

import { useQuery } from "@apollo/client";
import { GET_TOP_GAME_WEEK } from "../utils/queries";

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

const GameStats: React.FC<GameStatProps> = (props) => {

    const { loading, data, error } = useQuery(GET_TOP_GAME_WEEK);

    const topGameData = data?.getTopGames[0]?.topGames;

    let topGameSorted: Stats[] = createMiniListData(topGameData).sort(Comparator).slice(0, 5)


    const [topGames, setTopGames] = useState<Stats[]>(topGameSorted);

    const [dayChartFinal, setDayChartFinal] = useState<Stats[]>([])

    const [totalValState, setTotalValState] = useState<number>(0)

    const [topGameValState, setTopGameValState] = useState<number>(0)

    const [toolTipInfo, setToolTipInfo] = useState<ExtraDayData[]>([])

    const [canMount, setCanMount] = useState<boolean>(false);

    let chartData = props?.chartData;

    let dayData: any[] = [];

    let dayChartData: Stats[] = [];

    let totalVal: number = 0;

    let topGameVal: number = 0;

    for (let i = 0; i < chartData?.length; i++) {
        let refDate = new Date(chartData[i]?.date).toLocaleDateString(undefined, ({ weekday: "long" }));

        let findIndex = indexKeyVal(dayData, refDate, 'name');
        // If weekday already exists, add additional viewAvg and channelAvg to the view and streams arrays
        if (findIndex > -1) {
            dayData[findIndex]?.views.push(chartData[i]?.viewAvg);
            dayData[findIndex]?.streams.push(chartData[i]?.channelAvg);
        };

        // If weekday doesnt exist yet, add a new object to the dayData array of objects
        if (findIndex <= -1) {
            dayData.push(
                {
                    name: refDate,
                    views: [chartData[i]?.viewAvg],
                    streams: [chartData[i]?.channelAvg],
                }
            )
        };
    };

    dayData = nestedArrayAverageCalc(dayData, 'views');
    dayData = nestedArrayAverageCalc(dayData, 'streams');

    console.log("dayData is");
    console.log(dayData);

    for (let j = 0; j < dayData?.length; j++) {
        let avgVal: number = parseFloat((dayData[j].views / dayData[j].streams).toFixed());
        dayChartData.push({
            name: dayData[j].name,
            views: avgVal,
        })
        totalVal += avgVal;
    };

    if (topGameVal === 0 && topGameSorted?.length > 0 && topGameValState === 0) {
        for (let v = 0; v < topGameSorted?.length; v++) {
            topGameVal += topGameSorted[v]?.views;
        };
        setTopGameValState(topGameVal);
    };

    if (dayChartFinal === undefined || dayChartFinal?.length === 0) setDayChartFinal(dayChartData);
    if (totalValState === 0) setTotalValState(totalVal);
    if (toolTipInfo === undefined || toolTipInfo?.length === 0) setToolTipInfo(dayData);

    // Checks if loading is done and hasnt already had its completion state triggered, will load top games if so
    if (loading === false && canMount === false) {
        setTopGames(topGameSorted)
        setCanMount(true);
    };

    return (
        <Box sx={{ flexGrow: 1 }} style={styles.container}>
            <Grid container alignItems="center" justifyContent="center">
                <Grid container maxWidth="md" alignItems="center" justifyContent="center" textAlign='center'>
                    <Grid item xs={12}>

                        <Grid item xs={12} className="homeChartItem">
                            <Typography variant={'h5'} textAlign='center' style={styles.title}
                                width={'100%'}
                            >
                                Recent Game Performance
                            </Typography>
                            {chartData === undefined || chartData?.length === 0 ?
                                <Typography className='areaChart' variant={'h4'} textAlign='center'>
                                    Loading Chart...
                                </Typography>
                                :
                                chartData?.length < 2 ?
                                    <>
                                        <Typography className='areaChart' variant={'h4'} textAlign='center'>
                                            User Streams Unavailable
                                        </Typography>
                                        <Typography className='areaChart' variant={'subtitle2'} textAlign='center'>
                                            This is caused by the user having VODs disabled, or user hasn't streamed at least twice recently
                                        </Typography>
                                    </>
                                    :
                                    <BroadcasterPerformanceChart
                                        profileData={[{ peak: 1, avg: 1, date: now, duration: 'null', title: 'test' }]}
                                        gameData={chartData}
                                        type={'view'}
                                    />
                            }
                        </Grid>
                    </Grid>

                    <Grid container maxWidth="md" alignItems="center" justifyContent="center" textAlign='center'>
                        <Grid item xs={12}>
                            <Typography variant={'h4'} mb={2} mt={1} borderBottom={5} borderTop={5} borderColor={deepPurple[700]} style={styles.mainTitle}>
                                Game Breakdown
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid item xs={10} sm={5.9} md={5.7} mb={2} ml={{ sm: .2, md: .6 }} mr={{ sm: .2, md: .6 }} pb={{ xs: '1.7rem', sm: '.5rem' }} className="homeChartItem">
                        <Typography variant={'h5'} mb={{ xs: 3, sm: 1.5 }} textAlign='center' style={styles.title}
                            width={'100%'}
                        >
                            Daily Views Per Stream
                        </Typography>
                        {dayChartFinal === undefined || dayChartFinal?.length === 0 ?
                            <Typography className='areaChart' variant={'h4'} textAlign='center'>
                                Loading Chart...
                            </Typography>
                            :
                            dayChartFinal?.length < 2 ?
                                <>
                                    <Typography className='areaChart' variant={'h4'} textAlign='center'>
                                        Day Breakdown Unavailable
                                    </Typography>
                                    <Typography className='areaChart' variant={'subtitle2'} textAlign='center'>
                                        This is caused by the user having VODs disabled, or user hasn't streamed at least twice recently
                                    </Typography>
                                </>
                                :
                                <PieChart
                                    dataSet={dayChartFinal}
                                    totalVal={totalValState}
                                    type={"dayRatio"}
                                    extraTip={toolTipInfo}
                                />
                        }
                    </Grid>


                    <Grid item xs={10} sm={5.9} md={5.7} mb={2} ml={{ sm: .2, md: .6 }} mr={{ sm: .2, md: .6 }} pb={{ xs: '1.7rem', sm: '.5rem' }} className="homeChartItem">
                        <Typography variant={'h5'} mb={{ xs: 3, sm: 1.5 }} textAlign='center' style={styles.title}
                            width={'100%'}
                        >
                            View Comparison
                        </Typography>
                        {topGames === undefined || topGames?.length === 0 ?
                            <Typography className='areaChart' variant={'h4'} textAlign='center'>
                                Loading Chart...
                            </Typography>
                            :
                            topGames?.length < 2 ?
                                <>
                                    <Typography className='areaChart' variant={'h4'} textAlign='center'>
                                        Day Breakdown Unavailable
                                    </Typography>
                                    <Typography className='areaChart' variant={'subtitle2'} textAlign='center'>
                                        This is caused by the user having VODs disabled, or user hasn't streamed at least twice recently
                                    </Typography>
                                </>
                                :
                                <PieChart
                                    dataSet={topGames}
                                    totalVal={topGameValState}
                                    type={"vs"}
                                    user={{ name: chartData[0]?.title, views: Math.max(...chartData.map(o => o.viewPeak)) }}
                                />
                        }
                    </Grid>
                </Grid>
            </Grid>

        </Box>
    )
}

export default GameStats