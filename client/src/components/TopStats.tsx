import React, { useState } from 'react'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useQuery } from "@apollo/client";
import { GET_TOP_GAME_WEEK, GET_TOP_STREAM_WEEK, GET_BROADCASTER_USER_ID } from "../utils/queries";

// Importing the Stats type for use within the Comparator function
import { Stats } from './TypesAndInterfaces';

// Importing the RankCard component for use within the return of TopStats
import RankCard from './RankCard';

// Importing colors from Material UI
import { amber, orange, deepPurple, blue, green, indigo, cyan } from '@mui/material/colors';

// Object containing style properties used for the MUI implementation throughout this file
const styles = {
    container: {
        backgroundColor: indigo[200],
        borderRadius: '.5rem .5rem 0rem 0rem',
        paddingBottom: '1rem',
    },
    mainTitle: {
        display: 'inline-block',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
        color: 'white',
        backgroundColor: indigo[700],
        borderRadius: '1rem'
    },
    title: {
        display: 'inline-block',
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
    },
};


// Defining object containing ranked property color values 
const topColors = {
    best: amber[700],
    bestDark: orange[900],
    great: deepPurple[500],
    greatDark: deepPurple[900],
    good: blue[700],
    goodDark: blue[900],
    ok: green[700],
    okDark: green[900],
};


