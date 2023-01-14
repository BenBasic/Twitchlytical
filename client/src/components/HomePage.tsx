import React, { useState } from 'react'
import TopStats from './TopStats';
import Header from './Header';
import HomeCharts from './HomeCharts';
import TopClips from './TopClips';
import HomePies from './HomePies';

import { useQuery } from "@apollo/client";
import { GET_TOP_GAME_WEEK, GET_TOP_STREAM_WEEK, GET_BROADCASTER_USER_ID, GET_DATA_DATE, GET_TOP_CLIPS_WEEK } from "../utils/queries";

const HomePage: React.FC = () => {

    const now = new Date();

    const weekQueryDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)

    const { loading: loadingTotals, data: dataTotals, error: errorTotals } = useQuery(GET_DATA_DATE, {
        variables: { date: weekQueryDate },
    });

    const totalObject = dataTotals?.getTotalData?.[0];



    const { loading, data, error } = useQuery(GET_TOP_GAME_WEEK);

    const { loading: loadingStream, data: dataStream, error: errorStream } = useQuery(GET_TOP_STREAM_WEEK);

    const topGameData = data?.getTopGames[0]?.topGames;

    const topStreamData = dataStream?.getTopStreams[0]?.topStreams;

    let userIdArray = [];

    for (let i = 0; i < topStreamData?.length; i++) {
        userIdArray.push(topStreamData[i]?.user_id)
    };

    const { loading: loadingUser, data: dataUser, error: errorUser } = useQuery(GET_BROADCASTER_USER_ID, {
        variables: { id: userIdArray },
    });

    const topUserData = dataUser?.getBroadcaster;

    const { loading: loadingClips, data: dataClips, error: errorClips } = useQuery(GET_TOP_CLIPS_WEEK);

    const topClipData = dataClips?.getTopClips?.[0]?.topClips;


    const [loadingState, setLoadingState] = useState<boolean[]>([loading, loadingStream, loadingUser, loadingClips]);

    const [canMount, setCanMount] = useState<boolean>(false);

    const [topDataLoadingState, setTopDataLoadingState] = useState<boolean>(loadingTotals);

    const [canMountTopData, setCanMountTopData] = useState<boolean>(false);

    console.log("------------------------------------")
    console.log("")
    console.log("loading state is")
    console.log(loadingState)
    console.log("canMount is")
    console.log(canMount)
    console.log("topDataLoadingState is")
    console.log(topDataLoadingState)
    console.log("canMountTopData is")
    console.log(canMountTopData)
    console.log("totalObject is")
    console.log(totalObject)
    console.log("topGameData is")
    console.log(topGameData)
    console.log("")
    console.log("------------------------------------")


    // Checks if loading is done and hasnt already had its completion state triggered, will load top games if so
    if (loading === false && loadingStream === false && loadingUser === false && loadingClips === false &&
        loadingState[0] === true && loadingState[1] === true && loadingState[2] === true && loadingState[3] === true &&
        canMount === false) {
        setLoadingState([false, false, false, false])
        setCanMount(true);
    };

    // Checks if loading is done and hasnt already had its completion state triggered, will load top games if so
    if (loadingTotals === false && topDataLoadingState === true && canMountTopData === false) {
        setTopDataLoadingState(false)
        setCanMountTopData(true);
    };

    // If user has gone back in their browser history to access home page, set mount states to true to display cached data
    if (canMountTopData === false && canMount === false && totalObject !== undefined && topGameData !== undefined) {
        setCanMount(true);
        setCanMountTopData(true);
    };

    return (
        <>
            <Header />
            <HomeCharts
                totalVal={totalObject}
                loading={canMountTopData === true ? false : true}
            />
            <TopStats
                gameProps={topGameData}
                streamProps={topStreamData}
                broadcasterProps={topUserData}
                loading={canMount === true ? false : true}
            />
            <HomePies
                data={topGameData}
                streamData={topStreamData}
                totalVal={totalObject?.avgTotalViewers}
                loading={canMount === true && canMountTopData === true ? false : true}
            />
            <TopClips
                data={topClipData}
                home={true}
                loading={canMount === true ? false : true}
            />
        </>
    )
}

export default HomePage