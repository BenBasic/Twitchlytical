import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography'
import GameProfile from './GameProfile';
import GameStats from './GameStats';

import { GameHeaderData } from './TypesAndInterfaces'

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

    const { loading: loadingTop, data: dataTop, error: errorTop } = useQuery(GET_TOP_GAME_WEEK);

    const topGameData = dataTop?.getTopGames[0]?.topGames;


    const [gameData, setGameData] = useState<GameHeaderData>();

    // State used to avoid premature component render, will set to true when data is ready to display
    const [canMount, setCanMount] = useState<boolean>(false);

    const [viewData, setViewData] = useState<number[]>([]);

    const [channelData, setChannelData] = useState<number[]>([]);

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
            // Adds the most recent view_count values (max of 30) to the recentViewArray for later use to calculate
            // the broadcasters recent average view_count in the Profile component
            for (let i = 0; i < gameArchive?.length && i < 30; i++) {
                recentViewArray.push(gameArchive[(gameArchive.length - 1) - i]?.view_count);
            };
            setViewData(recentViewArray);

            for (let j = 0; j < gameArchive?.length; j++) {
                if (gameArchive[(gameArchive.length - 1) - j]?.totalChannels) {
                    totalChannelArray.push(gameArchive[(gameArchive.length - 1) - j]?.totalChannels);
                }
            };
            setChannelData(totalChannelArray);
        };

        setCanMount(true);
    };

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
                    <GameStats />
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