import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography'
import BroadcasterPerformanceChart from './BroadcasterPerformanceChart';
import { BroadcasterStatProps, ProfileData } from './TypesAndInterfaces';
import { createBroadcasterPerformanceList } from '../utils/helpers'

// Importing colors from Material UI
import { indigo, deepPurple } from '@mui/material/colors';

console.log("env checks are")
console.log(process.env.REACT_APP_CLIENT_ID)
console.log(process.env.REACT_APP_CLIENT_SECRET)
console.log(process.env.REACT_APP_GET_VIDEOS)

// Generates token to be used for fetching data from the twitch api
const getToken = async () => {
    const tokenResponse = await fetch(
        `https://id.twitch.tv/oauth2/token?client_id=${process.env.REACT_APP_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLIENT_SECRET}&grant_type=client_credentials`,
        {
            method: "POST",
        }
    );

    // Grabbing the access_token from the returned json
    const tokenJson = await tokenResponse.json();
    const token = tokenJson.access_token;

    // Returning the token to be referenced in api calls
    return token;
};

const getData = async (reqUrl: string) => {
    const url = reqUrl
    const token = await getToken();

    console.log(`client token is ${token}`)

    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('client-id', `${process.env.REACT_APP_CLIENT_ID}`);
    requestHeaders.set('Authorization', `Bearer ${token}`);
    requestHeaders.set('Accept', `application/json`);
    requestHeaders.set('Content-Type', 'application/json');

    const res = await fetch(url, {
        method: "GET",
        headers: requestHeaders
    })
    let twitch_data = await res.json();

    // Use this to keep track of all data being fetched during calls, if its annoying then just comment it out
    console.log("Twitch Data is -------")
    console.log(twitch_data);

    return twitch_data;
};

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

    let userId: string = "15564828";

    const [apiCheck, setApiCheck] = useState<ProfileData[] | undefined>(undefined);

    const apiCall = async (reqUrl: string) => {
        return await getData(process.env.REACT_APP_GET_VIDEOS + reqUrl);
    }

    const [dataList, setDataList] = useState<ProfileData[]>([]);

    (async () => {

        if (dataList !== undefined && apiCheck === undefined) setApiCheck(dataList);

        const apiData = (apiCheck === undefined ? await apiCall(`?user_id=${userId}&type=archive&first=5`) : undefined);

        const apiDataNested = (apiCheck === undefined ? await apiData?.data : undefined);

        const performanceStats = createBroadcasterPerformanceList(props.data)

        console.log("Api Data is")
        console.log(apiData)
        console.log("Api Data NESTED is")
        console.log(apiDataNested)
        console.log("performanceStats is")
        console.log(performanceStats)

        let finalList: ProfileData[] = [];

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

        if (apiCheck === undefined) {
            setDataList(finalList)
            console.log("Regular if triggered")
            console.log(dataList)
        } else {
            console.log("ELSE TRIGGERED")
            console.log(dataList)
        }

    })()

    // const apiData = apiCall('?user_id=15564828&type=archive&first=5');

    // // const apiDataNested = apiData?.data;

    // const performanceStats = createBroadcasterPerformanceList(props.data)

    // console.log("Api Data is")
    // console.log(apiData)
    // console.log("Api Data NESTED is")
    // console.log(apiData.length)
    // console.log("performanceStats is")
    // console.log(performanceStats)

    // for (let i = 0; i < performanceStats?.length; i++) {
    //     for (let j = 0; j < apiData)
    // }



    return (
        <Box sx={{ flexGrow: 1 }} style={styles.container}>
            <Grid container alignItems="center" justifyContent="center">
                <Grid container maxWidth="md" alignItems="center" justifyContent="center" textAlign='center'>
                    <Grid item xs={12}>
                        <Typography variant={'h4'} mb={2} mt={1} borderBottom={5} borderTop={5} borderColor={deepPurple[700]} style={styles.mainTitle}>
                            All Time Views
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={'h2'} mb={2} mt={0} style={styles.mainTitle}>
                            222,844,538
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {dataList === undefined || dataList?.length === 0 ?
                            <h4>Did this show up?</h4>
                            :
                            <Grid item xs={12} className="homeChartItem">
                                <Typography variant={'h5'} textAlign='center' style={styles.title}
                                    width={'100%'}
                                >
                                    Recent Stream Performance
                                </Typography>
                                <BroadcasterPerformanceChart
                                    profileData={dataList}
                                    type={'view'}
                                />
                            </Grid>

                        }

                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={'h2'} mb={2} mt={0} style={styles.mainTitle}>
                            Performance Chart Goes Here
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={'h2'} mb={2} mt={0} style={styles.mainTitle}>
                            2 Pie Charts, 1: Most Streamed Games, 2: Most Streamed Days /use counter for percentage calc/
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={'h2'} mb={2} mt={0} style={styles.mainTitle}>
                            All Time Most Popular Clips Goes Here
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>

        </Box>
    )
}

export default ProfileStats