const TopStats: React.FC = () => {

    const { loading, data, error } = useQuery(GET_TOP_GAME_WEEK);

    const { loading: loadingStream, data: dataStream, error: errorStream } = useQuery(GET_TOP_STREAM_WEEK);

    const topGameData = data?.getTopGames[0]?.topGames;

    const topStreamData = dataStream?.getTopStreams[0]?.topStreams;

    let userIdArray = [];

    for (let i = 0; i < topStreamData?.length; i ++) {
        userIdArray.push(topStreamData[i]?.user_id)
    };

    console.log("USER ID ARRAY CHECK")
    console.log(userIdArray)

    const { loading: loadingUser, data: dataUser, error: errorUser } = useQuery(GET_BROADCASTER_USER_ID, {
        variables: { id: userIdArray },
    });

    const topUserData = dataUser?.getBroadcaster;

    const [loadingState, setLoadingState] = useState<boolean[]>([loading, loadingStream, loadingUser]);

    console.log("Data check")
    console.log(topGameData)
    

    // This function will reference archives after a specified date and provide a rounded average value
    const createListData = (array: any[], keyValue: string, keyValue2: string) => {

        let finalResult = [];

        // Cycles through the returned list of archive data and adds them to the total and count values
        for (let i = 0; i < array?.length; i++) {
            // Total and Count will keep track of total values and how many of them there are to divide them into an average number
            let total = 0;
            let count = 0;
            let imgUrl = "";
            let twitchGameId = array[i]?._id;
            let name = array[i]?.name
            for (let j = 0; j < array[i][keyValue].length; j++) {
                total = total + array[i][keyValue][j][keyValue2];

                count++
            }
            // Getting the average value by dividing total and count
            let average: any = total / count;

            // Rounding the average, without this the database tends to throw errors due to long decimal values
            let averageRounded: number = average.toFixed()*1;

            if (name === "Just Chatting" || name === "Music" || name === "Poker" || name === "ASMR" ||
            name === "Art" || name === "Retro" || name === "Sports" || name === "Chess" ||
            name === "Pools, Hot Tubs, and Beaches" || name === "Talk Shows & Podcasts") {
                imgUrl = `https://static-cdn.jtvnw.net/ttv-boxart/${twitchGameId}-210x280.jpg`
            } else {
                imgUrl = `https://static-cdn.jtvnw.net/ttv-boxart/${twitchGameId}_IGDB-210x280.jpg`
            }

            finalResult.push({
                name: name,
                views: averageRounded,
                image: imgUrl,
            })
        };


        // Returning the rounded average result
        return finalResult;
    };

    // Let of test data using an array of the Stats type, this is only used for display testing purposes for now
    let testData: Stats[] = createListData(topGameData, "archive", "view_count")

    console.log("TEST DATA IS")
    console.log(testData)

    const createStreamerData = (array: any[]) => {
        let finalResult = [];
        console.log("ARRAY CHECK")
        console.log(array)
        console.log("TOP USER CHECK")
        console.log(dataUser)

        for (let i = 0; i < array?.length; i++) {
            for (let j = 0; j < topUserData?.length; j++) {
                if (array[i]?.user_id === topUserData[j]?.user_id) {

                    finalResult.push({
                        name: array[i]?.user_name,
                        views: array[i]?.peak_views,
                        image: topUserData[j]?.profile_image_url
                    })
                };
            };
        };

        console.log("Create Streamer Data Result Is")
        console.log(finalResult)
        return finalResult;
    };

    // Let of test data using an array of the Stats type, this is only used for display testing purposes for now
    let testDataStreamers: Stats[] = createStreamerData(topStreamData);


    // Comparator function which will sort cards by views highest to lowest
    function Comparator(a:Stats, b:Stats) {
        if (a.views < b.views) return 1;
        if (a.views > b.views) return -1;
        return 0;
    };
    
    // Assigning the array of data to sort by value of views from highest to lowest
    testData = testData.sort(Comparator);
    testDataStreamers = testDataStreamers.sort(Comparator);

    // Assigning the topGames state, currently uses the Stats type and sets initial state to the values in testData
    const [topGames, setTopGames] = useState<Stats[]>(testData);

    // Assigning the topStreamers state, currently uses the Stats type and sets initial state to the values in testDataSteamers
    const [topStreamers, setTopStreamers] = useState<Stats[]>(testDataStreamers);

    // Checks if loading is done and hasnt already had its completion state triggered, will load top games if so
    if (loading === false && loadingStream === false && loadingUser === false &&
        loadingState[0] === true && loadingState[1] === true && loadingState[2] === true) {
        setLoadingState([false, false, false])
        setTopGames(testData.sort(Comparator))
        setTopStreamers(testDataStreamers)
    };
    console.log("TOP GAMES STATE IS")
    console.log(topGames)



    return (

        <Container maxWidth="md" style={styles.container} className="topStatsContainer">

            <Grid item xs={12} textAlign="center">
                <Typography variant={'h4'} mt={2} mb={1} textAlign='center'
                style={styles.mainTitle}
                fontSize={{ xs: '1.85rem', sm: '2.13rem'}}
                >
                    Most Popular
                </Typography>
            </Grid>

            <Grid container spacing={2}>

                <Grid item xs={6}>
                    <Grid item xs={12} textAlign="center">
                        <Typography variant={'h4'} mt={1} borderBottom={5} borderColor={indigo[700]} textAlign='center'
                        style={styles.title}
                        fontSize={{ xs: '1.35rem', sm: '2.1rem'}}
                        >
                            Games
                        </Typography>
                    </Grid>

                    {loading === false && loadingStream === false && loadingUser === false ?
                        topGames.slice(0, 10).map((game, index) => (
                            <RankCard statInfo={game} key={index} viewType="avg"
                            color={{primary: indigo[700], secondary: indigo[900]}}
                            rankIndex={index}
                            rankColor={ index === 0 ?
                                {primary: topColors.best, secondary: topColors.bestDark} :
                                index > 0 && index < 3 ?
                                {primary: topColors.great, secondary: topColors.greatDark} :
                                index > 2 && index < 7 ?
                                {primary: topColors.good, secondary: topColors.goodDark} :
                                {primary: topColors.ok, secondary: topColors.okDark}
                            }
                            ></RankCard>
                        )) :
                        <Typography variant={'h4'}>
                            Loading...
                        </Typography>
                    }


                </Grid>


                <Grid item xs={6}>

                    <Grid item xs={12} textAlign="center">
                        <Typography variant={'h4'} mt={1} borderBottom={5} borderColor={indigo[700]} textAlign='center'
                        style={styles.title}
                        fontSize={{ xs: '1.35rem', sm: '2.1rem'}}
                        >
                            Streamers
                        </Typography>
                    </Grid>

                    {loading === false && loadingStream === false && loadingUser === false ?
                        topStreamers.map((streamer, index) => (
                            <RankCard statInfo={streamer} key={index} viewType="peak"
                            color={{primary: indigo[700], secondary: indigo[900]}}
                            rankIndex={index}
                            rankColor={ index === 0 ?
                                {primary: topColors.best, secondary: topColors.bestDark} :
                                index > 0 && index < 3 ?
                                {primary: topColors.great, secondary: topColors.greatDark} :
                                index > 2 && index < 7 ?
                                {primary: topColors.good, secondary: topColors.goodDark} :
                                {primary: topColors.ok, secondary: topColors.okDark}
                            }
                            ></RankCard>
                        )) :
                        <Typography variant={'h4'}>
                        Loading...
                        </Typography>
                    }


                </Grid>

            </Grid>

        </Container>

    )
}

export default TopStats