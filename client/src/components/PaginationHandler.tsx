import React from 'react';
import { Link } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import { PageProps } from './TypesAndInterfaces';

const PaginationHandler: React.FC<PageProps> = ({ arrayCaster, arrayGame, queryHook, querySearch, perPageAmount, cast, game }) => {

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

    return (
        <>
            {currentGameList === undefined ?
                <h1>Games are undefined</h1> :
                <>
                    <ul>
                        {currentGameList.map((game: any, index: number) => (
                            <li key={game.name + index}>{game.name}</li>
                        ))}
                    </ul>
                    <Pagination
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

            {currentBroadcasterList === undefined ?
                <h1>Streamers are undefined</h1> :
                <>
                    <ul>
                        {currentBroadcasterList.map((streamer: any, index: number) => (
                            <li key={streamer.name + index}>{streamer.name}</li>
                        ))}
                    </ul>
                    <Pagination
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

        </>
    );
}

export default PaginationHandler;