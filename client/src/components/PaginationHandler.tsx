import React from 'react';
import { Link } from 'react-router-dom';
import Loading from './Loading';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import { PageProps } from './TypesAndInterfaces';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import SearchCard from './SearchCard';

import { indigo } from '@mui/material/colors';

// Object containing style properties used for the MUI implementation throughout this file
const styles = {
    container: {
        backgroundColor: indigo[200],
        borderRadius: '.5rem .5rem .5rem .5rem',
        paddingBottom: '2rem',
        marginTop: '3rem',
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
    pageNums: {
        justifyContent: "center",
        display: 'flex',
        marginTop: '1rem',
    }
};

const PaginationHandler: React.FC<PageProps> = ({ arrayCaster, arrayGame, queryHook, querySearch, perPageAmount, cast, game, isLoading }) => {

    // Helper creates amount of pages for passed in array based on how many results display per page
    // Math.ceil fits the remainder of the list on a new page if there are less than resAmount (set to 10)
    const getPageCount = (arr: any[], resAmount: number) => Math.ceil(arr.length / resAmount);

    // Current query value of user's search
    const query = queryHook;


    // Creating page count for game list
    let gamePageCount: number | undefined;
    // Current (game)page number based on current url
    let gamePage: number | undefined;
    // Page based indexes for Games
    let lastGameIndex: number | undefined;
    let firstGameIndex: number | undefined;
    // Game list to be displayed on the current page
    let currentGameList: any[] | undefined;

    // Creating page count for broadcaster list
    let castPageCount: number | undefined;
    // Current (cast)page number based on current url
    let castPage: number | undefined;
    // Page based indexes for Broadcasters
    let lastBroadcasterIndex: number | undefined;
    let firstBroadcasterIndex: number | undefined;
    // Broadcaster list to be displayed on the current page
    let currentBroadcasterList: any[] | undefined;


    // Helpers to display data from arrays based on their current page
    const lastIndex = (page: number, resAmount: number) => page * resAmount;
    const firstIndex = (lastIndex: number, resAmount: number) => lastIndex - resAmount;


    // If there is data for the game list, define required variables for component display
    if (arrayGame.length > 0) {
        gamePageCount = getPageCount(arrayGame, perPageAmount);
        gamePage = parseInt(query.get(game) || '1') || gamePageCount;
        lastGameIndex = lastIndex(gamePage, perPageAmount);
        firstGameIndex = firstIndex(lastGameIndex, perPageAmount);
        currentGameList = arrayGame.slice(firstGameIndex, lastGameIndex);
        console.log("GAME ARRAY IS TRUE")
    };

    // If there is data for the broadcaster list, define required variables for component display
    if (arrayCaster.length > 0) {
        castPageCount = getPageCount(arrayCaster, perPageAmount);
        castPage = parseInt(query.get(cast) || '1') || castPageCount;
        lastBroadcasterIndex = lastIndex(castPage, perPageAmount);
        firstBroadcasterIndex = firstIndex(lastBroadcasterIndex, perPageAmount);
        currentBroadcasterList = arrayCaster.slice(firstBroadcasterIndex, lastBroadcasterIndex);
        console.log("CASTER ARRAY IS TRUE")
    };

    console.log("NESTED RELOAD");
    console.log(currentGameList)

    return (
        <>
            <Container maxWidth="md" style={styles.container} className="topStatsContainer">

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

                        {isLoading === true ?
                            <Loading /> :
                            currentGameList === undefined ?
                                <Typography variant={'h4'} sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: '700' }} textAlign='center'>
                                    No games found
                                </Typography> :
                                <>

                                    {currentGameList.map((game: any, index: number) => (
                                        <SearchCard
                                            key={game.name + index}
                                            type={"game"}
                                            name={game.name}
                                            id={game._id}
                                        />
                                    ))}

                                    <Pagination
                                        style={styles.pageNums}
                                        size='small'
                                        siblingCount={0}
                                        color='primary'
                                        page={gamePage}
                                        count={gamePageCount}
                                        renderItem={(item) => (
                                            <PaginationItem
                                                component={Link}
                                                to={`/search?query=${querySearch}${item.page === 1 ? '' : `&${game}=${item.page}`}${castPage === 1 ? '' : `&${cast}=${castPage}`}`}
                                                {...item}
                                            />
                                        )}
                                    />
                                </>
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

                        {isLoading === true ?
                            <Loading /> :
                            currentBroadcasterList === undefined ?
                                <Typography variant={'h4'} sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: '700' }} textAlign='center'>
                                    No streamers found
                                </Typography> :
                                <>
                                    {currentBroadcasterList.map((streamer: any, index: number) => (
                                        <SearchCard
                                            key={streamer.name + index}
                                            type={"broadcaster"}
                                            name={streamer.name}
                                            imgUrl={streamer.profile_image_url}
                                        />
                                    ))}
                                    <Pagination
                                        style={styles.pageNums}
                                        size='small'
                                        siblingCount={0}
                                        color='primary'
                                        page={castPage}
                                        count={castPageCount}
                                        renderItem={(item) => (
                                            <PaginationItem
                                                component={Link}
                                                to={`/search?query=${querySearch}${gamePage === 1 ? '' : `&${game}=${gamePage}`}${item.page === 1 ? '' : `&${cast}=${item.page}`}`}
                                                {...item}
                                            />
                                        )}
                                    />
                                </>
                        }
                    </Grid>

                </Grid>

            </Container>




        </>
    );
}

export default PaginationHandler;