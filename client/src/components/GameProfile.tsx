import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import { GameHeaderProps, GameHeaderData, Stats } from './TypesAndInterfaces';
import {
    numOrdinalFormat,
    miniGetAverage,
    createListData,
    Comparator,
    miniComparator,
    specialCategories,
    gameUrlReturner
} from '../utils/helpers';
import useResize from '../utils/resizeHook';
import { ThemeProvider } from '@mui/material/styles';
import { rankCard } from '../utils/themes';
import { indigo, deepPurple } from '@mui/material/colors';



const styles = {
    headerBox: {
        backgroundColor: '#17085B',
    },
    container: {
        backgroundColor: '#17085B',
        // borderRadius: '.5rem .5rem .5rem .5rem',
        // marginTop: '1rem',
        padding: '0rem 1rem 1rem 1rem',
    },
    mainTitle: {
        display: 'inline-block',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
        color: 'white',
        backgroundColor: indigo[700],
        // borderBottom: '1rem solid ' + indigo[300],
        borderRadius: '1rem 1rem 0rem 0rem'
    },
    mainTitleBorder: {
        xs: 'none',
        mobileXs: '1rem solid ' + indigo[300],
    },
    title: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
        color: 'white',
        backgroundColor: indigo[700],
        borderRadius: '1rem'
    },
    profilePic: {
        // width: '10rem',
        // height: '10rem',
        border: '.5rem solid ' + indigo[300],
        borderRadius: '1rem',
    },
    infoContainer: {
        backgroundColor: indigo[300],
        // borderRadius: '0rem .5rem .5rem .5rem',
        marginTop: '0rem',
    },
    infoContainerPadding: {
        xs: '1rem 0.3rem 1rem 0.3rem',
        mobileXs: '1rem 1rem 1rem 1rem',
        sm: '1rem 1rem 1rem 1rem',
    },
    infoBubbles: {
        display: 'inline',
        color: 'white',
        backgroundColor: indigo[500],
        borderRadius: '1rem 1rem 1rem 1rem',
        padding: '.5rem .5rem .5rem .5rem',
        marginRight: '.2rem',
        fontFamily: 'Outfit, sans-serif',
    },
    liveStats: {
        backgroundColor: indigo[500],
        // borderRadius: '1.5rem 1.5rem 1.5rem 1.5rem',
        padding: '.6rem .2rem .6rem .2rem',
    },
    heading: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
        color: 'white',
    },
    allTimeTitle: {
        display: 'inline-block',
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
    },
    headingFonts: {
        xs: '.6rem',
        sm: '.8rem',
    },
    infoFonts: {
        // xs: '1.4rem', sm: '2.1rem'
        xs: '0.6rem',
        mobileXs: '1rem',
        sm: '1.4rem',
        smPlus: '1.7rem',
        smWide: '2.1rem',
        md: '2.1rem',
    },
    infoBorderMid: {
        xs: '0rem 0rem 0rem 0rem',
        sm: '1.5rem 1.5rem 1.5rem 1.5rem'
    },
    infoBorderLeft: {
        xs: '1rem 0rem 0rem 1rem',
        sm: '1.5rem 1.5rem 1.5rem 1.5rem'
    },
    infoBorderRight: {
        xs: '0rem 1rem 1rem 0rem',
        sm: '1.5rem 1.5rem 1.5rem 1.5rem'
    },
};

