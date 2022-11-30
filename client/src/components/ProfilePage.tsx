import React, { useState } from 'react'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography'
import Profile from './Profile'
import ProfileStats from './ProfileStats'

import { useQuery } from "@apollo/client";
import { GET_BROADCASTER_PERFORMANCE } from "../utils/queries";

const ProfilePage: React.FC = () => {

    console.log("PROFILE PAGE RENDER!!!")

    const { loading, data, error } = useQuery(GET_BROADCASTER_PERFORMANCE, {
        variables: { id: "15564828" }
    });

    const performanceData = data?.getBroadcasterPerformance?.archive

    const [canMount, setCanMount] = useState<boolean>(false);

    // Checks if loading is done and hasnt already had its completion state triggered, will load top games if so
    if (loading === false && canMount === false) {
        setCanMount(true);
    };



    console.log("Did I get the data?")
    console.log(performanceData)

    return (
        <>
            <Profile />
            {canMount === true ?
                <ProfileStats
                    data={performanceData}
                /> :
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