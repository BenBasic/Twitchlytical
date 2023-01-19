import React, { useState, useEffect, memo } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { SEARCH_BROADCASTER, SEARCH_GAME } from "../utils/queries";

import SearchHeader from './SearchHeader';
import PaginationHandler from "./PaginationHandler";


const SearchPage: React.FC = () => {

    console.log("RELOAD HAPPENED");

    // States for the final lists for games and broadcasters to be passed into PaginationHandler
    const [casters, setCasters] = useState<any[]>([]);
    const [games, setGames] = useState<any[]>([]);
    // State tracks previous searches, used to help update new lists if new searches are made
    const [prevSearch, setPrevSearch] = useState<string | null>(null);
    // States track if there is data grabbed for broadcasters and games, used to prevent errors related to loading
    const [isCasterData, setIsCasterData] = useState<boolean>(false);
    const [isGameData, setIsGameData] = useState<boolean>(false);

    // State tracks if loading was attempted during current search, used to prevent "no x here" message displaying when loading isnt finished
    const [didLoad, setDidLoad] = useState<boolean>(false);

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
    console.log("Search in page is " + searchQuery)


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
        };

    }, [searchGame]);

    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//

    //vvvvvvvvvvv SEARCH HANDLING (if more searches are made after first search) vvvvvvvvvv//

    // If this is the first load of the search page, set previous search to the current search query
    if (prevSearch === null && searchQuery) setPrevSearch(searchQuery);


    // If there has been a previous search, and the query is now different, requery data with the new search query
    // This makes it so that if a user searches something new while on the search page, new lists will appear
    // Without this, lists would not update when new searches were made after the initial search
    if (prevSearch !== null && prevSearch !== searchQuery) {
        setCasters([]);
        setGames([])
        searchBroadcaster({ variables: { name: searchQuery } });
        searchGame({ variables: { name: searchQuery } });
        setIsCasterData(false);
        setIsGameData(false);
        setPrevSearch(searchQuery);
        setDidLoad(false);
    };

    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//

    // If there is no query, return error screen
    if (!searchQuery) return <h1>Nothing was searched. Please search a term with 3 or more characters.</h1>

    // Lets the component know that data has been loaded (this prevents displaying "no x here" before loading has finished in PaginationHandler)
    if ((casterLoading === true || gameLoading === true) && didLoad === false) setDidLoad(true);

    if (casterError || gameError) return <h1>Woops! An error occured</h1>
    // If there is data available for broadcasters or games, set their isData states to true
    if (isCasterData === false && casterData && casterData?.getBroadcasterName?.length > 0) setIsCasterData(true);
    if (isGameData === false && gameData && gameData?.getGameSearch?.length > 0) setIsGameData(true);


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

    // If user is searching for previously searched term when currently on a page with no results, this prevents and infinite loading state
    if (didLoad === false && casterLoading === false && gameLoading === false && casterData?.getBroadcasterName !== undefined && gameData?.getGameSearch !== undefined) setDidLoad(true);

    console.log("End of SearchPage");

    return (
        <>
            <SearchHeader header={"Searching for"} search={searchQuery} />
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
                        isLoading={didLoad === true && casterLoading === false && gameLoading === false ? false : true}
                    />} />
            </Routes>
        </>
    )
}

export default SearchPage