const GameProfile: React.FC<GameHeaderProps> = (props) => {

    // Calling imported useResize hook to track width between mainTitle and infoContainer elements
    const [widthState, textWidth, container, textContainer] = useResize();

    let gameData: GameHeaderData = props.data;

    // Let of test data using an array of the Stats type, this is only used for display testing purposes for now
    let gameRankList: Stats[] = createListData(props.gameProps).sort(Comparator);

    let gameImage: string = "";

    let gameRank: string = "";

    // Checks if game is in top game list, if so then it will set the gameImage to the matching url
    for (let i = 0; i < gameRankList?.length; i++) {
        if (gameData.name === gameRankList[i].name) {
            gameRank = (i + 1) + numOrdinalFormat(i + 1);
            if (gameRankList[i].image !== undefined) gameImage = gameRankList[i].image!;
        };
    };

    // If the game isnt in the top game list, the name value will be checked to assign the proper url needed for the game picture
    if (gameImage === "" && gameData.name) gameImage = gameUrlReturner(specialCategories, gameData.name, gameData.game_id);

    props.views.sort(miniComparator);
    props.channels.sort(miniComparator);

    // Assigning the topGames state, currently uses the Stats type and sets initial state to the values in testData
    const [topGames, setTopGames] = useState<Stats[]>(gameRankList);

    const [canMount, setCanMount] = useState<boolean>(false);

    // Checks if loading is done and hasnt already had its completion state triggered, will load top games if so
    if (topGames.length > 0 && canMount === false) {
        setTopGames(gameRankList.sort(Comparator)) // Might not need this line, test later to check
        // Something here to check if game name matches one in the gameRankList to see if it has a rank to show
        setCanMount(true);
    };

    // Calculates average views a stream playing this game will get
    function viewsPerStream(views: number, streams: number) {
        // Getting the average value by dividing views and streams
        let average = views / streams;
        return parseFloat(average.toFixed());
    }

    let pTopRight: number = 0.5
    if (widthState !== undefined && textWidth !== undefined) {
        if (widthState <= textWidth) pTopRight = 0;
    };

    console.log("game rank list is")
    console.log(gameRankList)

    return (
        <>
            <ThemeProvider theme={rankCard}>
                <Grid container alignItems="center" justifyContent="center">
                    <Box sx={{ flexGrow: 1 }} style={styles.headerBox}>
                        <Grid container alignItems="center" justifyContent="center">
                            <Grid container spacing={0} m={0} maxWidth="md" justifyContent="center" style={styles.container}>
                                {/* Profile Picture */}
                                <Grid item xs={3} alignItems='center' mt={2} sx={{ justifyContent: "center", display: { xs: "none", sm: "flex" } }}>
                                    <Avatar style={styles.profilePic} sx={{ width: { sm: "7.5rem", md: "10.5rem" }, height: { sm: "10rem", md: "14rem" } }}
                                        src={gameImage} variant="square" />
                                </Grid>
                                <Grid item xs={9} mt={2} textAlign="left">
                                    {/* Username */}
                                    <Typography ref={textContainer} variant={'h4'} mt={2} mb={0} textAlign='center'
                                        style={styles.mainTitle}
                                        fontSize={{ xs: '1.85rem', sm: '2.13rem' }}
                                        paddingBottom={{ xs: 0.4, mobileXs: 0}}
                                        paddingTop={{ xs: 0.4, mobileXs: 0}}
                                        borderBottom={styles.mainTitleBorder}
                                    >
                                        {gameData.name}
                                    </Typography>
                                    <Grid ref={container} container maxWidth="md" mt={2} mb={4} alignItems="left" justifyContent="left"
                                        style={styles.infoContainer}
                                        padding={styles.infoContainerPadding}
                                        sx={{ borderRadius: `0rem ${pTopRight}rem .5rem .5rem` }}
                                    >
                                        <Grid item xs={6} sm={4.95} md={4.5} mx={{ xs: 0, sm: 1 }} style={styles.liveStats}
                                            sx={{ borderRadius: styles.infoBorderLeft }}
                                        >
                                            <Typography variant={'subtitle2'} textAlign='center' style={styles.heading} fontSize={styles.headingFonts}>
                                                Peak Views
                                            </Typography>
                                            <Tooltip title={props.views.length > 0 ? props.views[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "Loading..."} placement="bottom" arrow disableInteractive
                                                enterDelay={500}
                                                TransitionProps={{ timeout: 600 }}>
                                                <Typography variant={'h4'} textAlign='center' style={styles.heading} fontSize={styles.infoFonts}
                                                >
                                                    {props.views.length > 0 ? props.views[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
                                                </Typography>
                                            </Tooltip>
                                        </Grid>
                                        <Grid item xs={6} sm={4.95} md={4.5} mx={{ xs: 0, sm: 1 }} style={styles.liveStats}
                                            sx={{ borderRadius: styles.infoBorderRight }}
                                        >
                                            <Typography variant={'subtitle2'} textAlign='center' style={styles.heading} fontSize={styles.headingFonts}>
                                                Avg Views
                                            </Typography>
                                            <Typography variant={'h4'} textAlign='center' style={styles.heading} fontSize={styles.infoFonts}>
                                                {props.views.length > 0 ? miniGetAverage(props.views).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
                                            </Typography>
                                        </Grid>


                                        <Grid item xs={4} sm={3.3} md={3} mx={{ xs: 0, sm: 1 }} mt={2} style={styles.liveStats}
                                            sx={{ borderRadius: styles.infoBorderLeft }}
                                        >
                                            <Typography variant={'subtitle2'} textAlign='center' style={styles.heading} fontSize={styles.headingFonts}>
                                                Peak Streams
                                            </Typography>
                                            <Typography variant={'h4'} textAlign='center' style={styles.heading} fontSize={styles.infoFonts}>
                                                {props.channels.length > 0 ? props.channels[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4} sm={3.3} md={3} mx={{ xs: 0, sm: 1 }} mt={2} style={styles.liveStats}
                                            sx={{ borderRadius: styles.infoBorderMid }}
                                        >
                                            <Typography variant={'subtitle2'} textAlign='center' style={styles.heading} fontSize={styles.headingFonts}>
                                                Avg Streams
                                            </Typography>
                                            <Typography variant={'h4'} textAlign='center' style={styles.heading} fontSize={styles.infoFonts}>
                                                {props.channels.length > 0 ? miniGetAverage(props.channels).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4} sm={3.3} md={3} mx={{ xs: 0, sm: 1 }} mt={2} style={styles.liveStats}
                                            sx={{ borderRadius: styles.infoBorderRight }}
                                        >
                                            <Typography variant={'subtitle2'} textAlign='center' style={styles.heading} fontSize={styles.headingFonts}>
                                                {gameRank === "" ? 'Views Per Stream' : 'Rank'}
                                            </Typography>
                                            <Typography variant={'h4'} textAlign='center' style={styles.heading} fontSize={styles.infoFonts}>
                                                {gameRank === "" ? viewsPerStream(miniGetAverage(props.views), miniGetAverage(props.channels)) : gameRank}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>

                </Grid>

                <Grid container alignItems="center" justifyContent="center">
                    <Grid container maxWidth="md" alignItems="center" justifyContent="center" textAlign='center'>
                        <Grid item xs={12}>
                            <Typography variant={'h4'} mb={2} mt={1} borderBottom={5} borderTop={5} borderColor={deepPurple[700]} style={styles.allTimeTitle}>
                                {/* Broadcaster Total Views is depreciated from API, maybe include disclaimer about it being out of date */}
                                Current Live Views
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant={'h2'} mb={2} mt={0} style={styles.allTimeTitle}
                                fontSize={{ xs: '2rem', sm: '3rem', md: '4rem' }}
                            >
                                {gameData.liveViews ? gameData.liveViews.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </ThemeProvider>
        </>
    )
}

export default GameProfile