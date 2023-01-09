import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation, useParams, useNavigate } from 'react-router-dom';
import SearchHeader from './SearchHeader';
import { useLazyQuery } from '@apollo/client';
import { DocumentNode } from 'graphql';
import { FILTER_BROADCASTER_VIEWS, FILTER_GAME_VIEWS } from "../utils/queries";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

import SearchCard from './SearchCard';

import { indigo } from '@mui/material/colors';

// Object containing style properties used for the MUI implementation throughout this file
const styles = {
    container: {
        backgroundColor: indigo[200],
        borderRadius: '.5rem .5rem .5rem .5rem',
        paddingBottom: '2rem',
        marginTop: '2rem',
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

const BrowsePage: React.FC = () => {

    // Value will either be Streamers or Games based on what user is browsing
    const { type } = useParams();
    console.log(type);

    // Grabbing current page location
    const location = useLocation();

    const navigate = useNavigate();

    const query = new URLSearchParams(location.search);
    const currentPage = parseInt(query.get('page') || '1')

    // The amount of results shown on each of the 2 columns (ex: 10 will show 20 results on a page)
    const resPerPage: number = 10;

    console.log("Query is")
    console.log(query)
    console.log("currentPage is")
    console.log(currentPage)

    const [list, setList] = useState<any[]>([]);
    // States track if there is data grabbed for broadcasters and games, used to prevent errors related to loading
    const [isData, setIsData] = useState<boolean>(false);

    let typeFilter: DocumentNode | undefined = undefined
    let nestedData: string | undefined = undefined

    // Setting the appropriate values needed for fetching data based on if user is browsing streamers or games
    if (type === "Streamers") {
        typeFilter = FILTER_BROADCASTER_VIEWS;
        nestedData = "sortBroadcasterViews";
    };
    if (type === "Games") {
        typeFilter = FILTER_GAME_VIEWS;
        nestedData = "sortGameViews";
    };

    // Helpers to display data from arrays based on their current page
    const lastIndex = (page: number, resAmount: number) => page * resAmount;
    const firstIndex = (lastIndex: number, resAmount: number) => lastIndex - resAmount;

    // States used for the first and last indexes of the currently displaying list
    const [leftLastIndex, setLeftLastIndex] = useState(lastIndex((currentPage % 10 || 10), resPerPage));
    const [leftFirstIndex, setLeftFirstIndex] = useState(firstIndex(leftLastIndex, resPerPage));
    const [rightLastIndex, setRightLastIndex] = useState(lastIndex(((currentPage % 10 || 10) + 1), resPerPage));
    const [rightFirstIndex, setRightFirstIndex] = useState(firstIndex(rightLastIndex, resPerPage));

    // Grabs the data from the database for the list of games or streamers based on their view_count value
    const [filterBroadcaster, { loading: listLoading, data: listData, error: listError }] = useLazyQuery(typeFilter!, {
        variables: { skip: 0 },
    });

    useEffect(() => {

        if (!isData && list?.length === 0) {
            filterBroadcaster({ variables: { skip: 0 } })
            console.log("inside FILTER useEffect")
        }

    }, [filterBroadcaster]);

    if (listLoading === true) return <h1>Loading Oh Yeah</h1>
    if (listError) return <h1>Woops! An error occured</h1>

    if (isData === false && listData && listData?.[nestedData!]?.length > 0) setIsData(true);

    if (isData === true) {
        // Setting final list state for broadcasters if it hasnt been set yet
        if (list?.length === 0) setList(listData?.[nestedData!]);
    };

    console.log("Browse Final Data State")
    console.log(list);

    let leftList = list.slice(leftFirstIndex, leftLastIndex);
    let rightList = list.slice(rightFirstIndex, rightLastIndex);

    console.log("LEFT || First: " + leftFirstIndex + "// Last: " + leftLastIndex)
    console.log("RIGHT || First: " + rightFirstIndex + "// Last: " + rightLastIndex)

    // When back button is pressed, display the previous set of results
    const prevHandler = () => {
        // If we're not at the start of the list, decrease the index value to display previous set of fetched results
        if (leftList[0] !== list[0]) {
            navigate(`/browse/${type}/${currentPage <= 2 ? '' : `?page=${currentPage - 1}`}`);
            setLeftLastIndex(leftLastIndex - (resPerPage * 2));
            setLeftFirstIndex(leftFirstIndex - (resPerPage * 2));
            setRightLastIndex(rightLastIndex - (resPerPage * 2));
            setRightFirstIndex(rightFirstIndex - (resPerPage * 2));
        };
        // If we're at the start of the list, reset states to default and refetch data for previous set of results
        if (leftList[0] === list[0]) {
            // If on page 1, do nothing (because there will be no previous data to grab)
            if (currentPage === 1) return;

            setList([]);
            filterBroadcaster({ variables: { skip: ((currentPage - 11) * (resPerPage * 2)) } })
            console.log("Prev Calc is " + ((currentPage - 11) * (resPerPage * 2)))
            setIsData(false);
            navigate(`/browse/${type}/${currentPage <= 2 ? '' : `?page=${currentPage - 1}`}`);

            resetPrevIndexes();

            console.log("INSIDE PREV HANDLER")
            console.log("Left Indexes are: leftLast: " + leftLastIndex + " // leftFirst: " + leftFirstIndex)
            console.log("Right Indexes are: rightLast: " + rightLastIndex + " // rightFirst: " + rightFirstIndex)
        }
    };

    // When next button is pressed, display the next set of results
    const nextHandler = () => {
        // If we're not at the end of the list, increase the index value to display next set of fetched results
        if (rightList[rightList.length - 1] !== list[list.length - 1]) {
            navigate(`/browse/${type}/?page=${currentPage + 1}`);
            setLeftLastIndex(leftLastIndex + (resPerPage * 2));
            setLeftFirstIndex(leftFirstIndex + (resPerPage * 2));
            setRightLastIndex(rightLastIndex + (resPerPage * 2));
            setRightFirstIndex(rightFirstIndex + (resPerPage * 2));
        };
        // If we're at the end of the list, reset states to default and refetch data for next set of results
        if (rightList[rightList.length - 1] === list[list.length - 1]) {
            setList([]);
            filterBroadcaster({ variables: { skip: (currentPage * (resPerPage * 2)) } })
            console.log("Next Calc is " + (currentPage * (resPerPage * 2)))
            setIsData(false);
            navigate(`/browse/${type}/?page=${currentPage + 1}`);

            resetNextIndexes();

            console.log("INSIDE NEXT HANDLER")
            console.log("Left Indexes are: leftLast: " + leftLastIndex + " // leftFirst: " + leftFirstIndex)
            console.log("Right Indexes are: rightLast: " + rightLastIndex + " // rightFirst: " + rightFirstIndex)
        }
    }

    // Resets the indexes to default values when new set of data is fetched (ex: first index goes from 180 to 0)
    function resetNextIndexes() {
        setLeftLastIndex(lastIndex((currentPage % 10 || 1), resPerPage));
        setLeftFirstIndex(firstIndex(((currentPage % 10 || 1) * resPerPage), resPerPage));
        setRightLastIndex(lastIndex(((currentPage % 10 || 1) + 1), resPerPage));
        setRightFirstIndex(firstIndex((((currentPage % 10 || 1) + 1) * resPerPage), resPerPage));
    };
    // Resets the indexes to the end values when the previous set of data is fetched (ex: first index goes from 0 to 180)
    function resetPrevIndexes() {
        setLeftLastIndex(list.length - resPerPage);
        setLeftFirstIndex(list.length - (resPerPage * 2));
        setRightLastIndex(list.length);
        setRightFirstIndex(list.length - resPerPage);
    };

    console.log("BOTTOM OF COMPONENT")
    console.log("Left Indexes are: leftLast: " + leftLastIndex + " // leftFirst: " + leftFirstIndex)
    console.log("Right Indexes are: rightLast: " + rightLastIndex + " // rightFirst: " + rightFirstIndex)

    return (
        <>
            <SearchHeader header={"Browsing"} search={type} />

            <Container maxWidth="md" style={styles.container} className="topStatsContainer">

                <Grid item xs={12} textAlign="center">
                    <Typography variant={'h4'} mt={1} borderBottom={5} borderColor={indigo[700]} textAlign='center'
                        style={styles.title}
                        fontSize={{ xs: '1.35rem', sm: '2.1rem' }}
                    >
                        Page {currentPage}
                    </Typography>
                </Grid>

                <Grid container spacing={2}>
                    {list === undefined || list.length === 0 ?
                        <h1>List is undefined</h1> :
                        <>
                            <Grid item xs={6}>
                                {leftList.map((item: any, index: number) => (
                                    <SearchCard
                                        key={item.name + index}
                                        type={type === "Streamers" ? "broadcaster" : "game"}
                                        name={item.name}
                                        id={item._id}
                                        imgUrl={item.profile_image_url}
                                    />
                                ))}
                            </Grid>
                            <Grid item xs={6}>
                                {rightList.map((item: any, index: number) => (
                                    <SearchCard
                                        key={item.name + index}
                                        type={type === "Streamers" ? "broadcaster" : "game"}
                                        name={item.name}
                                        id={item._id}
                                        imgUrl={item.profile_image_url}
                                    />
                                ))}
                            </Grid>
                        </>
                    }

                </Grid>

                <Stack direction="row" spacing={2} style={styles.pageNums}>
                    <Button variant="contained" startIcon={<NavigateBeforeIcon />}
                        onClick={prevHandler}
                    >
                        Back
                    </Button>
                    <Button variant="contained" disabled>Disabled</Button>
                    <Button variant="contained" endIcon={<NavigateNextIcon />}
                        onClick={nextHandler}
                    >
                        Next
                    </Button>
                </Stack>

            </Container>
        </>
    )
}

export default BrowsePage