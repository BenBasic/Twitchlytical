import React, { useState } from 'react'
import { getData } from '../utils/clientFetches';
import Typography from '@mui/material/Typography'
import TopClips from './TopClips';
import { ProfileClipsProps } from './TypesAndInterfaces'

const ProfileClips: React.FC<ProfileClipsProps> = (props) => {

    let isGame: boolean = false;
    if (props.game !== undefined && props.game === true) isGame = true;

    let gameOrBroadcaster: string = isGame === true ? `?game_id=` : `?broadcaster_id=`

    let userId: string = props.userId;

    const [apiCheck, setApiCheck] = useState<any[] | undefined>(undefined);

    const apiCall = async (apiReq: string | undefined, reqUrl: string) => {
        return await getData(apiReq + reqUrl);
    };

    const [dataList, setDataList] = useState<any[]>([]);

    const clipAmount: number = 10;

    (async () => {

        if (dataList !== undefined && apiCheck === undefined) setApiCheck(dataList);

        const apiData = (apiCheck === undefined ? await apiCall(process.env.REACT_APP_GET_CLIPS, `${gameOrBroadcaster}${userId}&first=${clipAmount}`) : undefined);

        const apiDataNested = (apiCheck === undefined ? await apiData?.data : undefined);

        console.log("CLIP Api Data is")
        console.log(apiData)
        console.log("CLIP Api Data NESTED is")
        console.log(apiDataNested)

        if (apiCheck === undefined) {
            setDataList(apiDataNested)
            console.log("CLIP Regular if triggered")
            console.log(dataList)
        } else {
            console.log("CLIP ELSE TRIGGERED")
            console.log(dataList)
        }

    })()

    return (
        <>
            {dataList === undefined || dataList?.length === 0 ?
                <Typography className='areaChart' variant={'h4'} textAlign='center'>
                    Loading Chart...
                </Typography>
                :
                <TopClips
                    data={dataList}
                    home={false}
                    loading={dataList === undefined || dataList?.length === 0 ? true : false}
                />
            }
        </>
    )
}

export default ProfileClips