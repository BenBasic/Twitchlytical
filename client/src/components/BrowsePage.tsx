import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import Loading from './Loading';
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

    const [list, setList] = useState<any[]>([]);
    // States track if there is data grabbed for broadcasters and games, used to prevent errors related to loading
    const [isData, setIsData] = useState<boolean>(false);

    // States track previous and current route page history, used to prevent route related content display errors
    const [prevPath, setPrevPath] = useState<string>("");
    const [currPath, setCurrPath] = useState<string>(location.search);

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

    // Values for multiplication and subtraction used to fix errors caused by navigation without using back or next buttons
    let reloadFixMult: number = 1;
    let reloadFixSub: number = 0;
    if (currentPage !== 1) {
        reloadFixMult = 2;
        reloadFixSub = 1;
    };

    // States used for the first and last indexes of the currently displaying list
    const [leftLastIndex, setLeftLastIndex] = useState(lastIndex(((currentPage % 10 || 10) * reloadFixMult) - reloadFixSub, resPerPage));
    const [leftFirstIndex, setLeftFirstIndex] = useState(firstIndex(leftLastIndex, resPerPage));
    const [rightLastIndex, setRightLastIndex] = useState(lastIndex((((currentPage % 10 || 10) * reloadFixMult) + 1) - reloadFixSub, resPerPage));
    const [rightFirstIndex, setRightFirstIndex] = useState(firstIndex(rightLastIndex, resPerPage));



    // Grabs the data from the database for the list of games or streamers based on their view_count value
    const [filterBroadcaster, { loading: listLoading, data: listData, error: listError }] = useLazyQuery(typeFilter!, {
        variables: { skip: 0 },
    });

    // Calculates how many items in the database to skip fetching based on page value ranges
    const skipVal = (fetchNum: number, page: number, perPage: number) => {
        let range = Math.floor((page - 1) / perPage) + 1
        return (range - 1) * fetchNum;
    };



    // Assigns previous and current page states when '?page=' changes in the route path (needed for routing error prevention)
    useEffect(() => {
        if (prevPath !== location.search) {
            console.log("prevPath triggered")
            setPrevPath(currPath);
            setCurrPath(location.search);
        }
    }, [location]);

    // Handles data fetching if visiting a page with no data
    useEffect(() => {
        // If there is no data, and list state has not been set, fetch data
        if (!isData && list?.length === 0) {
            filterBroadcaster({ variables: { skip: skipVal(200, currentPage, resPerPage) } })
        };
    }, [filterBroadcaster, type, list]);



    // Handles page switching between Streamers and Games browsing pages, prevents incorrect lists from displaying
    if (list?.length > 0) {

        // If user switches between Games and Streamers browsing pages, reset states to default
        if (checkListType("Broadcaster", "Games") === true) pageSwitch();
        if (checkListType("Game", "Streamers") === true) pageSwitch();

        // If on a refetch page (1, 11, 21, etc) and the left and right list indexes arent at the correct values, reset states to default
        if (currentPage % 10 === 1 && checkValues(currentPage, leftFirstIndex, rightFirstIndex) === false) pageSwitch();
        
        /*
            List will reset to the beginning results if user selects the same page again on the NavBar menu
            More specifically, if the user does the above action, this will prevent the list from not changing if on a refetch page (11, 21, 31, etc)
        */
        if (currPath === '' && prevPath.length > 0) {
            setPrevPath("");
            pageSwitch();
        };
    };


    
    // If the data is still loading, or there is an error, display the appropriate page
    if (listLoading === true) return <Loading />
    if (listError) return <h1>Woops! An error occured</h1>
    // If there is data available to populate the list, let program know to set appropriate states and stop fetching data
    if (isData === false && listData && listData?.[nestedData!]?.length > 0) setIsData(true);

    if (isData === true) {
        // Setting final list state for broadcasters if it hasnt been set yet
        if (list?.length === 0) setList(listData?.[nestedData!]);
    };



    // Sets appropriate indexes to display the current data based on the current page
    let leftList = list.slice(leftFirstIndex, leftLastIndex);
    let rightList = list.slice(rightFirstIndex, rightLastIndex);

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
            // Resets indexes to the previous page's value
            resetPrevIndexes();
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
            // Resets indexes to the next page's value
            resetNextIndexes();
        };
    };

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
    // Resets the indexes to page 1 values if user navigates between games and streamers browsing pages
    function resetTypeIndexes() {
        setLeftLastIndex(lastIndex(1, resPerPage));
        setLeftFirstIndex(firstIndex((1 * resPerPage), resPerPage));
        setRightLastIndex(lastIndex((1 + 1), resPerPage));
        setRightFirstIndex(firstIndex(((1 + 1) * resPerPage), resPerPage));
    };
    // Page switching logic, resets states to default and fetches first page's data from the database
    function pageSwitch() {
        console.log("pageSwitch skipVal is " + skipVal(200, currentPage, resPerPage))
        setList([]);
        setIsData(false);
        resetTypeIndexes();
        filterBroadcaster({ variables: { skip: skipVal(200, currentPage, resPerPage) } })
    };

    /* 
        Checks if the current list contains data for the same page type the user is trying to load
        This is used for checking if the user has switched pages using the NavBar while on the browse page
    */
    function checkListType(refType: "Broadcaster" | "Game", desiredType: "Streamers" | "Games") {
        return list[0]?.__typename === refType && type === desiredType;
    }

    /*  
        Checks if the left and right list indexes are the correct value in relation to the current page
        Follows this pattern || 
        page: 1, leftI: 0, rightI: 10 // page: 2, leftI: 20, rightI: 30 // page: 11, leftI: 0, rightI: 10
    */
    function checkValues(currPage: number, leftFirstIndex: number, rightFirstIndex: number): boolean {
        const modCurrPage = currPage % 10 || 10;
        const expectedLeftFirstIndex = (modCurrPage - 1) * 20;
        const expectedRightFirstIndex = expectedLeftFirstIndex + 10;
        return leftFirstIndex === expectedLeftFirstIndex && rightFirstIndex === expectedRightFirstIndex;
    };

    console.log("BOTTOM OF COMPONENT")

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
                        disabled={currentPage === 1}
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