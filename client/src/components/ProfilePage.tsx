import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography'
import Profile from './Profile'
import ProfileStats from './ProfileStats'
import ProfileClips from './ProfileClips';
import { timeSince } from '../utils/helpers'
import { ProfileHeaderData } from './TypesAndInterfaces'

import { useQuery } from "@apollo/client";
import { GET_BROADCASTER_PERFORMANCE_NAME } from "../utils/queries";

const ProfilePage: React.FC = () => {

    // Assigns the profileId used for api and database calls (references the url of page, ex: /auronplay or /pokimane)
    const { profileId } = useParams();
    console.log("profileId is " + profileId)

    // Grabs the data from the database for the specific streamer based on their profileId
    const { loading, data, error } = useQuery(GET_BROADCASTER_PERFORMANCE_NAME, {
        variables: { id: profileId }
    });

    // Grabs the nested archive data from the above query
    const performanceData = data?.getBroadcasterPerformanceName?.archive;

    const [broadcasterData, setBroadcasterData] = useState<ProfileHeaderData>();

    // State used to avoid premature component render, will set to true when data is ready to display
    const [canMount, setCanMount] = useState<boolean>(false);

    const [viewData, setViewData] = useState<number[]>([]);

    // Checks if loading is done and hasnt already had its completion state triggered, will load top games if so
    if (loading === false && canMount === false) {
        setBroadcasterData({
            user_id: data?.getBroadcasterPerformanceName?.user_id,
            name: data?.getBroadcasterPerformanceName?.name,
            profile_image_url: data?.getBroadcasterPerformanceName?.profile_image_url,
            description: data?.getBroadcasterPerformanceName?.description,
            total_views: data?.getBroadcasterPerformanceName?.total_views,
            createdAt: data?.getBroadcasterPerformanceName?.createdAt,
            broadcaster_type: data?.getBroadcasterPerformanceName?.broadcaster_type,
            lastLive: timeSince(performanceData[performanceData.length - 1]?.createdAt),
        });

        // If viewData hasnt been populated with any view_count numbers, populate the array and set its state
        if (viewData.length === 0) {
            let recentViewArray: number[] = [];
            // Adds the most recent view_count values (max of 30) to the recentViewArray for later use to calculate
            // the broadcasters recent average view_count in the Profile component
            for (let i = 0; i < performanceData?.length && i < 30; i++) {
                recentViewArray.push(performanceData[i]?.view_count);
            };
            setViewData(recentViewArray);
        };

        setCanMount(true);
    };

    console.log("Did I get the data?")
    console.log(performanceData)
    console.log(viewData);


    return (
        <>
            {canMount === true && broadcasterData !== undefined ?
                <>
                    <Profile
                        data={broadcasterData}
                        views={viewData}
                    />
                    <ProfileStats
                        data={performanceData}
                        userId={broadcasterData.user_id}
                        username={broadcasterData.name}
                    />
                    <ProfileClips
                    userId={broadcasterData.user_id}
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

export default ProfilePage