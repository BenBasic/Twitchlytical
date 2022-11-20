import React from 'react'
import Profile from './Profile'
import ProfileStats from './ProfileStats'
import { createBroadcasterPerformanceList } from '../utils/helpers'

import { useQuery } from "@apollo/client";
import { GET_BROADCASTER_PERFORMANCE } from "../utils/queries";



const ProfilePage: React.FC = () => {

    const { loading, data, error } = useQuery(GET_BROADCASTER_PERFORMANCE, {
        variables: { id: "15564828" }
    });

    const performanceData = data?.getBroadcasterPerformance?.archive

    console.log("Did I get the data?")
    console.log(performanceData)

    return (
        <>
            <Profile />
            <ProfileStats />
        </>
    )
}

export default ProfilePage