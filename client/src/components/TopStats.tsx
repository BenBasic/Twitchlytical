import React, { useState } from 'react'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import { createListData, createStreamerData, Comparator } from '../utils/helpers';

// Importing the Stats type for use within the Comparator function
import { Stats, TopProps } from './TypesAndInterfaces';

// Importing the RankCard component for use within the return of TopStats
import RankCard from './RankCard';

// Importing colors from Material UI
// import { amber, orange, deepPurple, blue, green, indigo, cyan } from '@mui/material/colors';

import amber from '@mui/material/colors/amber';
import orange from '@mui/material/colors/orange';
import indigo from '@mui/material/colors/indigo';
import deepPurple from '@mui/material/colors/deepPurple';
import blue from '@mui/material/colors/blue';
import green from '@mui/material/colors/green';

// Object containing style properties used for the MUI implementation throughout this file
const styles = {
    container: {
        backgroundColor: indigo[200],
        borderRadius: '.5rem .5rem .5rem .5rem',
        paddingBottom: '2rem',
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


const TopStats: React.FC<TopProps> = (props) => {

    // Let of test data using an array of the Stats type, this is only used for display testing purposes for now
    let testData: Stats[] = createListData(props.gameProps)

    // Let of test data using an array of the Stats type, this is only used for display testing purposes for now
    let testDataStreamers: Stats[] = createStreamerData(props.streamProps, props.broadcasterProps);

    // Assigning the array of data to sort by value of views from highest to lowest
    testData = testData.sort(Comparator);
    testDataStreamers = testDataStreamers.sort(Comparator);

    // Assigning the topGames state, currently uses the Stats type and sets initial state to the values in testData
    const [topGames, setTopGames] = useState<Stats[]>(testData);

    // Assigning the topStreamers state, currently uses the Stats type and sets initial state to the values in testDataSteamers
    const [topStreamers, setTopStreamers] = useState<Stats[]>(testDataStreamers);

    const [canMount, setCanMount] = useState<boolean>(false);

    // Checks if loading is done and hasnt already had its completion state triggered, will load top games if so
    if (props.loading === false && canMount === false) {
        setTopGames(testData.sort(Comparator))
        setTopStreamers(testDataStreamers)
        setCanMount(true);
    };



    return (

        <Container maxWidth="md" style={styles.container} className="topStatsContainer">

            <Grid item xs={12} textAlign="center">
                <Typography variant={'h4'} mt={2} mb={1} textAlign='center'
                    style={styles.mainTitle}
                    fontSize={{ xs: '1.85rem', sm: '2.13rem' }}
                >
                    Most Popular
                </Typography>
            </Grid>

            <Grid container spacing={2}>

                <Grid item xs={6}>
                    <Grid item xs={12} textAlign="center">
                        <Typography variant={'h4'} mt={1} borderBottom={5} borderColor={indigo[700]} textAlign='center'
                            style={styles.title}
                            fontSize={{ xs: '1.35rem', sm: '2.1rem' }}
                        >
                            Games
                        </Typography>
                    </Grid>

                    {canMount === true ?
                        topGames.slice(0, 10).map((game, index) => (
                            <RankCard statInfo={game} key={index} viewType="avg"
                                color={{ primary: indigo[700], secondary: indigo[900] }}
                                rankIndex={index}
                                rankColor={index === 0 ?
                                    { primary: topColors.best, secondary: topColors.bestDark } :
                                    index > 0 && index < 3 ?
                                        { primary: topColors.great, secondary: topColors.greatDark } :
                                        index > 2 && index < 7 ?
                                            { primary: topColors.good, secondary: topColors.goodDark } :
                                            { primary: topColors.ok, secondary: topColors.okDark }
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
                            fontSize={{ xs: '1.35rem', sm: '2.1rem' }}
                        >
                            Streamers
                        </Typography>
                    </Grid>

                    {canMount === true ?
                        topStreamers.map((streamer, index) => (
                            <RankCard statInfo={streamer} key={index} viewType="peak"
                                color={{ primary: indigo[700], secondary: indigo[900] }}
                                rankIndex={index}
                                rankColor={index === 0 ?
                                    { primary: topColors.best, secondary: topColors.bestDark } :
                                    index > 0 && index < 3 ?
                                        { primary: topColors.great, secondary: topColors.greatDark } :
                                        index > 2 && index < 7 ?
                                            { primary: topColors.good, secondary: topColors.goodDark } :
                                            { primary: topColors.ok, secondary: topColors.okDark }
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