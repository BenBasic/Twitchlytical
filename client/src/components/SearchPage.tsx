import React, { useState, useEffect, memo } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { SEARCH_BROADCASTER, SEARCH_GAME } from "../utils/queries";

import PaginationHandler from "./PaginationHandler";


const SearchPage: React.FC = () => {

    console.log("RELOAD HAPPENED");

    // States for the final lists for games and broadcasters to be passed into PaginationHandler
    const [casters, setCasters] = useState<any[]>([]);
    const [games, setGames] = useState<any[]>([]);

    const [isCasterData, setIsCasterData] = useState<boolean>(false);
    const [isGameData, setIsGameData] = useState<boolean>(false);

    // Page types used for url pagination
    const castPage = 'castpage';
    const gamePage = 'gamepage';

    // Number of results allowed to display per page
    const resultsPerPage: number = 10;

    // Grabbing current page location
    const location = useLocation();
    // Grabbing /search path
    const query = new URLSearchParams(location.search);
    // Grabbing user's search query (ex: url of ?query=call will return 'call')
    const searchQuery = query.get('query');


    //vvvvvvvvvvvvvvv LAZY QUERIES (not activated until called in useEffect) vvvvvvvvvvvvvvv//

    // Grabs the data from the database for the list of streamers based on their name
    const [searchBroadcaster, { loading: casterLoading, data: casterData, error: casterError }] = useLazyQuery(SEARCH_BROADCASTER, {
        variables: { name: searchQuery },
    });
    // Grabs the data from the database for the list of games based on their name
    const [searchGame, { loading: gameLoading, data: gameData, error: gameError }] = useLazyQuery(SEARCH_GAME, {
        variables: { name: searchQuery },
    });

    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//

    //vvvvvvvvvvvvvvvvv CALLING QUERIES (if data doesnt exist yet) vvvvvvvvvvvvvvvvvvvvvvvvv//

    useEffect(() => {

        if (!casterData && casters?.length === 0) {
            searchBroadcaster({ variables: { name: searchQuery } })
            console.log("inside CASTER useEffect")
        }

    }, [searchBroadcaster]);

    useEffect(() => {

        if (!gameData && games?.length === 0) {
            searchGame({ variables: { name: searchQuery } })
            console.log("inside GAME useEffect")
        }

    }, [searchGame]);

    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//


    // If there is no query, return error screen
    if (!searchQuery) return <h1>Nothing was searched!!!</h1>
    // If the data is still loading, or there is an error, display the appropriate page
    if (casterLoading === true || gameLoading === true) return <h1>Loading Oh Yeah</h1>
    if (casterError || gameError) return <h1>Woops! An error occured</h1>
    // If there is data available for broadcasters or games, set their isData states to true
    if (isCasterData === false && casterData && casterData?.getBroadcasterName?.length > 0) setIsCasterData(true);
    if (isGameData === false && gameData && gameData?.getGameSearch?.length > 0) setIsGameData(true);

    console.log("casterData is ")
    console.log(casterData)

    // Assigning empty arrays, will be sorted if exact match is found
    let broadcasterArray: any[] = [];
    let gameArray: any[] = [];

    // If there is valid broadcaster data, set and sort the data to pass into PaginationHandler
    if (isCasterData === true) {
        // Setting final list state for broadcasters if it hasnt been set yet
        if (casters?.length === 0) setCasters(casterData?.getBroadcasterName);
        // Reordering broadcaster list so exact matches will display at the top
        if (casters?.length > 0) broadcasterArray = moveToTop(casters, searchQuery);
    };
    // If there is valid game data, set and sort the data to pass into PaginationHandler
    if (isGameData === true) {
        // Setting final list state for games if it hasnt been set yet
        if (games?.length === 0) setGames(gameData?.getGameSearch);
        // Reordering game list so exact matches will display at the top
        if (games?.length > 0) gameArray = moveToTop(games, searchQuery);
    };

    // Helper for reordering an array so exact name matches go to the top of the list
    function moveToTop(arr: any[], val: string) {
        let arrCopy = [...arr]
        arrCopy.some(function (a, i) {
            if (a.name.toLowerCase() === val.toLowerCase()) {
                arrCopy.unshift(arrCopy.splice(i, 1)[0]);
                return true;
            };
            return false;
        });
        return arrCopy;
    };

    console.log("End of SearchPage");

    return (
        <Routes>
            <Route path="*"
                element={<PaginationHandler
                    arrayCaster={broadcasterArray}
                    arrayGame={gameArray}
                    queryHook={query}
                    querySearch={searchQuery}
                    perPageAmount={resultsPerPage}
                    cast={castPage}
                    game={gamePage}
                />} />
        </Routes>
    )
}

export default SearchPage