import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { ProfileHeaderProps, ProfileHeaderData } from './TypesAndInterfaces';
import { getData } from '../utils/clientFetches';
import { indigo, deepPurple } from '@mui/material/colors';

const styles = {
    container: {
        backgroundColor: '#17085B',
        // borderRadius: '.5rem .5rem .5rem .5rem',
        // marginTop: '1rem',
        padding: '0rem 1rem 1rem 1rem',
    },
    mainTitle: {
        display: 'inline-block',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
        color: 'white',
        backgroundColor: indigo[700],
        borderBottom: '1rem solid ' + indigo[300],
        borderRadius: '1rem 1rem 0rem 0rem'
    },
    title: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
        color: 'white',
        backgroundColor: indigo[700],
        borderRadius: '1rem'
    },
    profilePic: {
        width: '10rem',
        height: '10rem',
        border: '.5rem solid ' + indigo[300]
    },
    infoContainer: {
        backgroundColor: indigo[300],
        borderRadius: '0rem .5rem .5rem .5rem',
        marginTop: '0rem',
        padding: '1rem 1rem 1rem 1rem',
    },
    infoBubbles: {
        display: 'inline',
        color: 'white',
        backgroundColor: indigo[500],
        borderRadius: '1rem 1rem 1rem 1rem',
        padding: '.5rem .5rem .5rem .5rem',
        marginRight: '.2rem',
        fontFamily: 'Outfit, sans-serif',
    },
    liveStats: {
        backgroundColor: indigo[500],
        borderRadius: '1.5rem 1.5rem 1.5rem 1.5rem',
        padding: '.6rem .2rem .6rem .2rem',
    },
    heading: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
        color: 'white',
    },
};

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const Profile: React.FC<ProfileHeaderProps> = (props) => {

    let userData: ProfileHeaderData = props.data;

    //////

    const [apiCheck, setApiCheck] = useState<number | undefined>(undefined);

    const apiCall = async (reqUrl: string) => {
        return await getData(process.env.REACT_APP_GET_FOLLOWS + reqUrl);
    }

    const [dataCheck, setDataCheck] = useState<number>(0);

    (async () => {

        if (dataCheck !== 0 && apiCheck === undefined) setApiCheck(dataCheck);

        const apiData = (apiCheck === undefined ? await apiCall(`?to_id=${userData.user_id}&first=1`) : undefined);

        const apiDataNested = (apiCheck === undefined ? await apiData?.total : undefined);

        if (apiCheck === undefined) {
            setDataCheck(apiDataNested)
            console.log("Profile Component if triggered")
            console.log(dataCheck)
        } else {
            console.log("Profile Component ELSE TRIGGERED")
            console.log(dataCheck)
        }
    })()

    return (
        <Grid container alignItems="center" justifyContent="center">
            <Grid container spacing={0} m={0} maxWidth="md" justifyContent="center" style={styles.container}>
                <Grid item xs={3} alignItems='center' mt={2} sx={{ justifyContent: "center", display: "flex" }}>
                    <Avatar style={styles.profilePic}
                        src={userData.profile_image_url} />
                </Grid>
                <Grid item xs={9} mt={2} textAlign="left">
                    <Typography variant={'h4'} mt={2} mb={0} textAlign='center'
                        style={styles.mainTitle}
                        fontSize={{ xs: '1.85rem', sm: '2.13rem' }}
                    >
                        {userData.name}
                    </Typography>
                    <Grid container maxWidth="md" mt={2} mb={4} alignItems="left" justifyContent="left"
                        style={styles.infoContainer}
                    >
                        <Grid item xs={4} sm={3.3} md={3} mx={{ xs: 0, sm: 1 }} style={styles.liveStats}>
                            <Typography variant={'subtitle2'} textAlign='center' style={styles.heading} fontSize={{ xs: '.6rem', sm: '.8rem' }}>
                                Followers
                            </Typography>
                            <Typography variant={'h4'} textAlign='center' style={styles.heading} fontSize={{ xs: '1.4rem', sm: '2.1rem' }}>
                                { apiCheck !== undefined ? apiCheck.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "Loading..."}
                            </Typography>
                        </Grid>
                        <Grid item xs={4} sm={3.3} md={3} mx={{ xs: 0, sm: 1 }} style={styles.liveStats}>
                            <Typography variant={'subtitle2'} textAlign='center' style={styles.heading} fontSize={{ xs: '.6rem', sm: '.8rem' }}>
                                Average Views
                            </Typography>
                            <Typography variant={'h4'} textAlign='center' style={styles.heading} fontSize={{ xs: '1.4rem', sm: '2.1rem' }}>
                                219,032
                            </Typography>
                        </Grid>
                        <Grid item xs={4} sm={3.3} md={3} mx={{ xs: 0, sm: 1 }} style={styles.liveStats}>
                            <Typography variant={'subtitle2'} textAlign='center' style={styles.heading} fontSize={{ xs: '.6rem', sm: '.8rem' }}>
                                Status
                            </Typography>
                            <Typography variant={'h4'} textAlign='center' style={styles.heading} fontSize={{ xs: '1.4rem', sm: '2.1rem' }}>
                                {userData.broadcaster_type === "" ? "Standard" : capitalizeFirstLetter(userData.broadcaster_type)}
                            </Typography>
                        </Grid>

                        <Grid item xs={6} sm={4.95} md={4.5} mx={{ xs: 0, sm: 1 }} mt={2} style={styles.liveStats}>
                            <Typography variant={'subtitle2'} textAlign='center' style={styles.heading} fontSize={{ xs: '.6rem', sm: '.8rem' }}>
                                Channel Created
                            </Typography>
                            <Typography variant={'h4'} textAlign='center' style={styles.heading} fontSize={{ xs: '1.4rem', sm: '2.1rem' }}>
                                {new Date(userData.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={4.95} md={4.5} mx={{ xs: 0, sm: 1 }} mt={2} style={styles.liveStats}>
                            <Typography variant={'subtitle2'} textAlign='center' style={styles.heading} fontSize={{ xs: '.6rem', sm: '.8rem' }}>
                                Last Live
                            </Typography>
                            <Typography variant={'h4'} textAlign='center' style={styles.heading} fontSize={{ xs: '1.4rem', sm: '2.1rem' }}>
                                {userData.lastLive}
                            </Typography>
                        </Grid>

                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Profile