import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import { PageProps } from './TypesAndInterfaces';

const PaginationHandler: React.FC<PageProps> = ({ array, queryHook, querySearch, perPageAmount }) => {

    if (array.length === 0) return <h1>Nested Loading</h1>
    // Creates amount of pages, Math.ceil fits the remainder of the list on a new page if there are less than 10
    const pageCount = Math.ceil(array.length / perPageAmount);

    const query = queryHook;
    const page = parseInt(query.get('page') || '1', pageCount);
    console.log("NESTED RELOAD")
    console.log(page)
    console.log(query.get('page'))

    const lastBroadcasterIndex = page * perPageAmount;
    const firstBroadcasterIndex = lastBroadcasterIndex - perPageAmount;
    // Broadcaster list to be displayed on the current page
    const currentBroadcasterList = array.slice(firstBroadcasterIndex, lastBroadcasterIndex);



    return (
        <>
            <ul>
                {currentBroadcasterList.map((streamer: any, index: number) => (
                    <li key={streamer.name + index}>{streamer.name}</li>
                ))}
            </ul>
            <Pagination
                page={page}
                count={pageCount}
                renderItem={(item) => (
                    <PaginationItem
                        component={Link}
                        to={`/search?query=${querySearch}${item.page === 1 ? '' : `&page=${item.page}`}`}
                        {...item}
                    />
                )}
            />
        </>
    );
}

export default PaginationHandler;