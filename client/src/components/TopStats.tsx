import React, { useState } from 'react'
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar';

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

    // Let of test data using an array of the Stats type, this is only used for display testing purposes for now
    let testData: Stats[] = [
        {
            name: "Overwatch",
            views: 103040,
            image: "https://static-cdn.jtvnw.net/ttv-boxart/509658-210x280.jpg",
        },
        {
            name: "Stardew Valley",
            views: 24500,
            image: "https://image.api.playstation.com/cdn/UP2456/CUSA06840_00/0WuZecPtRr7aEsQPv2nJqiPa2ZvDOpYm.png",
        },
        {
            name: "Fallout New Vegas",
            views: 3100,
            image: "https://howlongtobeat.com/games/Fallout_New_Vegas.jpg",
        },
        {
            name: "Minecraft",
            views: 4680,
            image: "https://www.mobygames.com/images/covers/l/672322-minecraft-playstation-4-front-cover.jpg",
        },
        {
            name: "Xcom 2",
            views: 20003,
            image: "https://www.mobygames.com/images/covers/l/425882-xcom-2-war-of-the-chosen-playstation-4-front-cover.jpg",
        },
        {
            name: "Portal 2",
            views: 302,
            image: "http://s01.riotpixels.net/data/b5/cf/b5cfe10d-7290-4bcb-a89d-e5d0e07b89f4.jpg/cover.portal-2.1024x1024.2014-04-24.1116.jpg",
        },
        {
            name: "Sid Meier's Civilization VI",
            views: 72301,
            image: "https://static-cdn.jtvnw.net/ttv-boxart/492553_IGDB-210x280.jpg",
        },
        {
            name: "Pavlov VR",
            views: 135,
            image: "https://cdna.artstation.com/p/assets/images/images/022/303/284/large/david-sheep-pavlov-01.jpg?1574894810",
        },
        {
            name: "Fall Guys",
            views: 6300,
            image: "https://www.mobygames.com/images/covers/l/676144-fall-guys-ultimate-knockout-playstation-4-front-cover.png",
        },
        {
            name: "Compound",
            views: 30005,
            image: "https://thumbnails.pcgamingwiki.com/5/55/New_cover.png/300px-New_cover.png",
        },
    ];


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


                    {topGames.map((game, index) => (
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
                    ))}

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