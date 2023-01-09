import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography'
import GameProfile from './GameProfile';
import GameStats from './GameStats';
import ProfileClips from './ProfileClips';

import { GameHeaderData, GameData } from './TypesAndInterfaces';
import { nestedArrayAverageCalc } from '../utils/helpers';

import { useQuery } from "@apollo/client";
import { GET_GAME_NAME, GET_TOP_GAME_WEEK } from "../utils/queries";

const GamePage: React.FC = () => {

    // Assigns the gameId used for api and database calls (references the url of page, ex: /auronplay or /pokimane)
    const { gameId } = useParams();
    console.log("gameId is " + gameId)

    // Grabs the data from the database for the specific streamer based on their gameId
    const { loading, data, error } = useQuery(GET_GAME_NAME, {
        variables: { id: gameId }
    });

    const gameArchive = data?.getGameName?.archive;

    const dbGameId = data?.getGameName?._id;

    const { loading: loadingTop, data: dataTop, error: errorTop } = useQuery(GET_TOP_GAME_WEEK);

    const topGameData = dataTop?.getTopGames[0]?.topGames;


    const [gameData, setGameData] = useState<GameHeaderData>();

    // State used to avoid premature component render, will set to true when data is ready to display
    const [canMount, setCanMount] = useState<boolean>(false);

    const [viewData, setViewData] = useState<number[]>([]);

    const [channelData, setChannelData] = useState<number[]>([]);

    const [gameChartData, setGameChartData] = useState<GameData[]>([])

    // Checks if loading is done and hasnt already had its completion state triggered, will load top games if so
    if (loading === false && loadingTop === false && canMount === false) {
        setGameData({
            game_id: data?.getGameName?._id,
            name: data?.getGameName?.name,
            liveViews: data?.getGameName?.view_count,
        });

        // If viewData hasnt been populated with any view_count numbers, populate the array and set its state
        if (viewData.length === 0) {
            let recentViewArray: number[] = [];
            let totalChannelArray: number[] = [];
            let gameValArray: any[] = [];
            let count: number = -1;
            let iterateTo: number = gameArchive?.length;

            // If gameArchive is longer than 30, set the max to 30 to iterate through
            if (gameArchive?.length > 30) iterateTo = 30;
            // Adds the most recent view_count values (max of 30) to the recentViewArray for later use to calculate
            // the broadcasters recent average view_count in the Profile component
            for (let i = 0; i < iterateTo; i++) {
                recentViewArray.push(gameArchive[(gameArchive.length - 1) - i]?.view_count);
            };
            setViewData(recentViewArray);

            // Iterates through gameArchive to assign peak values and compile list of values for calculating average
            for (let j = 0; j < gameArchive?.length; j++) {
                if (gameArchive[(gameArchive.length - 1) - j]?.totalChannels) {
                    totalChannelArray.push(gameArchive[(gameArchive.length - 1) - j]?.totalChannels);

                    // Assigning date objects to check for data compiled on the same day
                    let xDate = new Date(gameArchive[(gameArchive.length - 1) - j]?.createdAt);
                    let yDate = new Date(gameArchive[(gameArchive.length) - j]?.createdAt);
                    let xDateObj = new Date(xDate.getFullYear(), xDate.getMonth(), xDate.getDate());
                    let yDateObj = new Date(yDate.getFullYear(), yDate.getMonth(), yDate.getDate());
                    // If current date doesnt match previous date, create a new object
                    if (xDateObj.getTime() !== yDateObj.getTime()) {
                        gameValArray.push({
                            viewPeak: gameArchive[(gameArchive.length - 1) - j]?.view_count,
                            viewAvg: [gameArchive[(gameArchive.length - 1) - j]?.view_count],
                            channelPeak: gameArchive[(gameArchive.length - 1) - j]?.totalChannels,
                            channelAvg: [gameArchive[(gameArchive.length - 1) - j]?.totalChannels],
                            date: xDateObj,
                            title: gameId,
                        })
                        count++;
                    };
                    // If current date matches previous date, check and assign peak values and add values to list for average calculation
                    if (xDateObj.getTime() === yDateObj.getTime()) {
                        if (gameValArray[count]?.viewPeak < gameArchive[(gameArchive.length - 1) - j]?.view_count) {
                            gameValArray[count].viewPeak = gameArchive[(gameArchive.length - 1) - j]?.view_count;
                        };
                        if (gameValArray[count]?.channelPeak < gameArchive[(gameArchive.length - 1) - j]?.totalChannels) {
                            gameValArray[count].channelPeak = gameArchive[(gameArchive.length - 1) - j]?.totalChannels;
                        };
                        gameValArray[count]?.viewAvg.push(gameArchive[(gameArchive.length - 1) - j]?.view_count);
                        gameValArray[count]?.channelAvg.push(gameArchive[(gameArchive.length - 1) - j]?.totalChannels);
                    };

                };
            };
            // Calculates view and channel averages
            gameValArray = nestedArrayAverageCalc(gameValArray, 'viewAvg');
            gameValArray = nestedArrayAverageCalc(gameValArray, 'channelAvg');

            // Setting state for the new gameValArray (reversed to display oldest to newest date order in chart)
            setGameChartData(gameValArray.reverse());
            // Setting state with the list of totalChannel values for overall average calculation for game
            setChannelData(totalChannelArray);
        };
        // Setting mount state to true, this tells the component that its ready to load
        setCanMount(true);
    };
    console.log("GAMEPAGE chartData is")
    console.log(gameChartData)

    return (
        <>
            {canMount === true && gameData !== undefined ?
                <>
                    <GameProfile
                        data={gameData}
                        views={viewData}
                        channels={channelData}
                        gameProps={topGameData}
                    />
                    <GameStats
                        chartData={gameChartData}
                    />
                    <ProfileClips
                        userId={dbGameId}
                        game={true}
                    />
                </> :
                <Grid container alignItems="center" justifyContent="center">
                    <Grid container maxWidth="md" alignItems="center" justifyContent="center" textAlign='center'>
                        <Grid item xs={12}>
                            <Typography variant={'h4'}>
                                Loading Stats...
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            }

        </>
    )
}

export default GamePage