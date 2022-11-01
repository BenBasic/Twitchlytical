import React from 'react'
import { useQuery } from "@apollo/client";
import { GET_TOTAL_DATA } from "../utils/queries";

const now = new Date();

const HomeCharts: React.FC = () => {

    const { loading, data, error } = useQuery(GET_TOTAL_DATA);

    const archiveData = data?.getTotalData?.[0]?.archive;

    console.log(archiveData?.[0].createdAt)

    console.log(now)
    console.log(typeof now)

    return (
        <div>Test</div>
    )
}

export default HomeCharts