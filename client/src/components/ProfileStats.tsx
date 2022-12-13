import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography'
import BroadcasterPerformanceChart from './BroadcasterPerformanceChart';
import PieChart from './PieChart';
import { BroadcasterStatProps, ProfileData, Stats, TopStreams } from './TypesAndInterfaces';
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

const ProfileStats: React.FC<BroadcasterStatProps> = (props) => {

    let userId: string = "71092938";

    const [apiCheck, setApiCheck] = useState<ProfileData[] | undefined>(undefined);

    const apiCall = async (apiReq: string | undefined, reqUrl: string) => {
        return await getData(apiReq + reqUrl);
    };

    const [dataList, setDataList] = useState<ProfileData[]>([]);

    const [dayDataState, setDayDataState] = useState<Stats[]>([]);

    const streamAmount: number = 7;

    const { loading: loadingStream, data: dataStream, error: errorStream } = useQuery(GET_TOP_STREAM_WEEK);

    const topStreamData: TopStreams[] = dataStream?.getTopStreams[0]?.topStreams;

    let streamerData: Stats[] = createShortStreamerList(topStreamData).sort(Comparator).slice(0, 5);

    let streamerViewTotal: number = 0;

    if (streamerViewTotal === 0 && streamerData?.length > 0) {
        for (let v = 0; v < streamerData?.length; v++) {
            streamerViewTotal += streamerData[v]?.views;
        };
    };



    console.log("streamerData is");
    console.log(streamerData);


    (async () => {

        if (dataList !== undefined && apiCheck === undefined) setApiCheck(dataList);
        
        const apiData = (apiCheck === undefined ? await apiCall(process.env.REACT_APP_GET_VIDEOS, `?user_id=${userId}&type=archive&first=${streamAmount}`) : undefined);

        const apiDataNested = (apiCheck === undefined ? await apiData?.data : undefined);

        const performanceStats = createBroadcasterPerformanceList(props.data)

        console.log("Api Data is")
        console.log(apiData)
        console.log("Api Data NESTED is")
        console.log(apiDataNested)
        console.log("performanceStats is")
        console.log(performanceStats)

        let finalList: ProfileData[] = [];

        let dayData: Stats[] = [];

        for (let i = 0; i < performanceStats?.length; i++) {
            for (let j = 0; j < apiDataNested?.length; j++) {

                if (performanceStats[i]?.stream_id === apiDataNested[j]?.stream_id) {
                    finalList.push({
                        title: apiDataNested[j]?.title,
                        avg: performanceStats[i]?.avg,
                        peak: performanceStats[i]?.peak,
                        date: apiDataNested[j]?.published_at,
                        duration: apiDataNested[j]?.duration,
                    })
                }
            }
        };

        for (let k = 0; k < apiDataNested?.length; k++) {
            let dayName = new Date(apiDataNested[k]?.published_at).toLocaleDateString(undefined, { weekday: "short" });

            if (dayData.length > 0) {
                let index = dayData.findIndex(object => {
                    return object.name === dayName;
                });
                if (index !== -1) {
                    dayData[index].views = dayData[index].views + 1;
                } else {
                    dayData.push({
                        name: dayName,
                        views: 1,
                    });
                };
            } else {
                dayData.push({
                    name: dayName,
                    views: 1,
                });
            };
        }

        if (apiCheck === undefined) {
            setDataList(finalList)
            setDayDataState(dayData)
            console.log("Regular if triggered")
            console.log(dataList)
            console.log("dayData is")
            console.log(dayData)
        } else {
            console.log("ELSE TRIGGERED")
            console.log(dataList)
            console.log("dayData is")
            console.log(dayData)
        }

    })()


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
                            {dataList === undefined || dataList?.length === 0 ?
                                <Typography className='areaChart' variant={'h4'} textAlign='center'>
                                    Loading Chart...
                                </Typography>
                                :
                                dataList?.length < 2 ?
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
                                        profileData={dataList}
                                        type={'view'}
                                    />
                            }
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
                                    user={{name: props.username, views: Math.max(...dataList.map(o => o.peak))}}
                                />
                        }
                    </Grid>
                </Grid>
            </Grid>

        </Box>
    )
}

export default ProfileStats