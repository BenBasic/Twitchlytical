import React, { useState } from 'react'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar';
import { useQuery } from "@apollo/client";
import { GET_TOP_GAME_WEEK } from "../utils/queries";

// Importing the Stats type for use within the Comparator function
import { Stats } from './TypesAndInterfaces';

// Importing the RankCard component for use within the return of TopStats
import RankCard from './RankCard';

// Importing colors from Material UI
import { amber, orange, deepPurple, blue, green, teal, cyan } from '@mui/material/colors';

// Object containing style properties used for the MUI implementation throughout this file
const styles = {
    container: {
        backgroundColor: teal[100],
    },
    mainTitle: {
        display: 'inline-block',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
        color: 'white',
        backgroundColor: teal[700],
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

    const topGameData = data?.getTopGames[0]?.topGames;

    const [loadingState, setLoadingState] = useState<boolean>(loading);

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


    // Let of test data using an array of the Stats type, this is only used for display testing purposes for now
    let testDataStreamers: Stats[] = [
        {
            name: "MOISTCR1TIKAL",
            views: 103040,
            image: "https://static-cdn.jtvnw.net/jtv_user_pictures/fc7b15b2-e400-4e74-8c8b-2ad3725e5770-profile_image-300x300.png",
        },
        {
            name: "Emiru",
            views: 24500,
            image: "https://yt3.ggpht.com/ytc/AMLnZu-8R7HpB66AznXoaDb5sQFpD4DXbCyqnDncT_yMFw=s900-c-k-c0x00ffffff-no-rj",
        },
        {
            name: "Pokimane",
            views: 3100,
            image: "https://upload.wikimedia.org/wikipedia/commons/1/10/Pokimane_2019.png",
        },
        {
            name: "IronMouse",
            views: 4680,
            image: "https://wegotthiscovered.com/wp-content/uploads/2022/04/FLtfwy3WQAIDTJW.jpg",
        },
        {
            name: "CDawgVA",
            views: 20003,
            image: "https://pbs.twimg.com/profile_images/1528374271407378434/cngzQWHr_400x400.jpg",
        },
        {
            name: "Mori Calliope",
            views: 302,
            image: "https://yt3.ggpht.com/8B_T08sx8R7XVi5Mwx_l9sjQm5FGWGspeujSvVDvd80Zyr-3VvVTRGVLOnBrqNRxZp6ZeXAV=s900-c-k-c0x00ffffff-no-rj",
        },
        {
            name: "Gawr Gura",
            views: 72301,
            image: "https://yt3.ggpht.com/uMUat6yJL2_Sk6Wg2-yn0fSIqUr_D6aKVNVoWbgeZ8N-edT5QJAusk4PI8nmPgT_DxFDTyl8=s900-c-k-c0x00ffffff-no-rj",
        },
        {
            name: "Trash Taste",
            views: 135,
            image: "https://yt3.ggpht.com/ytc/AMLnZu_ftgC9BGqAjjTQBtT6w9lMWgfQzihCQ5MmnlE=s900-c-k-c0x00ffffff-no-rj",
        },
        {
            name: "Lugwig",
            views: 6300,
            image: "https://www.svg.com/img/gallery/ludwig-makes-a-surprising-claim-about-amouranth/intro-1624629959.jpg",
        },
        {
            name: "Joe Bartolozzi",
            views: 30005,
            image: "https://yt3.ggpht.com/MbrQnkNF6nHK8xDmMvJ0AckDshGXT1OSQnuAWYsOIWBczy_5Fy5w4yVWdL1YBTe5AmxDpmPY=s900-c-k-c0x00ffffff-no-rj",
        },
    ];


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

    // Checks if loading is done and hasnt already had its completion state triggered, will load top games if so
    if (loading === false && loadingState === true) {
        setLoadingState(false)
        setTopGames(testData.sort(Comparator))
    };
    console.log("TOP GAMES STATE IS")
    console.log(topGames)

    // Assigning the topStreamers state, currently uses the Stats type and sets initial state to the values in testDataSteamers
    const [topStreamers, setTopStreamers] = useState<Stats[]>(testDataStreamers);



    return (

        <Container maxWidth="md" style={styles.container} className="topStatsContainer">

            <Grid item xs={12} textAlign="center">
                <Typography variant={'h4'} mt={2} mb={1} textAlign='center' style={styles.mainTitle}>
                    Most Popular
                </Typography>
            </Grid>

            <Grid container spacing={2}>

                <Grid item xs={6}>
                    <Grid item xs={12} textAlign="center">
                        <Typography variant={'h4'} mt={1} borderBottom={5} borderColor={cyan[700]} textAlign='center' style={styles.title}>
                            Games
                        </Typography>
                    </Grid>

                    {loading === false ?
                        topGames.slice(0, 10).map((game, index) => (
                            <RankCard statInfo={game} key={index}
                            color={{primary: teal[700], secondary: teal[900]}}
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
                        <Typography variant={'h4'} mt={1} borderBottom={5} borderColor={cyan[700]} textAlign='center' style={styles.title}>
                            Streamers
                        </Typography>
                    </Grid>

                    {topStreamers.map((streamer, index) => (
                        <RankCard statInfo={streamer} key={index}
                        color={{primary: teal[700], secondary: teal[900]}}
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
                    ))}

                </Grid>

            </Grid>

        </Container>

    )
}

export default TopStats