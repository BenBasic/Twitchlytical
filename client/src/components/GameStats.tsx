import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography'
import BroadcasterPerformanceChart from './BroadcasterPerformanceChart';
import PieChart from './PieChart';
import { BroadcasterStatProps, ProfileData, Stats, TopStreams, GameStatProps } from './TypesAndInterfaces';
import { createBroadcasterPerformanceList, createShortStreamerList, Comparator } from '../utils/helpers';
import { getData } from '../utils/clientFetches';

import { useQuery } from "@apollo/client";
import { GET_TOP_STREAM_WEEK } from "../utils/queries";

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

    let chartData = props?.chartData;

    return (
        <Box sx={{ flexGrow: 1 }} style={styles.container}>
            <Grid container alignItems="center" justifyContent="center">
                <Grid container maxWidth="md" alignItems="center" justifyContent="center" textAlign='center'>
                    <Grid item xs={12}>

                        <Grid item xs={12} className="homeChartItem">
                            <Typography variant={'h5'} textAlign='center' style={styles.title}
                                width={'100%'}
                            >
                                Recent Stream Performance
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
                                        profileData={[{peak: 1, avg: 1, date: now, duration: 'null', title: 'test'}]}
                                        gameData={chartData}
                                        type={'view'}
                                    />
                            }
                        </Grid>
                    </Grid>

                    {/* <Grid container maxWidth="md" alignItems="center" justifyContent="center" textAlign='center'>
                        <Grid item xs={12}>
                            <Typography variant={'h4'} mb={2} mt={1} borderBottom={5} borderTop={5} borderColor={deepPurple[700]} style={styles.mainTitle}>
                                Stream Breakdown
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid item xs={10} sm={5.9} md={5.7} mb={2} ml={{ sm: .2, md: .6 }} mr={{ sm: .2, md: .6 }} pb={{ xs: '1.7rem', sm: '.5rem' }} className="homeChartItem">
                        <Typography variant={'h5'} mb={{ xs: 3, sm: 1.5 }} textAlign='center' style={styles.title}
                            width={'100%'}
                        >
                            Days Streamed
                        </Typography>
                        {dataList === undefined || dataList?.length === 0 ?
                            <Typography className='areaChart' variant={'h4'} textAlign='center'>
                                Loading Chart...
                            </Typography>
                            :
                            dataList?.length < 2 ?
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
                                    dataSet={dayDataState}
                                    totalVal={streamAmount}
                                    type={"day"}
                                />
                        }
                    </Grid>


                    <Grid item xs={10} sm={5.9} md={5.7} mb={2} ml={{ sm: .2, md: .6 }} mr={{ sm: .2, md: .6 }} pb={{ xs: '1.7rem', sm: '.5rem' }} className="homeChartItem">
                        <Typography variant={'h5'} mb={{ xs: 3, sm: 1.5 }} textAlign='center' style={styles.title}
                            width={'100%'}
                        >
                            View Comparison
                        </Typography>
                        {dataList === undefined || dataList?.length === 0 ?
                            <Typography className='areaChart' variant={'h4'} textAlign='center'>
                                Loading Chart...
                            </Typography>
                            :
                            dataList?.length < 2 ?
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
                                    dataSet={streamerData}
                                    totalVal={streamerViewTotal}
                                    type={"vs"}
                                    user={{ name: props.username, views: Math.max(...dataList.map(o => o.peak)) }}
                                />
                        }
                    </Grid> */}
                </Grid>
            </Grid>

        </Box>
    )
}

export default GameStats