import React, { useState, useEffect, memo } from 'react';
import { Link, MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useQuery, useLazyQuery } from '@apollo/client';
import { SEARCH_BROADCASTER, SEARCH_GAME } from "../utils/queries";

import PaginationHandler from "./PaginationHandler";


const SearchPage: React.FC = () => {

    console.log("RELOAD HAPPENED")

    const [casters, setCasters] = useState<any[]>([])

    // Number of results allowed to display per page
    const resultsPerPage: number = 10;

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const searchQuery = query.get('query');
    console.log(query)
    console.log(location)

    const [searchBroadcaster, { loading: casterLoading, data: casterData, error: casterError }] = useLazyQuery(SEARCH_BROADCASTER, {
        variables: { name: searchQuery },
    });

    // // Grabs the data from the database for the list of streamers based on their name
    // const { loading, data, error } = useQuery(SEARCH_BROADCASTER, {
    //     variables: { name: searchQuery }
    // });

    // // Grabs the data from the database for the list of games based on their name
    // const { loading: gameLoading, data: gameData, error: gameError } = useQuery(SEARCH_GAME, {
    //     variables: { name: searchQuery }
    // });

    // Assigning nested data pulled from above queries to arrays
    const broadcasterList = casterData?.getBroadcasterName;

    // Assigning empty arrays, will be sorted if exact match is found
    let broadcasterArray: any[] = [];
    let gameArray: any[] = [];

    useEffect(() => {

        if (!casterData && casters?.length === 0) {
            searchBroadcaster({ variables: { name: searchQuery } })
            console.log("inside useEffect")
        }

    }, [searchBroadcaster]);

    // If there is no query, return error screen
    if (!searchQuery) return <h1>Nothing was searched!!!</h1>
    // If the data is still loading, or there is an error, display the appropriate page
    if (casterLoading === true) return <h1>Loading Oh Yeah</h1>
    if (casterError) return <h1>Woops! An error occured</h1>
    if (!casterData) return <h1>No Data!</h1>

    if (casters?.length === 0) {
        setCasters(casterData?.getBroadcasterName);
        console.log("IF CHECK CASTER")
    }
    console.log("casterData is ")
    console.log(casterData)
    console.log("Casters is")
    console.log(casters)
    console.log("Broadcaster list here")
    console.log(broadcasterList)

    // If there is an exact name match, reorder the array so its the top of the list
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

    // Reordering both lists so exact matches will display at the top
    if (casters?.length > 0) broadcasterArray = moveToTop(casters, searchQuery)
    
    console.log("End of SearchPage")

    return (

        <>

            <Routes>
                <Route path="*"
                    element={<PaginationHandler
                        array={broadcasterArray}
                        queryHook={query}
                        querySearch={searchQuery}
                        perPageAmount={resultsPerPage}
                    />} />
            </Routes>


            {/* <h3>Streamers</h3>
            <ul>
                {broadcasterArray.map((streamer: any, index: number) => (
                    <li key={streamer.name + index}>{streamer.name}</li>
                ))}
            </ul>
            <h3>Games</h3>
            <ul>
                {gameArray.map((game: any, index: number) => (
                    <li key={game.name + index}>{game.name}</li>
                ))}
            </ul> */}
        </>
    )
}

export default SearchPage